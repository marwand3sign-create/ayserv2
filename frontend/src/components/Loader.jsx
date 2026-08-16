import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { siteConfig } from "../data/siteConfig";

export default function Loader({ onDone }) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const iv = setInterval(() => {
      const p = Math.min(100, Math.round(((performance.now() - start) / 1300) * 100));
      setProgress(p);
      setLineIdx(Math.min(t.loader.length - 1, Math.floor((p / 100) * t.loader.length)));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(onDone, 420);
      }
    }, 40);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      data-testid="intro-loader"
      className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center grid-bg"
      exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="font-display font-black text-2xl sm:text-3xl tracking-tight">
        TUNING <span className="text-rev">BY AYSER</span>
      </div>
      <div className="font-mono text-[11px] tracking-[0.3em] text-smoke mt-8 h-4">
        {t.loader[lineIdx]}
        <span className="text-rev animate-blink ms-1">_</span>
      </div>
      <div className="w-56 h-px bg-white/10 mt-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 start-0 bg-rev"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-mono text-xs text-rev mt-3">{String(progress).padStart(3, "0")}%</div>
      <div className="absolute bottom-8 font-mono text-[10px] tracking-[0.3em] text-ash">
        {siteConfig.nameShort} / ECU INTERFACE v2.6
      </div>
    </motion.div>
  );
}
