import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarCheck, ScanSearch, BrainCircuit, Wrench, ClipboardCheck, KeyRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SectionHead } from "./Reveal";

const icons = [CalendarCheck, ScanSearch, BrainCircuit, Wrench, ClipboardCheck, KeyRound];

export default function Process() {
  const { t, dir } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" data-testid="process-section" className="py-16 md:py-32 px-4 md:px-8 lg:px-16 carbon-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHead kicker={t.process.kicker} title={t.process.title} />
        <div ref={ref} className="relative">
          <div className={`absolute top-0 bottom-0 w-px bg-white/[0.08] ${dir === "rtl" ? "right-[27px] md:right-1/2" : "left-[27px] md:left-1/2"}`} />
          <motion.div
            className={`absolute top-0 bottom-0 w-px bg-rev origin-top ${dir === "rtl" ? "right-[27px] md:right-1/2" : "left-[27px] md:left-1/2"}`}
            style={{ scaleY: lineScale }}
          />
          <div className="space-y-10 md:space-y-16">
            {t.process.steps.map((step, i) => {
              const Icon = icons[i];
              const even = i % 2 === 0;
              return (
                <motion.div
                  key={step.t}
                  data-testid={`process-step-${i}`}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start gap-6 md:gap-0 ${dir === "rtl" ? "pe-0 ps-[68px] md:ps-0" : "ps-[68px] md:ps-0"} ${
                    even ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`absolute top-1 ${dir === "rtl" ? "right-0 md:right-1/2" : "left-0 md:left-1/2"} md:-translate-x-1/2 rtl:md:translate-x-1/2`}>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-steel border border-rev/40 flex items-center justify-center glow-red">
                      <Icon size={20} className="text-rev md:w-[22px] md:h-[22px]" />
                    </div>
                  </div>
                  <div className={`md:w-1/2 ${even ? (dir === "rtl" ? "md:ps-16 md:text-start" : "md:pe-16 md:text-end") : (dir === "rtl" ? "md:pe-16 md:text-end" : "md:ps-16 md:text-start")}`}>
                    <span className="font-mono text-[11px] text-rev tracking-[0.3em]">0{i + 1}</span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 mb-2">{step.t}</h3>
                    <p className="text-smoke text-sm leading-relaxed">{step.d}</p>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
