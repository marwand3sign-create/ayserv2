import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { useCountUp } from "../lib/useCountUp";
import { SectionHead } from "./Reveal";

const Gauge = ({ label, value, suffix, pct, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const v = useCountUp(value, inView);
  return (
    <motion.div
      ref={ref}
      data-testid={`gauge-${label.toLowerCase().replace(/\s/g, "-")}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.7 }}
      className="tech-panel p-5 md:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-rev/70 to-transparent" />
      <div className="font-mono text-[11px] tracking-[0.2em] md:tracking-[0.3em] text-smoke mb-4">{label}</div>
      <div className="flex items-end gap-3">
        <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-none">{v}</span>
        <span className="font-mono text-xs text-rev mb-1.5">{suffix}</span>
      </div>
      <div className="mt-6 h-1 bg-white/[0.07] overflow-hidden">
        <motion.div
          className="h-full bg-rev"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
      <div className="mt-3 flex justify-between font-mono text-[9px] text-ash">
        <span>0</span><span>{pct}% LOAD</span>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const { t } = useLanguage();
  const { settings } = useContent();
  return (
    <section data-testid="dashboard-section" className="py-16 md:py-32 px-4 md:px-8 lg:px-16 grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <SectionHead kicker={t.dashboard.kicker} title={t.dashboard.title} />
          <span className="self-start font-mono text-[10px] tracking-[0.2em] border border-rev/40 text-rev px-3 py-1.5 -mt-4 mb-8 sm:mt-0 sm:mb-16">DEMO DATA</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          <Gauge label={t.dashboard.power} value={Number(settings.power) || 245} suffix="HP" pct={68} delay={0} />
          <Gauge label={t.dashboard.torque} value={Number(settings.torque) || 360} suffix="Nm" pct={74} delay={0.12} />
          <Gauge label={t.dashboard.response} value={Number(settings.response) || 18} suffix="+%" pct={42} delay={0.24} />
        </div>
        <p className="text-ash text-xs mt-6 font-mono tracking-wide">* {t.dashboard.note}</p>
      </div>
    </section>
  );
}
