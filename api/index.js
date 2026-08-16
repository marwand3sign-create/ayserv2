const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const https = require("https");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "fbf1121012b01e876de336f483b248fb69e2383050414248d9e76c28ab3b3e65";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "ayser@tuningbyayser.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AyserTBA@2026";
const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI || "";
const DB_NAME = process.env.DB_NAME || "tba_database";

// In-Memory fallback store if MongoDB is not yet connected
const inMemoryStore = {
  services: [],
  brands: [],
  faq: [],
  bookings: [],
  settings: {
    whatsapp: "9647703055957",
    phoneDisplay: "+964 770 305 5957",
    phoneDisplay2: "+964 773 775 7771",
    cityAr: "العراق - اربيل - الصناعة الشمالية - كراج 98",
    cityEn: "Iraq — Erbil — North Industrial — Garage 98",
    cityKu: "عێراق - هەولێر - پیشەسازیی باکوور - گەراجی ٩٨",
    instagram: "https://www.instagram.com/tuned_by_ayser",
    tiktok: "https://www.tiktok.com/@aesaraeob",
    facebook: "https://www.facebook.com/share/1EdnVYNcJF/",
    power: 245,
    torque: 360,
    response: 18,
    telegramBotToken: "",
    telegramChatId: "",
  },
  admin: {
    email: ADMIN_EMAIL,
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    name: "Ayser",
  },
  loginAttempts: {},
};

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (!MONGO_URL) return null;
  if (cachedDb) return cachedDb;
  try {
    const client = new MongoClient(MONGO_URL, { maxPoolSize: 10 });
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(DB_NAME);
    // Seed admin if not existing
    const adminCollection = cachedDb.collection("admins");
    const existing = await adminCollection.findOne({ email: ADMIN_EMAIL });
    if (!existing) {
      await adminCollection.insertOne({
        email: ADMIN_EMAIL,
        password_hash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        name: "Ayser",
        created_at: new Date().toISOString(),
      });
    }
    return cachedDb;
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to in-memory store:", err.message);
    return null;
  }
}

// Telegram notification helper
function sendTelegram(token, chatId, text) {
  if (!token || !chatId) return;
  const payload = JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" });
  const req = https.request(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
      timeout: 5000,
    },
    () => {}
  );
  req.on("error", (e) => console.warn("Telegram error:", e.message));
  req.write(payload);
  req.end();
}

// Auth Middleware
async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = await getDb();
    if (db) {
      const admin = await db.collection("admins").findOne({ email: decoded.sub }, { projection: { password_hash: 0, _id: 0 } });
      if (!admin) return res.status(401).json({ detail: "Admin not found" });
      req.admin = admin;
    } else {
      if (decoded.sub !== ADMIN_EMAIL) return res.status(401).json({ detail: "Admin not found" });
      req.admin = { email: ADMIN_EMAIL, name: inMemoryStore.admin.name };
    }
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Session expired or invalid token" });
  }
}

// ==================== PUBLIC ROUTES ====================

app.get("/api/content", async (req, res) => {
  const db = await getDb();
  if (db) {
    const services = await db.collection("services").find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
    const brands = await db.collection("brands").find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
    const faq = await db.collection("faq").find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
    const settingsDoc = await db.collection("settings").findOne({ key: "site" }, { projection: { _id: 0, key: 0 } });
    return res.json({
      services,
      brands,
      faq,
      settings: { ...inMemoryStore.settings, ...(settingsDoc || {}) },
    });
  }
  return res.json({
    services: inMemoryStore.services,
    brands: inMemoryStore.brands,
    faq: inMemoryStore.faq,
    settings: inMemoryStore.settings,
  });
});

