import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";

export default function WhatsAppFloat({ vehicle }) {
  const { t } = useLanguage();
  const { waLink } = useContent();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const msg = vehicle
    ? `${t.wa.msg}:\n${vehicle.brand} ${vehicle.model}\n${vehicle.year}\n${vehicle.engine || ""}`
    : t.wa.msg;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          data-testid="whatsapp-float"
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.wa.label}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-5 end-4 md:bottom-6 md:end-6 z-[85] group flex items-center gap-0 hover:gap-3 bg-rev text-white ps-3.5 pe-3.5 md:ps-4 md:pe-4 hover:pe-5 py-3.5 md:py-4 glow-red transition-[gap,padding] duration-300 animate-floaty"
        >
          <SiWhatsapp size={20} className="md:w-[22px] md:h-[22px]" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[140px] transition-[max-width] duration-300 text-sm font-semibold whitespace-nowrap">
            {t.wa.label}
          </span>
          <span className="absolute inset-0 border border-rev animate-ping opacity-20 pointer-events-none" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
