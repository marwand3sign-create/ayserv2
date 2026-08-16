import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { years, OTHER } from "../data/vehicles";
import { SectionHead } from "./Reveal";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const Field = ({ label, children, testid }) => (
  <label className="block" data-testid={testid}>
    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-smoke block mb-2">{label}</span>
    {children}
  </label>
);

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 focus:border-rev px-4 py-3.5 min-h-[50px] text-base sm:text-sm outline-none transition-colors duration-300 placeholder:text-ash appearance-none rounded-none";

export default function Booking({ vehicle }) {
  const { t, lang } = useLanguage();
  const { services, brands: vehicleBrands, waLink } = useContent();
  const [form, setForm] = useState({ name: "", phone: "", brand: "", model: "", year: "", engine: "", service: "", notes: "" });
  const [otherBrand, setOtherBrand] = useState(false);
  const [otherModel, setOtherModel] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (vehicle) {
      const known = vehicleBrands.find((b) => b.name === vehicle.brand);
      setOtherBrand(!known);
      setOtherModel(!!known && !known.models.includes(vehicle.model));
      setForm((f) => ({
        ...f,
        brand: vehicle.brand || f.brand,
        model: vehicle.model || f.model,
        year: vehicle.year || f.year,
        engine: vehicle.engine || f.engine,
      }));
      toast.success(lang === "en" ? "Vehicle details auto-filled" : lang === "ku" ? "زانیاری ئۆتۆمبێلەکەت خۆکارانە پڕکرایەوە" : "تم تعبئة بيانات سيارتك تلقائيًا");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle]);

  const brandObj = vehicleBrands.find((b) => b.name === form.brand);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v, ...(k === "brand" ? { model: "" } : {}) }));

  const waMessage = [
    t.wa.msg,
    "———",
    `${t.booking.name}: ${form.name}`,
    `${t.booking.phone}: ${form.phone}`,
    `${t.booking.brand}: ${form.brand} ${form.model}`,
    `${t.booking.year}: ${form.year}`,
    form.engine ? `${t.booking.engine}: ${form.engine}` : null,
    form.service ? `${t.booking.service}: ${form.service}` : null,
    form.notes ? `${t.booking.notes}: ${form.notes}` : null,
  ].filter(Boolean).join("\n");

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const waWindow = window.open("", "_blank");
    try {
      await axios.post(`${API}/bookings`, { ...form, lang });
      setSent(true);
      const link = waLink(waMessage);
      if (waWindow && !waWindow.closed) waWindow.location.href = link;
      else window.location.href = link;
    } catch (err) {
      waWindow?.close();
      toast.error(t.booking.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" data-testid="booking-section" className="relative py-16 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,32,32,0.09),transparent_60%)]" aria-hidden="true" />
      <div className="relative max-w-4xl mx-auto">
        <SectionHead kicker={t.booking.kicker} title={t.booking.title} sub={t.booking.sub} align="center" />
        <div className="tech-panel p-5 md:p-10 relative">
          <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-rev to-transparent" />
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                data-testid="booking-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 size={56} className="text-rev mx-auto mb-6" />
                <p className="font-display font-bold text-xl sm:text-2xl mb-3">{t.booking.success}</p>
                <p className="text-smoke text-sm max-w-md mx-auto mb-7">{t.booking.successHint}</p>
                <a
                  data-testid="booking-success-whatsapp"
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-rev text-white font-semibold px-8 py-4 btn-sweep"
                >
                  <MessageCircle size={18} /> {t.booking.successWa}
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                data-testid="booking-form"
                onSubmit={submit}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 gap-4 sm:gap-5"
              >
                <Field label={t.booking.name} testid="field-name">
                  <input data-testid="booking-name-input" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder={t.booking.name} />
                </Field>
                <Field label={t.booking.phone} testid="field-phone">
                  <input data-testid="booking-phone-input" required type="tel" dir="ltr" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${inputCls} text-start`} placeholder="+964 7XX XXX XXXX" />
                </Field>
                <Field label={t.booking.brand} testid="field-brand">
                  {otherBrand ? (
                    <div className="flex gap-2">
                      <input
                        data-testid="booking-brand-other-input"
                        required
                        value={form.brand}
                        onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                        className={inputCls}
                        placeholder={t.selector.brandPh}
                      />
                      <button
                        type="button"
                        data-testid="booking-brand-back"
                        onClick={() => { setOtherBrand(false); set("brand", ""); }}
                        className="shrink-0 px-3 border border-white/15 text-ash hover:text-rev hover:border-rev transition-colors text-xs font-mono"
                      >
                        ↺
                      </button>
                    </div>
                  ) : (
                    <select
                      data-testid="booking-brand-select"
                      required
                      value={form.brand}
                      onChange={(e) => {
                        if (e.target.value === OTHER) { setOtherBrand(true); setOtherModel(true); set("brand", ""); }
                        else set("brand", e.target.value);
                      }}
                      className={inputCls}
                    >
                      <option value="" disabled>{t.selector.choose}</option>
                      {vehicleBrands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                      <option value={OTHER}>{t.selector.other}</option>
                    </select>
                  )}
                </Field>
                <Field label={t.booking.model} testid="field-model">
                  {otherBrand || otherModel ? (
                    <input
                      data-testid="booking-model-other-input"
                      required
                      value={form.model}
                      onChange={(e) => set("model", e.target.value)}
                      className={inputCls}
                      placeholder={t.selector.modelPh}
                    />
                  ) : (
                    <select
                      data-testid="booking-model-select"
                      required
                      value={form.model}
                      onChange={(e) => {
                        if (e.target.value === OTHER) { setOtherModel(true); set("model", ""); }
                        else set("model", e.target.value);
                      }}
                      className={inputCls}
                    >
                      <option value="" disabled>{t.selector.choose}</option>
                      {(brandObj?.models || []).map((m) => <option key={m} value={m}>{m}</option>)}
                      <option value={OTHER}>{t.selector.other}</option>
                    </select>
                  )}
                </Field>
                <Field label={t.booking.year} testid="field-year">
                  <select data-testid="booking-year-select" required value={form.year} onChange={(e) => set("year", e.target.value)} className={inputCls}>
                    <option value="" disabled>{t.selector.choose}</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </Field>
                <Field label={t.booking.engine} testid="field-engine">
                  <input data-testid="booking-engine-input" value={form.engine} onChange={(e) => set("engine", e.target.value)} className={inputCls} placeholder="2.0 Turbo" />
                </Field>
                <Field label={`${t.booking.service} (${t.booking.optional})`} testid="field-service">
                  <select data-testid="booking-service-select" value={form.service} onChange={(e) => set("service", e.target.value)} className={inputCls}>
                    <option value="">{t.selector.choose}</option>
                    {services.map((s) => <option key={s.id} value={s.name}>{lang === "en" ? s.name : (s[lang] || s.ar)} — {s.name}</option>)}
                  </select>
                </Field>
                <Field label={`${t.booking.notes} (${t.booking.optional})`} testid="field-notes">
                  <input data-testid="booking-notes-input" value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputCls} placeholder="..." />
                </Field>
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
                  <button
                    data-testid="booking-submit-button"
                    type="submit"
                    disabled={sending}
                    className="btn-sweep flex-1 bg-rev text-white font-semibold py-4 flex items-center justify-center gap-2 disabled:opacity-60 glow-red"
                  >
                    <Send size={17} className="rtl:-scale-x-100" />
                    {sending ? "..." : t.booking.submit}
                  </button>
                  <a
                    data-testid="booking-whatsapp-button"
                    href={waLink(waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-white/20 hover:border-rev hover:text-rev transition-colors duration-300 font-semibold py-4 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} /> {t.booking.whatsapp}
                  </a>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
