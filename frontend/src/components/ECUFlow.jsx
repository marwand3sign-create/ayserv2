import { motion } from "framer-motion";
import { Car, Activity, Cpu, SlidersHorizontal, Gauge } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SectionHead } from "./Reveal";

const icons = [Car, Activity, Cpu, SlidersHorizontal, Gauge];

export default function ECUFlow() {
  const { t } = useLanguage();
  return (
    <section id="ecu" data-testid="ecu-flow-section" className="relative py-16 md:py-32 px-4 md:px-8 lg:px-16 carbon-bg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto">
        <SectionHead kicker={t.ecu.kicker} title={t.ecu.title} sub={t.ecu.sub} align="center" />
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 inset-x-8 h-px" aria-hidden="true">
            <svg className="w-full h-2 overflow-visible">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="0" y1="0" x2="100%" y2="0" stroke="#FF2020" strokeWidth="1.5" strokeDasharray="6 14" className="animate-dashflow" />
            </svg>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {t.ecu.nodes.map((node, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={node}
                  data-testid={`ecu-node-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  <motion.div
                    animate={{ boxShadow: ["0 0 0px rgba(255,32,32,0)", "0 0 26px rgba(255,32,32,0.35)", "0 0 0px rgba(255,32,32,0)"] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-steel border border-white/10 flex items-center justify-center mb-4"
                  >
                    <Icon size={26} className={i === 2 ? "text-rev" : "text-white/70"} />
                  </motion.div>
                  <span className="font-mono text-[10px] text-rev mb-1">0{i + 1}</span>
                  <span className="text-sm font-semibold">{node}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-10 md:mt-14">
          <span className="w-1.5 h-1.5 rounded-full bg-rev animate-blink" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-ash">{t.ecu.live}</span>
        </div>
      </div>
    </section>
  );
}
