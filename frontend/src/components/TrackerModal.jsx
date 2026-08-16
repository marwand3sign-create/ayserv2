import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Search, CheckCircle2, Clock, Wrench, ShieldCheck, Car, MessageCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const TIMELINE_STEPS = [
  {
    key: "new",
    title: { ar: "استلام الحجز والفحص الأولي", ku: "وەرگرتنی حجز و پشکنینی سەرەتایی", en: "Booking Received & Diagnostics" },
    desc: {
      ar: "تم استلام الطلب وتجهيز السيارة للفحص الإلكتروني الشامل وقراءة خريطة الـ ECU الأصلية.",
      ku: "داواکاری وەرگیراوە و پشکنینی ئەلیکترۆنی دەستی پێکردووە.",
      en: "Vehicle logged in. Full ECU diagnostic scan and stock calibration read initialized.",
    },
    icon: Clock,
  },
  {
    key: "contacted",
    title: { ar: "قيد البرمجة والمعايرة على الداينو", ku: "خەریکی پرۆگرام و داینۆیە", en: "ECU Remapping & Dyno Calibration" },
    desc: {
      ar: "جاري كتابة وتعديل خريطة المحرك بدقة على جهاز الداينو لمطابقة أفضل أداء.",
      ku: "خەریتەی بزوێنەر لەسەر داینۆ ڕێکدەخرێت بۆ باشترین هێز و توانای بێ کێشە.",
      en: "Custom maps being flashed and dialed in on the dyno for optimal power delivery.",
    },
    icon: Wrench,
  },
  {
    key: "testing",
    title: { ar: "اختبار الأداء والسلامة", ku: "تەستکردنی لێخوڕین و سەلامەتی", en: "Road Testing & Quality Check" },
    desc: {
      ar: "فحص حرارة العادم وضغط التوربو والتأكد من خلو الذاكرة من أي كودات عطل.",
      ku: "پشکنینی کۆتایی پلەی گەرمی و پڕبوونی تێربۆ بەبێ هیچ هەڵەیەک.",
      en: "Live data logging, boost stability verification, and full DTC error code clearance.",
    },
    icon: ShieldCheck,
  },
  {
    key: "done",
    title: { ar: "السيارة جاهزة للاستلام", ku: "ئۆتۆمبێل ئامادەیە بۆ وەرگرتنەوە", en: "Ready for Delivery" },
    desc: {
      ar: "اكتملت البرمجة بنجاح مع تقرير الداينو الموثق. يمكنك استلام سيارتك الآن!",
      ku: "پرۆگرام تەواو بوو لەگەڵ ڕاپۆرتی داینۆ. دەتوانیت ئۆتۆمبێلەکەت وەربگریتەوە!",
      en: "Tuning complete with dyno verification report. Ready for pickup at the workshop!",
    },
    icon: CheckCircle2,
  },
];

