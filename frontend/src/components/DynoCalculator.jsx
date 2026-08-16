import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Zap, Fuel, Flame, Sparkles, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SectionHead } from "./Reveal";

const STAGES = {
  stage1: {
    id: "stage1",
    hpGain: 1.28,
    nmGain: 1.32,
    badge: "STAGE 1",
    badgeCls: "bg-rev/20 text-rev border-rev/40",
    icon: Zap,
    requirements: {
      ar: "لا يتطلب أي قطع ميكانيكية إضافية (Stock Hardware)",
      ku: "هیچ پارچەیەکی میکانیکی زیادەی پێویست نییە",
      en: "100% Stock Hardware compatible",
    },
    desc: {
      ar: "إعادة معايرة خريطة المحرك بأمان كامل لرفع القوة وعزم الدوران وسرعة الاستجابة.",
      ku: "ڕێکخستنەوەی خەریتەی بزوێنەر بە سەلامەتی تەواو بۆ بەرزکردنەوەی هێز و تورک.",
      en: "Safe ECU recalibration maximizing torque, throttle response, and horsepower on stock hardware.",
    },
  },
  stage2: {
    id: "stage2",
    hpGain: 1.42,
    nmGain: 1.48,
    badge: "STAGE 2",
    badgeCls: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    icon: Gauge,
    requirements: {
      ar: "يتطلب Downpipe / Intake رياضي",
      ku: "پێویستی بە داونپایپ و ئینتەیکی وەرزشی هەیە",
      en: "Requires upgraded Downpipe & Cold Air Intake",
    },
    desc: {
      ar: "أقصى قوة ممكنة مع ترقيات العادم والسحب الهوائي لتسارع فائق على الحلبة والشارع.",
      ku: "بەرزترین ئاستی توانای بزوێنەر لەگەڵ گۆڕانکاری لە ئێگزۆست و هەوا کێشان.",
      en: "Maximum safe output tuned specifically for high-flow exhaust and performance induction.",
    },
  },
  eco: {
    id: "eco",
    hpGain: 1.12,
    nmGain: 1.18,
    badge: "ECO TUNE",
    badgeCls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    icon: Fuel,
    requirements: {
      ar: "توفير الوقود بنسبة 10% إلى 18% مع زيادة عزم ناعمة",
      ku: "کەمکردنەوەی بەکارهێنانی سووتەمەنی بە ڕێژەی ١٠٪ بۆ ١٨٪",
      en: "10% to 18% Fuel Economy savings + Smoother low-end torque",
    },
    desc: {
      ar: "تحسين كفاءة الاحتراق لتوفير الوقود في المسافات الطويلة مع قيادة مرنة وعزم سلس.",
      ku: "باشترکردنی سووتانی سووتەمەنی بۆ ڕێگای دوور و لێخوڕینی ئاسوودە.",
      en: "Optimized thermal efficiency and torque curve designed for heavy mileage and fleet savings.",
    },
  },
  popbang: {
    id: "popbang",
    hpGain: 1.25,
    nmGain: 1.28,
    badge: "POPS & BANGS",
    badgeCls: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    icon: Flame,
    requirements: {
      ar: "يتطلب تفريغ كبسولة الكاتاليزر (Decat / High-Flow)",
      ku: "پێویستی بە لابردنی کاتالیزەرە (Decat)",
      en: "Decat or High-Flow catalytic converter recommended",
    },
    desc: {
      ar: "تأخير توقيت الإشعال لإنتاج نغمات وفرقعات رياضية مميزة عند رفع القدم عن الوقود.",
      ku: "دەنگی تەقە و گڕی وەرزشی تایبەت کاتی لابردنی پێ لەسەر پایدەری بەنزین.",
      en: "Ignition timing retard on deceleration delivering sports burbles, crackles, and flames.",
    },
  },
};

const PRESETS = [
  { label: "Sedan 2.0T", stockHp: 210, stockNm: 300 },
  { label: "Hot Hatch 2.0T", stockHp: 280, stockNm: 380 },
  { label: "Twin-Turbo V6", stockHp: 360, stockNm: 500 },
  { label: "V8 4.0L Biturbo", stockHp: 510, stockNm: 650 },
];

