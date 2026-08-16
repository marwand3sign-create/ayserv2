import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { faqItems as staticFaq } from "../data/faq";
import { SectionHead } from "./Reveal";

export default function FAQ() {
  const { t, lang, tr } = useLanguage();
  const { faq } = useContent();
  const faqItems = faq?.length ? faq : staticFaq;
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" data-testid="faq-section" className="py-16 md:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <SectionHead kicker={t.faq.kicker} title={t.faq.title} />
        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {faqItems.map((item, i) => (
            <div key={i}>
              <button
                data-testid={`faq-question-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 py-5 min-h-[60px] text-start group"
              >
                <span className={`font-semibold text-[15px] md:text-lg transition-colors duration-300 ${open === i ? "text-rev" : "group-hover:text-white text-white/85"}`}>
                  {tr(item.q)}
                </span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3 }}>
                  <Plus size={18} className={open === i ? "text-rev" : "text-ash"} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p data-testid={`faq-answer-${i}`} className="text-smoke text-sm leading-relaxed pb-6 max-w-2xl">
                      {tr(item.a)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
