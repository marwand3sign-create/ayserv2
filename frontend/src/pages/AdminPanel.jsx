import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Lock, LayoutDashboard, Inbox, Wrench, Car, HelpCircle, Settings } from "lucide-react";
import { api, errMsg, TOKEN_KEY } from "../admin/api";
import { inputCls, btnPrimary, panelCls } from "../admin/ui";
import Stats from "../admin/Stats";
import Bookings from "../admin/Bookings";
import ServicesAdmin from "../admin/ServicesAdmin";
import BrandsAdmin from "../admin/BrandsAdmin";
import FaqAdmin from "../admin/FaqAdmin";
import SettingsAdmin from "../admin/SettingsAdmin";
import { services as staticServices } from "../data/services";
import { vehicleBrands as staticBrands } from "../data/vehicles";
import { faqItems as staticFaq } from "../data/faq";

const tabs = [
  { id: "stats", label: "الإحصائيات", icon: LayoutDashboard, Comp: Stats },
  { id: "bookings", label: "الحجوزات", icon: Inbox, Comp: Bookings },
  { id: "services", label: "الخدمات", icon: Wrench, Comp: ServicesAdmin },
  { id: "brands", label: "السيارات", icon: Car, Comp: BrandsAdmin },
  { id: "faq", label: "الأسئلة", icon: HelpCircle, Comp: FaqAdmin },
  { id: "settings", label: "الإعدادات", icon: Settings, Comp: SettingsAdmin },
];

const LoginScreen = ({ onDone }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem(TOKEN_KEY, data.token);
      onDone(data.admin);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 carbon-bg" data-testid="admin-login">
      <form onSubmit={submit} className={`${panelCls} w-full max-w-sm p-7 space-y-4`}>
        <div className="flex items-center gap-2 text-rev">
          <Lock size={16} />
          <span className="font-mono text-[11px] tracking-[0.2em]">ADMIN ACCESS</span>
        </div>
        <div className="font-display font-black text-2xl">TUNING <span className="text-rev">BY AYSER</span></div>
        <input
          data-testid="admin-email"
          type="email"
          required
          dir="ltr"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email"
          className={inputCls}
        />
        <input
          data-testid="admin-password"
          type="password"
          required
          dir="ltr"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder="Password"
          className={inputCls}
        />
        <button data-testid="admin-login-button" disabled={busy} type="submit" className={`${btnPrimary} w-full`}>
          {busy ? "..." : "دخول"}
        </button>
      </form>
    </div>
  );
};

export default function AdminPanel() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("stats");

  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
    if (!localStorage.getItem(TOKEN_KEY)) { setChecking(false); return; }
    api.get("/auth/me")
      .then(({ data }) => setAdmin(data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!admin) return;
    api.post("/admin/import-defaults", { services: staticServices, brands: staticBrands, faq: staticFaq })
      .catch(() => {});
  }, [admin]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-ash">...</div>;
  if (!admin) return <LoginScreen onDone={setAdmin} />;

  const Active = tabs.find((t) => t.id === tab).Comp;

  return (
    <div className="min-h-screen bg-ink" data-testid="admin-panel">
      <header className="border-b border-white/[0.07] px-4 md:px-8 h-[64px] flex items-center justify-between sticky top-0 bg-ink/90 backdrop-blur-xl z-40">
        <div className="font-display font-black text-base">
          TUNING <span className="text-rev">BY AYSER</span>
          <span className="font-mono text-[10px] text-ash ms-3">CONTROL</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 font-mono text-[11px] text-smoke hover:text-rev transition-colors" data-testid="admin-logout">
          <LogOut size={14} /> خروج
        </button>
      </header>

      <nav className="px-4 md:px-8 border-b border-white/[0.07] flex gap-1 overflow-x-auto sticky top-[64px] bg-ink/90 backdrop-blur-xl z-30">
        {tabs.map((t) => (
          <button
            key={t.id}
            data-testid={`admin-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? "border-rev text-white" : "border-transparent text-smoke hover:text-white"
            }`}
          >
            <t.icon size={15} className={tab === t.id ? "text-rev" : ""} />
            {t.label}
          </button>
        ))}
      </nav>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <Active />
      </main>
    </div>
  );
}
