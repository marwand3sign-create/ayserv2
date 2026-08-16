import csv
import io
import json
import logging
import os
import re
import urllib.request
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from auth import require_admin

logger = logging.getLogger(__name__)
_db = None

public_router = APIRouter(prefix="/api", tags=["content"])
admin_router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])

DEFAULT_SETTINGS: Dict[str, Any] = {
    "whatsapp": "9647703055957",
    "phoneDisplay": "+964 770 305 5957",
    "phoneDisplay2": "+964 773 775 7771",
    "cityAr": "العراق - اربيل - الصناعة الشمالية - كراج 98",
    "cityEn": "Iraq — Erbil — North Industrial — Garage 98",
    "cityKu": "عێراق - هەولێر - پیشەسازیی باکوور - گەراجی ٩٨",
    "instagram": "https://www.instagram.com/tuned_by_ayser",
    "tiktok": "https://www.tiktok.com/@aesaraeob",
    "facebook": "https://www.facebook.com/share/1EdnVYNcJF/",
    "power": 245,
    "torque": 360,
    "response": 18,
    "telegramBotToken": "",
    "telegramChatId": "",
}

STATUSES = ["new", "contacted", "done", "cancelled"]


async def init_admin(db):
    global _db
    _db = db
    try:
        await _db.bookings.create_index([("phone", 1)])
        await _db.bookings.create_index([("created_at", -1)])
        await _db.bookings.create_index([("status", 1)])
        logger.info("MongoDB indexes created for bookings collection")
    except Exception as e:
        logger.warning("Could not create indexes: %s", e)


class BookingCreate(BaseModel):
    name: str
    phone: str
    brand: str
    model: str
    year: Optional[str] = ""
    engine: Optional[str] = ""
    service: Optional[str] = ""
    notes: Optional[str] = ""
    lang: Optional[str] = "ar"


class DefaultsImport(BaseModel):
    services: List[Dict[str, Any]] = []
    brands: List[Dict[str, Any]] = []
    faq: List[Dict[str, Any]] = []


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None


def _send_telegram_sync(token: str, chat_id: str, text: str):
    try:
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        payload = json.dumps({"chat_id": chat_id, "text": text, "parse_mode": "HTML"}).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=8) as resp:
            pass
    except Exception as e:
        logger.warning("Telegram notification failed: %s", e)


async def dispatch_telegram_alert(booking: dict):
    settings = await _db.settings.find_one({"key": "site"}) or {}
    token = settings.get("telegramBotToken") or os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = settings.get("telegramChatId") or os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat_id:
        return

    text = (
        f"🚗 <b>حجز جديد - TUNING BY AYSER</b>\n\n"
        f"👤 <b>الاسم:</b> {booking.get('name', '-')}\n"
        f"📱 <b>الهاتف:</b> <code>{booking.get('phone', '-')}</code>\n"
        f"🚘 <b>السيارة:</b> {booking.get('brand', '')} {booking.get('model', '')} ({booking.get('year', '')})\n"
        f"⚙️ <b>المحرك:</b> {booking.get('engine', '-')}\n"
        f"🔧 <b>الخدمة:</b> {booking.get('service', '-')}\n"
        f"📝 <b>ملاحظات:</b> {booking.get('notes', '-')}\n"
        f"⏰ <b>الوقت:</b> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}"
    )
    _send_telegram_sync(token, chat_id, text)


