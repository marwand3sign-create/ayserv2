import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fuel, RotateCcw, Car, Cog, CalendarDays, Building2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { years, engines, fuels, OTHER } from "../data/vehicles";
import { Reveal, SectionHead } from "./Reveal";

const Chip = ({ active, onClick, children, testid }) => (
  <motion.button
    data-testid={testid}
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-3 min-h-[44px] border text-sm font-medium transition-colors duration-300 ${
      active
        ? "bg-rev border-rev text-white glow-red"
        : "border-white/12 text-smoke hover:border-rev/60 hover:text-white bg-white/[0.02]"
    }`}
  >
    {children}
  </motion.button>
);

const Step = ({ icon: Icon, label, children, show, stepKey }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon size={15} className="text-rev" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-smoke">{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function VehicleSelector({ onChange, onServicePick }) {
  const { t, lang, dir } = useLanguage();
  const { services, brands: vehicleBrands } = useContent();
  const [sel, setSel] = useState({ brand: null, model: null, year: null, fuel: null, engine: null });
  const [custom, setCustom] = useState({ brand: "", model: "" });
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllYears, setShowAllYears] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const isOther = sel.brand === OTHER;
  const brand = vehicleBrands.find((b) => b.id === sel.brand);
  const brandName = isOther ? custom.brand : brand?.name;
  const visibleBrands = showAllBrands ? vehicleBrands : vehicleBrands.slice(0, 14);
  const complete = sel.brand && sel.model && sel.year && sel.fuel && (!isOther || custom.brand.trim());
  const available = useMemo(
    () => services.filter((s) => !sel.fuel || (s.fuels || []).includes(sel.fuel)),
    [sel.fuel, services]
  );

  useEffect(() => {
    if (complete) {
      setAnalyzing(true);
      setDone(false);
      const to = setTimeout(() => { setAnalyzing(false); setDone(true); }, 800);
      return () => clearTimeout(to);
    }
    setDone(false);
  }, [complete, sel]);

  useEffect(() => {
    if (complete && onChange) {
      onChange({
        brand: brandName, model: sel.model, year: sel.year,
        fuel: fuels.find((f) => f.id === sel.fuel)?.[lang] || sel.fuel,
        engine: sel.engine,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pick = (key, val) => {
    setSel((s) => {
      const next = { ...s, [key]: val };
      if (key === "brand") { next.model = null; next.year = null; next.fuel = null; next.engine = null; }
      if (key === "model") { next.year = null; next.fuel = null; next.engine = null; }
      if (key === "year") { next.fuel = null; next.engine = null; }
      if (key === "fuel") { next.engine = null; }
      return next;
    });
  };

  const reset = () => {
    setSel({ brand: null, model: null, year: null, fuel: null, engine: null });
    setCustom({ brand: "", model: "" });
  };

  const customInput =
    "bg-white/[0.03] border border-white/12 focus:border-rev px-4 py-3 min-h-[46px] text-base sm:text-sm outline-none transition-colors duration-300 placeholder:text-ash w-full sm:w-56";

  return (
    <section id="vehicles" data-testid="vehicle-selector" className="relative py-16 md:py-32 px-4 md:px-8 lg:px-16 grid-bg">
      <div className="max-w-7xl mx-auto">
        <SectionHead kicker={t.selector.kicker} title={t.selector.title} sub={t.selector.sub} />
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16">
          <div className="space-y-7 md:space-y-8">
            <Step icon={Building2} label={t.selector.brand} show stepKey="brand">
              {visibleBrands.map((b) => (
                <Chip key={b.id} testid={`brand-${b.id}`} active={sel.brand === b.id} onClick={() => pick("brand", b.id)}>
                  {b.name}
                </Chip>
              ))}
              <Chip testid="brand-other" active={isOther} onClick={() => pick("brand", OTHER)}>
                {t.selector.other}
              </Chip>
              <button
                data-testid="brands-toggle"
                onClick={() => setShowAllBrands((v) => !v)}
                className="px-4 py-3 min-h-[44px] font-mono text-[11px] tracking-[0.15em] text-rev border border-rev/40 hover:bg-rev/10 transition-colors duration-300"
              >
                {showAllBrands ? t.selector.less : `+ ${t.selector.more}`}
              </button>
            </Step>
            {isOther ? (
              <Step icon={Car} label={t.selector.model} show stepKey="model-other">
                <input
                  data-testid="custom-brand-input"
                  value={custom.brand}
                  onChange={(e) => setCustom((c) => ({ ...c, brand: e.target.value }))}
                  placeholder={t.selector.brandPh}
                  className={customInput}
                />
                <input
                  data-testid="custom-model-input"
                  value={custom.model}
                  onChange={(e) => {
                    setCustom((c) => ({ ...c, model: e.target.value }));
                    pick("model", e.target.value.trim() ? e.target.value : null);
                  }}
                  placeholder={t.selector.modelPh}
                  className={customInput}
                />
              </Step>
            ) : (
              <Step icon={Car} label={t.selector.model} show={!!sel.brand} stepKey="model">
                {brand?.models.map((m) => (
                  <Chip key={m} testid={`model-${m.replace(/\s/g, "-")}`} active={sel.model === m} onClick={() => pick("model", m)}>{m}</Chip>
                ))}
              </Step>
            )}
            <Step icon={CalendarDays} label={t.selector.year} show={!!sel.model} stepKey="year">
              {(showAllYears ? years : years.slice(0, 14)).map((y) => (
                <Chip key={y} testid={`year-${y}`} active={sel.year === y} onClick={() => pick("year", y)}>{y}</Chip>
              ))}
              <button
                data-testid="years-toggle"
                onClick={() => setShowAllYears((v) => !v)}
                className="px-4 py-3 min-h-[44px] font-mono text-[11px] tracking-[0.15em] text-rev border border-rev/40 hover:bg-rev/10 transition-colors duration-300"
              >
                {showAllYears ? t.selector.less : `+ ${t.selector.moreYears}`}
              </button>
            </Step>
            <Step icon={Fuel} label={t.selector.fuel} show={!!sel.year} stepKey="fuel">
              {fuels.map((f) => (
                <Chip key={f.id} testid={`fuel-${f.id}`} active={sel.fuel === f.id} onClick={() => pick("fuel", f.id)}>
                  {f[lang]}
                </Chip>
              ))}
            </Step>
            <Step icon={Cog} label={t.selector.engine} show={!!sel.fuel} stepKey="engine">
              {(engines[sel.fuel] || []).map((e) => (
                <Chip key={e} testid={`engine-${e.replace(/[\s.]/g, "-")}`} active={sel.engine === e} onClick={() => pick("engine", e)}>{e}</Chip>
              ))}
            </Step>
            {complete && (
              <button
                data-testid="selector-reset"
                onClick={reset}
                className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-ash hover:text-rev transition-colors"
              >
                <RotateCcw size={13} /> {t.selector.reset}
              </button>
            )}
          </div>

          <div className="tech-panel p-5 md:p-8 relative overflow-hidden min-h-[240px] md:min-h-[320px]">
            <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-rev/60 to-transparent" />
            <AnimatePresence mode="wait">
              {analyzing && (
                <motion.div
                  key="analyzing"
                  data-testid="selector-analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] text-rev animate-blink text-center px-4">
                    ANALYZING ECU COMPATIBILITY...
                  </div>
                  <div className="w-40 h-px bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-rev"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                      style={{ width: "40%" }}
                    />
                  </div>
                </motion.div>
              )}
              {done && !analyzing && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="font-mono text-[11px] tracking-[0.25em] text-smoke mb-1">
                    {brandName} {sel.model} — {sel.year}
                  </div>
                  <div className="font-display font-bold text-xl mb-6">{t.selector.available}</div>
                  <div className="space-y-2">
                    {available.map((s, i) => (
                      <motion.button
                        key={s.id}
                        data-testid={`available-service-${s.id}`}
                        initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => onServicePick?.(s.id)}
                        className="w-full flex items-center justify-between gap-3 border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 min-h-[52px] hover:border-rev/50 hover:bg-rev/[0.05] transition-colors duration-300 group"
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-[10px] text-rev shrink-0">{s.num}</span>
                          <span className="text-sm font-semibold truncate">{lang === "en" ? s.name : (s[lang] || s.ar)}</span>
                        </span>
                        <span className="hidden sm:block font-mono text-[10px] text-ash group-hover:text-rev transition-colors shrink-0">{s.name}</span>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-ash text-xs mt-4">{t.selector.tap}</p>
                </motion.div>
              )}
              {!complete && !analyzing && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Car size={44} className="text-white/10 mx-auto mb-4" />
                    <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] text-ash">[ AWAITING VEHICLE DATA ]</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Reveal className="max-w-7xl mx-auto"><span className="sr-only">vehicle selector</span></Reveal>
    </section>
  );
}
