import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpLeft, ArrowUpRight, X, MessageCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { siteConfig } from "../data/siteConfig";
import { SectionHead } from "./Reveal";

const RpmGauge = () => (
  <div className="mt-4 tech-panel p-4">
    <div className="font-mono text-[10px] tracking-[0.3em] text-rev mb-3">RPM // LIVE</div>
    <div className="relative h-24 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border-[6px] border-white/10" />
      <motion.div
        className="absolute bottom-0 left-1/2 w-1 h-24 bg-rev origin-bottom"
        style={{ translateX: "-50%" }}
        animate={{ rotate: [-100, 80, 30, 95, -20, 60] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-2 start-4 font-mono text-lg text-white"
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        <RpmReadout />
      </motion.div>
    </div>
  </div>
);

const RpmReadout = () => {
  const [rpm, setRpm] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setRpm(3200 + Math.round(Math.random() * 4200)), 380);
    return () => clearInterval(iv);
  }, []);
  return <span>{rpm} <span className="text-[10px] text-ash">RPM</span></span>;
};

export default function Services({ openId, onClose }) {
  const { t, lang, dir, tr } = useLanguage();
  const { services, waLink } = useContent();
  const [active, setActive] = useState(null);
  const activeService = services.find((s) => s.id === active) || services[0];
  const modalService = services.find((s) => s.id === openId);

  useEffect(() => {
    if (openId) setActive(openId);
  }, [openId]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <section id="services" data-testid="services-section" className="relative py-16 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.14] bg-cover bg-center"
        style={{ backgroundImage: `url(${siteConfig.images.servicesBg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHead kicker={t.services.kicker} title={t.services.title} sub={t.services.sub} />
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-14">
          <div>
            <p className="lg:hidden font-mono text-[11px] tracking-[0.12em] text-smoke mb-3">{t.selector.tap}</p>
            <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {services.map((s) => (
              <button
                key={s.id}
                data-testid={`service-row-${s.id}`}
                data-cursor="EXPLORE"
                onMouseEnter={() => setActive(s.id)}
                onClick={() => window.dispatchEvent(new CustomEvent("open-service", { detail: s.id }))}
                onFocus={() => setActive(s.id)}
                className={`w-full flex items-center gap-4 md:gap-6 py-4 md:py-5 min-h-[64px] text-start group transition-colors duration-300 ${
                  active === s.id ? "text-white" : "text-smoke"
                }`}
              >
                <span className={`font-mono text-[11px] shrink-0 transition-colors duration-300 ${active === s.id ? "text-rev" : "text-ash"}`}>
                  {s.num}
                </span>
                <span className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:gap-4">
                  <span className={`font-display font-bold text-lg sm:text-2xl md:text-3xl tracking-tight transition-transform duration-500 ${
                    active === s.id ? (dir === "rtl" ? "md:-translate-x-2" : "md:translate-x-2") : ""
                  }`}>
                    {s.name}
                  </span>
                  <span className="text-[11px] md:text-xs text-ash mt-1 md:mt-0 truncate">{lang === "en" ? s.tech : (s[lang] || s.ar)}</span>
                </span>
                <span className={`shrink-0 transition-all duration-300 ${active === s.id ? "text-rev opacity-100" : "text-rev/40 opacity-100 md:opacity-0"}`}>
                  {dir === "rtl" ? <ArrowUpLeft size={20} /> : <ArrowUpRight size={20} />}
                </span>
              </button>
            ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28 tech-panel p-8 min-h-[380px] relative overflow-hidden">
              <div className="absolute inset-x-0 h-px top-1/3 bg-rev/20 animate-scanline" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="font-display font-black text-7xl text-stroke-red mb-6">{activeService.num}</div>
                  <div className="font-mono text-[11px] tracking-[0.25em] text-rev mb-2">{activeService.tech}</div>
                  <h3 className="font-display font-bold text-2xl mb-4">
                    {lang === "en" ? activeService.name : (activeService[lang] || activeService.ar)}
                  </h3>
                  <p className="text-smoke text-sm leading-relaxed mb-6">{tr(activeService.desc)}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeService.systems.map((sys) => (
                      <span key={sys} className="font-mono text-[10px] border border-white/10 px-2.5 py-1 text-ash">{sys}</span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalService && (
          <motion.div
            data-testid="service-modal"
            className="fixed inset-0 z-[92] flex items-end sm:items-center justify-center p-0 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={modalService.name}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-graphite border border-white/10 max-h-[90svh] overflow-y-auto overscroll-contain"
            >
              <div className="h-1 bg-gradient-to-r from-rev via-rev/40 to-transparent" />
              <div className="p-5 md:p-10">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] md:text-[11px] text-rev tracking-[0.2em] md:tracking-[0.25em]">{modalService.num} — {modalService.tech}</span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mt-2">
                      {lang === "en" ? modalService.name : (modalService[lang] || modalService.ar)}
                    </h3>
                    <div className="text-smoke text-sm mt-1">{modalService.name}</div>
                  </div>
                  <button data-testid="service-modal-close" onClick={onClose} aria-label="Close" className="shrink-0 p-2.5 border border-white/15 hover:border-rev hover:text-rev transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-smoke text-sm sm:text-base leading-relaxed mb-6">{tr(modalService.desc)}</p>
                <div className="tech-panel p-4 mb-6">
                  <div className="mono-label mb-2">{t.services.benefit}</div>
                  <p className="text-sm">{tr(modalService.benefit)}</p>
                </div>
                <div className="mb-6">
                  <div className="mono-label mb-3">{t.services.systems}</div>
                  <div className="flex flex-wrap gap-2">
                    {modalService.systems.map((sys) => (
                      <span key={sys} className="font-mono text-[10px] border border-white/10 px-2.5 py-1 text-ash">{sys}</span>
                    ))}
                  </div>
                </div>
                {modalService.id === "rev-limiter" && <RpmGauge />}
                <a
                  data-testid="service-ask-button"
                  href={waLink(`${t.wa.msg} — ${modalService.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sweep mt-4 w-full bg-rev text-white font-semibold py-4 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  {t.services.ask}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
