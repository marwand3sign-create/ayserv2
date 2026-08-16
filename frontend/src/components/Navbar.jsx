import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { scrollToId } from "../lib/scroll";

export default function Navbar({ onOpenTracker }) {
  const { t, lang, setLang, langs } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const clicks = useRef({ count: 0, timer: null });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trackerLabel = {
    ar: "تتبع سيارتك",
    ku: "بەدواداچوون",
    en: "Track Car",
  }[lang] || "تتبع سيارتك";

  const calcLabel = {
    ar: "حاسبة القوة",
    ku: "ژمێرەری هێز",
    en: "Calculator",
  }[lang] || "حاسبة القوة";

  const soundLabel = {
    ar: "صوتيات",
    ku: "دەنگەکان",
    en: "Acoustics",
  }[lang] || "صوتيات";

  const links = [
    { id: "#home", label: t.nav.home },
    { id: "#services", label: t.nav.services },
    { id: "#calculator", label: calcLabel },
    { id: "#sound", label: soundLabel },
    { id: "#vehicles", label: t.nav.vehicles },
    { id: "#about", label: t.nav.about },
    { id: "#contact", label: t.nav.contact },
  ];

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  const logoClick = () => {
    clicks.current.count += 1;
    clearTimeout(clicks.current.timer);
    clicks.current.timer = setTimeout(() => (clicks.current.count = 0), 1800);
    if (clicks.current.count >= 5) {
      clicks.current.count = 0;
      setFlash(true);
      setTimeout(() => setFlash(false), 900);
      toast(`${t.perf} ⚡`, { description: "TBA // OVERRDRIVE ENGAGED" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-[96] bg-rev/20 pointer-events-none"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        )}
      </AnimatePresence>
      <motion.header
        data-testid="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-[80] transition-colors duration-500 ${
          scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
        }`}
      >
        <div className="px-4 md:px-8 lg:px-16 h-[72px] flex items-center justify-between">
          <button
            data-testid="nav-logo"
            onClick={logoClick}
            className="font-display font-black text-lg tracking-tight select-none"
            aria-label="TUNING BY AYSER"
          >
            TUNING <span className="text-rev">BY AYSER</span>
          </button>

          <nav className="hidden xl:flex items-center gap-7" aria-label="Main">
            {links.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-link-${l.id.slice(1)}`}
                onClick={() => go(l.id)}
                className="text-sm text-smoke hover:text-white transition-colors duration-300 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 start-0 w-0 h-px bg-rev group-hover:w-full transition-[width] duration-300" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Track Car Button */}
            <button
              onClick={onOpenTracker}
              data-testid="nav-tracker-btn"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 border border-white/15 hover:border-rev text-smoke hover:text-white text-xs font-mono transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{trackerLabel}</span>
            </button>

            <div
              data-testid="language-switcher"
              className="flex items-center border border-white/15 overflow-hidden"
            >
              {langs.map((l) => (
                <button
                  key={l.code}
                  data-testid={`lang-btn-${l.code}`}
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-2 text-[11px] tracking-wide transition-colors duration-300 ${
                    lang === l.code ? "bg-rev text-white" : "text-smoke hover:text-rev"
                  } ${l.code === "en" ? "font-body" : "font-mono"}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              data-testid="nav-book-now"
              onClick={() => go("#contact")}
              className="hidden sm:flex btn-sweep items-center gap-2 bg-rev text-white text-sm font-semibold px-5 py-2.5 transition-colors duration-300"
            >
              <Zap size={15} />
              {t.nav.book}
            </button>
            <button
              data-testid="mobile-menu-button"
              onClick={() => setOpen(true)}
              className="xl:hidden p-2 border border-white/15"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            className="fixed inset-0 z-[90] bg-ink/95 backdrop-blur-2xl flex flex-col"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="h-[72px] px-4 flex items-center justify-between border-b border-white/[0.06]">
              <span className="font-display font-black text-lg">TUNING <span className="text-rev">BY AYSER</span></span>
              <button data-testid="mobile-menu-close" onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 border border-white/15">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-6 sm:px-8 gap-1 sm:gap-2">
              {links.map((l, i) => (
                <motion.button
                  key={l.id}
                  data-testid={`mobile-nav-${l.id.slice(1)}`}
                  initial={{ opacity: 0, x: lang !== "en" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                  onClick={() => go(l.id)}
                  className="text-start font-display font-black text-3xl sm:text-4xl py-3 text-white/80 hover:text-rev transition-colors duration-300"
                >
                  <span className="font-mono text-xs text-rev me-3 sm:me-4">0{i + 1}</span>
                  {l.label}
                </motion.button>
              ))}
            </nav>
            <div className="p-6 sm:p-8 pb-8">
              <button
                data-testid="mobile-book-now"
                onClick={() => go("#contact")}
                className="w-full bg-rev text-white font-semibold py-4 text-lg"
              >
                {t.nav.book}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