def _sanitize_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Strip MongoDB operators ($) and invalid internal keys."""
    return {k: v for k, v in data.items() if not str(k).startswith("$") and k not in ("_id",)}


async def _list(collection: str) -> List[Dict[str, Any]]:
    return await _db[collection].find({}, {"_id": 0}).sort("order", 1).to_list(500)


@public_router.get("/content")
async def get_content():
    settings = await _db.settings.find_one({"key": "site"}, {"_id": 0, "key": 0}) or {}
    return {
        "services": await _list("services"),
        "brands": await _list("brands"),
        "faq": await _list("faq"),
        "settings": {**DEFAULT_SETTINGS, **settings},
    }


@admin_router.post("/import-defaults")
async def import_defaults(data: DefaultsImport):
    imported = {}
    for name, items in (("services", data.services), ("brands", data.brands), ("faq", data.faq)):
        if await _db[name].count_documents({}) == 0 and items:
            docs = []
            for i, item in enumerate(items):
                clean_item = _sanitize_dict(item)
                docs.append({**clean_item, "id": clean_item.get("id") or str(uuid.uuid4()), "order": i, "hidden": False})
            if docs:
                await _db[name].insert_many(docs)
                imported[name] = len(docs)
    if await _db.settings.count_documents({"key": "site"}) == 0:
        await _db.settings.insert_one({"key": "site", **DEFAULT_SETTINGS})
        imported["settings"] = 1
    return {"imported": imported}


def _crud(name: str):
    @admin_router.post(f"/{name}")
    async def create(item: Dict[str, Any]):
        count = await _db[name].count_documents({})
        clean_item = _sanitize_dict(item)
        doc = {**clean_item, "id": clean_item.get("id") or str(uuid.uuid4()), "order": clean_item.get("order", count)}
        doc.pop("_id", None)
        await _db[name].insert_one(doc)
        return {k: v for k, v in doc.items() if k != "_id"}

    @admin_router.put(f"/{name}/{{item_id}}")
    async def update(item_id: str, item: Dict[str, Any]):
        clean_item = _sanitize_dict(item)
        clean_item.pop("id", None)
        res = await _db[name].update_one({"id": item_id}, {"$set": clean_item})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return await _db[name].find_one({"id": item_id}, {"_id": 0})

    @admin_router.delete(f"/{name}/{{item_id}}")
    async def delete(item_id: str):
        res = await _db[name].delete_one({"id": item_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"ok": True}

    @admin_router.get(f"/{name}")
    async def listing():
        return await _list(name)

    return create, update, delete, listing


_crud("services")
_crud("brands")
_crud("faq")


@public_router.post("/bookings")
async def create_booking(data: BookingCreate, background_tasks: BackgroundTasks):
    doc = {
        **data.model_dump(),
        "id": str(uuid.uuid4()),
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "admin_notes": "",
    }
    await _db.bookings.insert_one(doc)
    doc.pop("_id", None)
    background_tasks.add_task(dispatch_telegram_alert, doc)
    return {"ok": True, "id": doc["id"]}


@public_router.get("/booking-status")
async def get_booking_status(phone: str):
    if not phone or len(phone.strip()) < 4:
        raise HTTPException(status_code=400, detail="Phone number is required")
    clean_phone = re.sub(r"[^\d+]", "", phone.strip())
    # Match exact or partial ending phone digits
    suffix = clean_phone[-8:] if len(clean_phone) >= 8 else clean_phone
    doc = await _db.bookings.find_one(
        {"phone": {"$regex": re.escape(suffix)}},
        {"_id": 0, "name": 0}  # Privacy: don't leak full name
    )
    if not doc:
        return {"found": False, "message": "No active booking found for this number"}
    return {
        "found": True,
        "booking": {
            "id": doc.get("id"),
            "brand": doc.get("brand"),
            "model": doc.get("model"),
            "year": doc.get("year"),
            "service": doc.get("service"),
            "status": doc.get("status", "new"),
            "created_at": doc.get("created_at"),
            "admin_notes": doc.get("admin_notes", ""),
        }
    }


ALLOWED_SETTING_KEYS = {
    "whatsapp",
    "phoneDisplay",
    "phoneDisplay2",
    "cityAr",
    "cityEn",
    "cityKu",
    "instagram",
    "tiktok",
    "facebook",
    "power",
    "torque",
    "response",
    "telegramBotToken",
    "telegramChatId",
}


@admin_router.put("/settings")
async def update_settings(payload: Dict[str, Any]):
    sanitized = {k: v for k, v in payload.items() if k in ALLOWED_SETTING_KEYS and not str(k).startswith("$")}
    if sanitized:
        await _db.settings.update_one({"key": "site"}, {"$set": sanitized}, upsert=True)
    doc = await _db.settings.find_one({"key": "site"}, {"_id": 0, "key": 0})
    return {**DEFAULT_SETTINGS, **(doc or {})}


@admin_router.get("/bookings")
async def list_bookings(status: Optional[str] = None, q: Optional[str] = None):
    query: Dict[str, Any] = {}
    if status and status != "all":
        query["status"] = status
    if q and q.strip():
        safe_q = re.escape(q.strip())
        query["$or"] = [
            {"name": {"$regex": safe_q, "$options": "i"}},
            {"phone": {"$regex": safe_q, "$options": "i"}},
            {"brand": {"$regex": safe_q, "$options": "i"}},
            {"model": {"$regex": safe_q, "$options": "i"}},
        ]
    return await _db.bookings.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)


@admin_router.patch("/bookings/{booking_id}")
async def update_booking(booking_id: str, data: BookingUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    if "status" in payload and payload["status"] not in STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await _db.bookings.update_one({"id": booking_id}, {"$set": payload})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return await _db.bookings.find_one({"id": booking_id}, {"_id": 0})


@admin_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str):
    res = await _db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@admin_router.get("/bookings-export")
async def export_bookings():
    rows = await _db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    fields = ["created_at", "name", "phone", "brand", "model", "year", "engine", "service", "notes", "status", "admin_notes"]
    buf = io.StringIO()
    buf.write("\ufeff")
    writer = csv.DictWriter(buf, fieldnames=fields, extrasaction="ignore")
    writer.writeheader()
    for r in rows:
        writer.writerow({f: r.get(f, "") for f in fields})
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=bookings.csv"},
    )


@admin_router.get("/stats")
async def stats():
    now = datetime.now(timezone.utc)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    week = (now - timedelta(days=7)).isoformat()
    total = await _db.bookings.count_documents({})
    by_status = {}
    for s in STATUSES:
        by_status[s] = await _db.bookings.count_documents({"status": s})
    by_status["new"] += await _db.bookings.count_documents({"status": {"$exists": False}})

    async def top(field: str):
        pipeline = [
            {"$match": {field: {"$nin": [None, ""]}}},
            {"$group": {"_id": f"${field}", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 6},
        ]
        return [{"label": d["_id"], "count": d["count"]} async for d in _db.bookings.aggregate(pipeline)]

    daily_pipeline = [
        {"$match": {"created_at": {"$gte": (now - timedelta(days=13)).isoformat()}}},
        {"$group": {"_id": {"$substr": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    daily = [{"day": d["_id"], "count": d["count"]} async for d in _db.bookings.aggregate(daily_pipeline)]

    return {
        "total": total,
        "today": await _db.bookings.count_documents({"created_at": {"$gte": today}}),
        "week": await _db.bookings.count_documents({"created_at": {"$gte": week}}),
        "byStatus": by_status,
        "topServices": await top("service"),
        "topBrands": await top("brand"),
        "daily": daily,
    }