export default function DynoCalculator() {
  const { lang } = useLanguage();
  const [selectedStage, setSelectedStage] = useState("stage1");
  const [stockHp, setStockHp] = useState(250);
  const [stockNm, setStockNm] = useState(350);

  const stage = STAGES[selectedStage];
  const tunedHp = Math.round(stockHp * stage.hpGain);
  const tunedNm = Math.round(stockNm * stage.nmGain);
  const hpDiff = tunedHp - stockHp;
  const nmDiff = tunedNm - stockNm;
  const hpPct = Math.round(((tunedHp - stockHp) / stockHp) * 100);

  const selectPreset = (p) => {
    setStockHp(p.stockHp);
    setStockNm(p.stockNm);
  };

  const scrollToBooking = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const titles = {
    ar: {
      kicker: "حاسبة الأداء التفاعلية",
      title: "احسب الزيادة المتوقعة لقوة سيارتك",
      sub: "اختر مرحلة البرمجة وقوة المحرك لترى بالأرقام كم سيصبح عزم وتسارع سيارتك بعد التعديل الاحترافي على الداينو.",
      stock: "القوة الأصلية",
      tuned: "بعد برمجة TBA",
      gain: "صافي الزيادة",
      hp: "حصان (HP)",
      nm: "عزم الدوران (Nm)",
      req: "المتطلبات:",
      bookBtn: "احجز برمجة هذه الفئة الآن",
      presetLabel: "أو اختر نوع محرك جاهز:",
    },
    ku: {
      kicker: "ژمێرەری توانای ئۆتۆمبێل",
      title: "زیادبوونی هێزی ئۆتۆمبێلەکەت بپێوە",
      sub: "ستەیجی پرۆگرامین و هێزی مەکینە هەڵبژێرە بۆ بینینی هێز و تورکی نوێ لەسەر داینۆ.",
      stock: "هێزی فابریکە",
      tuned: "دوای پرۆگرامی TBA",
      gain: "بڕی زیادبوون",
      hp: "ئەسپ (HP)",
      nm: "تورک (Nm)",
      req: "پێداویستییەکان:",
      bookBtn: "ئێستا ئەم ستەیجە حجز بکە",
      presetLabel: "یان مۆدێلێکی ئامادە هەڵبژێرە:",
    },
    en: {
      kicker: "Interactive Dyno Simulator",
      title: "Calculate Your Horsepower & Torque Gains",
      sub: "Select tuning stage and stock output to view real dyno-proven power and response improvements.",
      stock: "Stock Output",
      tuned: "TBA Tuned",
      gain: "Net Gain",
      hp: "Horsepower (HP)",
      nm: "Torque (Nm)",
      req: "Requirements:",
      bookBtn: "Book This Configuration",
      presetLabel: "Or select a quick engine preset:",
    },
  };

  const t = titles[lang] || titles.ar;

  return (
    <section id="calculator" className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-black/40 border-y border-white/[0.06]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,32,32,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHead kicker={t.kicker} title={t.title} sub={t.sub} align="center" />

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
          {Object.values(STAGES).map((stg) => {
            const Icon = stg.icon;
            const active = selectedStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setSelectedStage(stg.id)}
                className={`p-4 text-start border transition-all duration-300 relative overflow-hidden ${
                  active
                    ? "border-rev bg-rev/10 shadow-[0_0_25px_rgba(255,32,32,0.2)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${stg.badgeCls}`}>
                    {stg.badge}
                  </span>
                  <Icon size={18} className={active ? "text-rev" : "text-ash"} />
                </div>
                <div className="font-display font-bold text-base text-white">
                  +{Math.round((stg.hpGain - 1) * 100)}% HP
                </div>
                {active && (
                  <motion.div
                    layoutId="calcTabActive"
                    className="absolute bottom-0 start-0 w-full h-0.5 bg-rev"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Calculator Panel */}
        <div className="tech-panel p-6 md:p-10 border border-white/10 bg-white/[0.015]">
          {/* Quick Presets */}
          <div className="mb-8">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ash block mb-3">
              {t.presetLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => selectPreset(p)}
                  className={`font-mono text-xs px-3.5 py-1.5 border transition-all ${
                    stockHp === p.stockHp && stockNm === p.stockNm
                      ? "border-rev bg-rev/20 text-white"
                      : "border-white/10 text-smoke hover:border-white/30"
                  }`}
                >
                  {p.label} ({p.stockHp} HP)
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Sliders Input */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-xs text-smoke uppercase tracking-wider">
                    {t.stock} ({t.hp}):
                  </label>
                  <span className="font-display font-black text-2xl text-white">
                    {stockHp} <span className="text-xs font-mono text-ash">HP</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="700"
                  step="5"
                  value={stockHp}
                  onChange={(e) => setStockHp(Number(e.target.value))}
                  className="w-full accent-[#FF2020] bg-white/10 h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-ash mt-1">
                  <span>100 HP</span>
                  <span>400 HP</span>
                  <span>700 HP</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-xs text-smoke uppercase tracking-wider">
                    {t.stock} ({t.nm}):
                  </label>
                  <span className="font-display font-black text-2xl text-white">
                    {stockNm} <span className="text-xs font-mono text-ash">Nm</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="900"
                  step="10"
                  value={stockNm}
                  onChange={(e) => setStockNm(Number(e.target.value))}
                  className="w-full accent-[#FF2020] bg-white/10 h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-ash mt-1">
                  <span>150 Nm</span>
                  <span>500 Nm</span>
                  <span>900 Nm</span>
                </div>
              </div>

              {/* Stage Description & Requirements */}
              <div className="p-4 bg-white/[0.02] border border-white/10">
                <p className="text-xs text-smoke leading-relaxed mb-3">
                  {stage.desc[lang] || stage.desc.ar}
                </p>
                <div className="flex items-start gap-2 text-xs font-mono text-rev/90">
                  <Sparkles size={14} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.req}</strong> {stage.requirements[lang] || stage.requirements.ar}
                  </span>
                </div>
              </div>
            </div>

            {/* Dyno Results Display */}
            <div className="flex flex-col justify-between p-6 bg-black/60 border border-rev/30 glow-red">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-rev mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-rev animate-ping" />
                  DYNO SIMULATION OUTPUT
                </div>

                {/* HP Comparison Card */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-xs text-smoke">{t.hp}</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">+{hpDiff} HP (+{hpPct}%)</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-black text-4xl sm:text-5xl text-white">
                      {tunedHp}
                    </span>
                    <span className="font-mono text-sm text-ash line-through">
                      {stockHp} HP
                    </span>
                  </div>
                  {/* Progress Bar comparison */}
                  <div className="h-2 w-full bg-white/10 mt-2 relative overflow-hidden">
                    <div
                      className="h-full bg-white/30"
                      style={{ width: `${(stockHp / 800) * 100}%` }}
                    />
                    <motion.div
                      className="absolute top-0 start-0 h-full bg-rev"
                      initial={{ width: 0 }}
                      animate={{ width: `${(tunedHp / 800) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Torque Comparison Card */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-xs text-smoke">{t.nm}</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">+{nmDiff} Nm</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-black text-3xl sm:text-4xl text-white">
                      {tunedNm}
                    </span>
                    <span className="font-mono text-sm text-ash line-through">
                      {stockNm} Nm
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 mt-2 relative overflow-hidden">
                    <div
                      className="h-full bg-white/30"
                      style={{ width: `${(stockNm / 1000) * 100}%` }}
                    />
                    <motion.div
                      className="absolute top-0 start-0 h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(tunedNm / 1000) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={scrollToBooking}
                className="w-full btn-sweep bg-rev text-white font-semibold py-4 flex items-center justify-center gap-2 glow-red transition-all"
              >
                <span>{t.bookBtn}</span>
                <ChevronRight size={18} className="rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