export default function TrackerModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const { waLink } = useContent();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const searchStatus = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 4) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axios.get(`${API}/booking-status`, { params: { phone: phone.trim() } });
      setResult(data.found ? data.booking : null);
    } catch (err) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    if (status === "done") return 3;
    if (status === "contacted") return 1;
    if (status === "cancelled") return -1;
    return 0;
  };

  const titles = {
    ar: {
      modalTitle: "تتبع حالة سيارتك في الورشة",
      sub: "أدخل رقم هاتفك المستخدم في الحجز لمعرفة مرحلة العمل الحالية على سيارتك في ورشة TUNING BY AYSER.",
      ph: "رقم هاتفك (مثال: 0770XXXXXXX)",
      btn: "بحث عن الحالة",
      notFound: "لم يتم العثور على حجز نشط مرتبط بهذا الرقم. يرجى التأكد من الرقم أو التواصل معنا.",
      car: "السيارة:",
      service: "الخدمة:",
      notes: "ملاحظات الفني:",
      waAsk: "استفسار مباشر عبر واتساب",
    },
    ku: {
      modalTitle: "بەدواداچوونی دۆخی ئۆتۆمبێلەکەت",
      sub: "ژمارەی مۆبایلت بنووسە بۆ زانینی قۆناغی ئێستای کارکردن لەسەر ئۆتۆمبێلەکەت.",
      ph: "ژمارەی مۆبایل (نموونە: 0770XXXXXXX)",
      btn: "گەڕان",
      notFound: "هیچ حجزێک بەم ژمارەیە نەدۆزرایەوە. تکایە پەیوەندیمان پێوە بکە.",
      car: "ئۆتۆمبێل:",
      service: "خزمەتگوزاری:",
      notes: "تێبینی وەستا:",
      waAsk: "پرسیار لە واتسئاپ",
    },
    en: {
      modalTitle: "Track Vehicle Service Status",
      sub: "Enter the mobile number registered during booking to check the real-time stage of your car in the workshop.",
      ph: "Mobile number (e.g. +964 770 XXX XXXX)",
      btn: "Track Status",
      notFound: "No active service record found for this number. Please verify or reach out to us.",
      car: "Vehicle:",
      service: "Service:",
      notes: "Tech Notes:",
      waAsk: "Inquire via WhatsApp",
    },
  };

  const t = titles[lang] || titles.ar;
  const currentStep = result ? getStepIndex(result.status) : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-ink border border-white/15 p-6 md:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Top Red Glow Line */}
          <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-transparent via-rev to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 end-5 text-ash hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-rev font-mono text-[11px] uppercase tracking-[0.2em] mb-1">
              <Car size={15} />
              <span>LIVE TRACKING</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              {t.modalTitle}
            </h3>
            <p className="text-xs text-smoke mt-1 leading-relaxed">{t.sub}</p>
          </div>

          {/* Search Form */}
          <form onSubmit={searchStatus} className="flex gap-2 mb-6">
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.ph}
              className="flex-1 bg-white/[0.04] border border-white/10 focus:border-rev px-4 py-3 text-sm outline-none text-white font-mono placeholder:text-ash"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 bg-rev hover:bg-rev/90 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Search size={15} />
              <span>{loading ? "..." : t.btn}</span>
            </button>
          </form>

          {/* Results Area */}
          {searched && (
            <div>
              {result ? (
                <div className="space-y-6">
                  {/* Car Summary Header */}
                  <div className="p-4 bg-white/[0.03] border border-white/10 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-ash block">{t.car}</span>
                      <strong className="text-sm font-display text-white">
                        {result.brand} {result.model} {result.year ? `(${result.year})` : ""}
                      </strong>
                    </div>
                    {result.service && (
                      <div className="text-end">
                        <span className="text-[11px] font-mono text-ash block">{t.service}</span>
                        <span className="text-xs font-mono text-rev">{result.service}</span>
                      </div>
                    )}
                  </div>

                  {/* 4-Step Timeline */}
                  <div className="space-y-4">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx < currentStep || currentStep === 3;
                      const isCurrent = idx === currentStep && currentStep !== 3;

                      return (
                        <div key={step.key} className="flex gap-3.5 items-start">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isCompleted
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                : isCurrent
                                ? "bg-rev/20 border-rev text-rev animate-pulse"
                                : "bg-white/5 border-white/10 text-ash"
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 pb-3 border-b border-white/5">
                            <h4
                              className={`text-xs font-semibold ${
                                isCompleted
                                  ? "text-emerald-400"
                                  : isCurrent
                                  ? "text-white"
                                  : "text-smoke/60"
                              }`}
                            >
                              {step.title[lang] || step.title.ar}
                            </h4>
                            <p className="text-[11px] text-smoke mt-0.5 leading-relaxed">
                              {step.desc[lang] || step.desc.ar}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {result.admin_notes && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                      <strong>{t.notes}</strong> {result.admin_notes}
                    </div>
                  )}

                  {/* WhatsApp Direct Inquire */}
                  <a
                    href={waLink(`مرحباً، أود الاستفسار عن حالة سيارتي (${result.brand} ${result.model}) برقم هاتف: ${phone}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 border border-white/15 hover:border-rev hover:text-rev flex items-center justify-center gap-2 text-xs font-semibold text-smoke transition-colors"
                  >
                    <MessageCircle size={15} />
                    <span>{t.waAsk}</span>
                  </a>
                </div>
              ) : (
                <div className="p-6 text-center border border-white/10 bg-white/[0.02]">
                  <AlertCircle size={28} className="text-amber-400 mx-auto mb-2" />
                  <p className="text-xs text-smoke leading-relaxed">{t.notFound}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