app.post("/api/bookings", async (req, res) => {
  const { name, phone, brand, model, year, engine, service, notes, lang } = req.body || {};
  if (!name || !phone || !brand) {
    return res.status(400).json({ detail: "Name, phone, and brand are required" });
  }
  const id = `bkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const booking = {
    id,
    name,
    phone,
    brand,
    model: model || "",
    year: year || "",
    engine: engine || "",
    service: service || "",
    notes: notes || "",
    lang: lang || "ar",
    status: "new",
    created_at: new Date().toISOString(),
    admin_notes: "",
  };

  const db = await getDb();
  let settings = inMemoryStore.settings;
  if (db) {
    await db.collection("bookings").insertOne({ ...booking });
    const sDoc = await db.collection("settings").findOne({ key: "site" });
    if (sDoc) settings = { ...settings, ...sDoc };
  } else {
    inMemoryStore.bookings.unshift(booking);
  }

  // Telegram alert
  const token = settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const text = `🚗 <b>حجز جديد - TUNING BY AYSER</b>\n\n👤 <b>الاسم:</b> ${name}\n📱 <b>الهاتف:</b> <code>${phone}</code>\n🚘 <b>السيارة:</b> ${brand} ${model} (${year})\n⚙️ <b>المحرك:</b> ${engine || "-"}\n🔧 <b>الخدمة:</b> ${service || "-"}\n📝 <b>ملاحظات:</b> ${notes || "-"}`;
    sendTelegram(token, chatId, text);
  }

  return res.json({ ok: true, id });
});

app.get("/api/booking-status", async (req, res) => {
  const phone = (req.query.phone || "").toString().trim();
  if (!phone || phone.length < 4) {
    return res.status(400).json({ detail: "Phone number required" });
  }
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const suffix = cleanPhone.length >= 8 ? cleanPhone.slice(-8) : cleanPhone;

  let doc = null;
  const db = await getDb();
  if (db) {
    doc = await db.collection("bookings").findOne({ phone: { $regex: suffix } }, { projection: { _id: 0, name: 0 } });
  } else {
    doc = inMemoryStore.bookings.find((b) => b.phone.includes(suffix));
  }

  if (!doc) return res.json({ found: false, message: "No active booking found" });
  return res.json({
    found: true,
    booking: {
      id: doc.id,
      brand: doc.brand,
      model: doc.model,
      year: doc.year,
      service: doc.service,
      status: doc.status || "new",
      created_at: doc.created_at,
      admin_notes: doc.admin_notes || "",
    },
  });
});

// ==================== AUTH ROUTES ====================

app.post("/api/auth/login", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";
  const db = await getDb();

  let admin = null;
  if (db) {
    admin = await db.collection("admins").findOne({ email });
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }
  } else {
    if (email !== ADMIN_EMAIL || !bcrypt.compareSync(password, inMemoryStore.admin.passwordHash)) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }
    admin = inMemoryStore.admin;
  }

  const token = jwt.sign({ sub: email, role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
  return res.json({ token, admin: { email, name: admin.name || "Admin" } });
});

app.get("/api/auth/me", requireAdmin, (req, res) => {
  return res.json(req.admin);
});

app.post("/api/auth/change-password", requireAdmin, async (req, res) => {
  const { current_password, new_password } = req.body || {};
  if (!new_password || new_password.length < 8) {
    return res.status(400).json({ detail: "Password must be at least 8 characters" });
  }
  const db = await getDb();
  if (db) {
    const admin = await db.collection("admins").findOne({ email: req.admin.email });
    if (!admin || !bcrypt.compareSync(current_password, admin.password_hash)) {
      return res.status(400).json({ detail: "Current password is incorrect" });
    }
    await db.collection("admins").updateOne(
      { email: req.admin.email },
      { $set: { password_hash: bcrypt.hashSync(new_password, 10), password_changed: true } }
    );
  } else {
    if (!bcrypt.compareSync(current_password, inMemoryStore.admin.passwordHash)) {
      return res.status(400).json({ detail: "Current password is incorrect" });
    }
    inMemoryStore.admin.passwordHash = bcrypt.hashSync(new_password, 10);
  }
  return res.json({ ok: true });
});

// ==================== ADMIN ROUTES ====================

app.post("/api/admin/import-defaults", requireAdmin, async (req, res) => {
  const { services, brands, faq } = req.body || {};
  const db = await getDb();
  if (db) {
    if (services && (await db.collection("services").countDocuments({})) === 0) {
      await db.collection("services").insertMany(services.map((s, i) => ({ ...s, id: s.id || `srv_${i}`, order: i })));
    }
    if (brands && (await db.collection("brands").countDocuments({})) === 0) {
      await db.collection("brands").insertMany(brands.map((b, i) => ({ ...b, id: b.id || `brd_${i}`, order: i })));
    }
    if (faq && (await db.collection("faq").countDocuments({})) === 0) {
      await db.collection("faq").insertMany(faq.map((f, i) => ({ ...f, id: f.id || `faq_${i}`, order: i })));
    }
    if ((await db.collection("settings").countDocuments({ key: "site" })) === 0) {
      await db.collection("settings").insertOne({ key: "site", ...inMemoryStore.settings });
    }
  } else {
    if (services && inMemoryStore.services.length === 0) inMemoryStore.services = services;
    if (brands && inMemoryStore.brands.length === 0) inMemoryStore.brands = brands;
    if (faq && inMemoryStore.faq.length === 0) inMemoryStore.faq = faq;
  }
  return res.json({ ok: true });
});

// Generic CRUD helper
["services", "brands", "faq"].forEach((collection) => {
  app.get(`/api/admin/${collection}`, requireAdmin, async (req, res) => {
    const db = await getDb();
    if (db) {
      const items = await db.collection(collection).find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
      return res.json(items);
    }
    return res.json(inMemoryStore[collection]);
  });

  app.post(`/api/admin/${collection}`, requireAdmin, async (req, res) => {
    const item = { ...req.body, id: req.body.id || `item_${Date.now()}` };
    delete item._id;
    const db = await getDb();
    if (db) {
      await db.collection(collection).insertOne({ ...item });
    } else {
      inMemoryStore[collection].push(item);
    }
    return res.json(item);
  });

  app.put(`/api/admin/${collection}/:id`, requireAdmin, async (req, res) => {
    const item = { ...req.body };
    delete item._id;
    delete item.id;
    const db = await getDb();
    if (db) {
      await db.collection(collection).updateOne({ id: req.params.id }, { $set: item });
      const updated = await db.collection(collection).findOne({ id: req.params.id }, { projection: { _id: 0 } });
      return res.json(updated);
    }
    const idx = inMemoryStore[collection].findIndex((x) => x.id === req.params.id);
    if (idx !== -1) inMemoryStore[collection][idx] = { ...inMemoryStore[collection][idx], ...item };
    return res.json(inMemoryStore[collection][idx] || {});
  });

  app.delete(`/api/admin/${collection}/:id`, requireAdmin, async (req, res) => {
    const db = await getDb();
    if (db) {
      await db.collection(collection).deleteOne({ id: req.params.id });
    } else {
      inMemoryStore[collection] = inMemoryStore[collection].filter((x) => x.id !== req.params.id);
    }
    return res.json({ ok: true });
  });
});

app.put("/api/admin/settings", requireAdmin, async (req, res) => {
  const payload = { ...req.body };
  delete payload._id;
  delete payload.key;
  const db = await getDb();
  if (db) {
    await db.collection("settings").updateOne({ key: "site" }, { $set: payload }, { upsert: true });
    const doc = await db.collection("settings").findOne({ key: "site" }, { projection: { _id: 0, key: 0 } });
    return res.json({ ...inMemoryStore.settings, ...(doc || {}) });
  }
  inMemoryStore.settings = { ...inMemoryStore.settings, ...payload };
  return res.json(inMemoryStore.settings);
});

app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
  const { status, q } = req.query;
  const db = await getDb();
  if (db) {
    const query = {};
    if (status && status !== "all") query.status = status;
    if (q && q.trim()) {
      const safeQ = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: safeQ, $options: "i" } },
        { phone: { $regex: safeQ, $options: "i" } },
        { brand: { $regex: safeQ, $options: "i" } },
        { model: { $regex: safeQ, $options: "i" } },
      ];
    }
    const bookings = await db.collection("bookings").find(query, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(1000).toArray();
    return res.json(bookings);
  }
  let list = inMemoryStore.bookings;
  if (status && status !== "all") list = list.filter((b) => b.status === status);
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    list = list.filter((b) => b.name?.toLowerCase().includes(term) || b.phone?.includes(term) || b.brand?.toLowerCase().includes(term));
  }
  return res.json(list);
});

app.patch("/api/admin/bookings/:id", requireAdmin, async (req, res) => {
  const payload = { ...req.body };
  delete payload._id;
  delete payload.id;
  const db = await getDb();
  if (db) {
    await db.collection("bookings").updateOne({ id: req.params.id }, { $set: payload });
    const updated = await db.collection("bookings").findOne({ id: req.params.id }, { projection: { _id: 0 } });
    return res.json(updated);
  }
  const idx = inMemoryStore.bookings.findIndex((b) => b.id === req.params.id);
  if (idx !== -1) inMemoryStore.bookings[idx] = { ...inMemoryStore.bookings[idx], ...payload };
  return res.json(inMemoryStore.bookings[idx] || {});
});

app.delete("/api/admin/bookings/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  if (db) {
    await db.collection("bookings").deleteOne({ id: req.params.id });
  } else {
    inMemoryStore.bookings = inMemoryStore.bookings.filter((b) => b.id !== req.params.id);
  }
  return res.json({ ok: true });
});

app.get("/api/admin/bookings-export", requireAdmin, async (req, res) => {
  const db = await getDb();
  const rows = db ? await db.collection("bookings").find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(5000).toArray() : inMemoryStore.bookings;
  const headers = ["created_at", "name", "phone", "brand", "model", "year", "engine", "service", "notes", "status", "admin_notes"];
  const csvRows = [headers.join(",")];
  rows.forEach((r) => {
    const values = headers.map((h) => `"${(r[h] || "").toString().replace(/"/g, '""')}"`);
    csvRows.push(values.join(","));
  });
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=bookings.csv");
  return res.send("\ufeff" + csvRows.join("\n"));
});

app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  const db = await getDb();
  const bookings = db ? await db.collection("bookings").find({}, { projection: { _id: 0 } }).toArray() : inMemoryStore.bookings;
  const total = bookings.length;
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  const byStatus = { new: 0, contacted: 0, done: 0, cancelled: 0 };
  bookings.forEach((b) => {
    const s = b.status || "new";
    if (byStatus[s] !== undefined) byStatus[s]++;
    else byStatus.new++;
  });

  const topServicesMap = {};
  const topBrandsMap = {};
  bookings.forEach((b) => {
    if (b.service) topServicesMap[b.service] = (topServicesMap[b.service] || 0) + 1;
    if (b.brand) topBrandsMap[b.brand] = (topBrandsMap[b.brand] || 0) + 1;
  });

  const topServices = Object.entries(topServicesMap).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  const topBrands = Object.entries(topBrandsMap).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 6);

  return res.json({
    total,
    today: bookings.filter((b) => (b.created_at || "").startsWith(todayStr)).length,
    week: bookings.filter((b) => (b.created_at || "") >= weekAgo).length,
    byStatus,
    topServices,
    topBrands,
    daily: [],
  });
});

module.exports = app;
