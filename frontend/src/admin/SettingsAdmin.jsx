import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errMsg } from "./api";
import { panelCls, inputCls, btnPrimary, AdminField } from "./ui";

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [pw, setPw] = useState({ current_password: "", new_password: "" });

  useEffect(() => {
    api.get("/content").then(({ data }) => setForm(data.settings)).catch((e) => toast.error(errMsg(e)));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      await api.put("/admin/settings", {
        ...form,
        power: Number(form.power) || 0,
        torque: Number(form.torque) || 0,
        response: Number(form.response) || 0,
      });
      toast.success("تم حفظ الإعدادات");
    } catch (e) { toast.error(errMsg(e)); }
  };

  const changePassword = async () => {
    try {
      await api.post("/auth/change-password", pw);
      setPw({ current_password: "", new_password: "" });
      toast.success("تم تغيير كلمة السر");
    } catch (e) { toast.error(errMsg(e)); }
  };

  if (!form) return <div className="font-mono text-xs text-ash">جاري التحميل...</div>;

  return (
    <div className="space-y-6" data-testid="settings-tab">
      <div className={`${panelCls} p-4 grid sm:grid-cols-2 gap-4`}>
        <AdminField label="رقم واتساب (بدون +)">
          <input data-testid="settings-whatsapp" dir="ltr" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/[^0-9]/g, ""))} className={inputCls} placeholder="9647701234567" />
        </AdminField>
        <AdminField label="الرقم المعروض">
          <input data-testid="settings-phone-display" dir="ltr" value={form.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} className={inputCls} />
        </AdminField>
        <AdminField label="الرقم المعروض 2">
          <input data-testid="settings-phone-display-2" dir="ltr" value={form.phoneDisplay2 || ""} onChange={(e) => set("phoneDisplay2", e.target.value)} className={inputCls} />
        </AdminField>
        <AdminField label="المدينة (عربي)"><input value={form.cityAr} onChange={(e) => set("cityAr", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="المدينة (كوردي)"><input value={form.cityKu || ""} onChange={(e) => set("cityKu", e.target.value)} className={inputCls} data-testid="settings-city-ku" /></AdminField>
        <AdminField label="المدينة (إنجليزي)"><input value={form.cityEn} onChange={(e) => set("cityEn", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="إنستغرام"><input dir="ltr" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="تيك توك"><input dir="ltr" value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="فيسبوك"><input dir="ltr" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="القوة (HP)"><input data-testid="settings-power" type="number" value={form.power} onChange={(e) => set("power", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="العزم (Nm)"><input type="number" value={form.torque} onChange={(e) => set("torque", e.target.value)} className={inputCls} /></AdminField>
        <AdminField label="تحسين الاستجابة (%)"><input type="number" value={form.response} onChange={(e) => set("response", e.target.value)} className={inputCls} /></AdminField>
        <div />
        <div className="sm:col-span-2 font-mono text-[10px] tracking-[0.15em] text-rev pt-2">إشعارات تلغرام الفورية للحجوزات</div>
        <AdminField label="Telegram Bot Token (اختياري)">
          <input dir="ltr" value={form.telegramBotToken || ""} onChange={(e) => set("telegramBotToken", e.target.value)} className={inputCls} placeholder="123456789:ABCdef..." />
        </AdminField>
        <AdminField label="Telegram Chat ID (اختياري)">
          <input dir="ltr" value={form.telegramChatId || ""} onChange={(e) => set("telegramChatId", e.target.value)} className={inputCls} placeholder="-1001234567890" />
        </AdminField>
        <div className="sm:col-span-2">
          <button onClick={save} className={btnPrimary} data-testid="settings-save">حفظ الإعدادات</button>
        </div>
      </div>

      <div className={`${panelCls} p-4 grid sm:grid-cols-2 gap-4`}>
        <div className="sm:col-span-2 font-mono text-[10px] tracking-[0.15em] text-rev">تغيير كلمة السر</div>
        <AdminField label="كلمة السر الحالية">
          <input data-testid="pw-current" type="password" value={pw.current_password} onChange={(e) => setPw((p) => ({ ...p, current_password: e.target.value }))} className={inputCls} />
        </AdminField>
        <AdminField label="كلمة السر الجديدة (8 أحرف على الأقل)">
          <input data-testid="pw-new" type="password" value={pw.new_password} onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))} className={inputCls} />
        </AdminField>
        <div className="sm:col-span-2">
          <button onClick={changePassword} className={btnPrimary} data-testid="pw-save">تغيير كلمة السر</button>
        </div>
      </div>
    </div>
  );
}
