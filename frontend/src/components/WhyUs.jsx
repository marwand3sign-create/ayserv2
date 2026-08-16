import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { SectionHead } from "./Reveal";

export default function WhyUs() {
  const { t } = useLanguage();
  return (
    <section id="about" data-testid="why-us-section" className="py-16 md:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHead kicker={t.why.kicker} title={t.why.title} />
        <div className="border-t border-white/[0.06]">
          {t.why.items.map((item, i) => (
            <motion.div
              key={item.t}
              data-testid={`why-item-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-[auto_1fr] md:grid-cols-[140px_1fr_1.2fr] gap-x-4 gap-y-2 md:gap-8 items-baseline py-6 md:py-9 border-b border-white/[0.06] hover:bg-white/[0.015] transition-colors duration-500 px-1 md:px-4"
            >
              <span className="font-display font-black text-3xl md:text-6xl text-stroke group-hover:text-rev group-hover:[-webkit-text-stroke:0px] transition-all duration-500">
                0{i + 1}
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl group-hover:text-rev transition-colors duration-500">{item.t}</h3>
              <p className="text-smoke text-sm leading-relaxed col-span-2 md:col-span-1">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
