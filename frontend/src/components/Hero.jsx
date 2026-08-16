import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Gauge, Wrench } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { siteConfig } from "../data/siteConfig";
import { scrollToId } from "../lib/scroll";

const Particles = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w, h, raf;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const count = window.innerWidth < 640 ? 18 : 42;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      s: Math.random() * 1.6 + 0.4,
      v: Math.random() * 0.0006 + 0.0002,
      drift: (Math.random() - 0.5) * 0.0003,
      red: Math.random() < 0.28,
      a: Math.random() * 0.5 + 0.15,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.y -= d.v; d.x += d.drift;
        if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
        ctx.globalAlpha = d.a;
        ctx.fillStyle = d.red ? "#FF2020" : "#ffffff";
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "112%" }}
      animate={{ y: 0 }}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 16 });
  const sy = useSpring(my, { stiffness: 40, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onMouse = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 26);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 16);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMouse}
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-end overflow-hidden"
    >
      <motion.div className="absolute inset-[-3%]" style={{ x: sx, y: sy }}>
        <motion.img
          src={siteConfig.images.hero}
          alt="سيارة أداء عالي بإضاءة حمراء درامية — High performance car under dramatic red lighting"
          data-cursor="VIEW"
          className="w-full h-full object-cover"
          style={{ y: bgY }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/40 rtl:bg-gradient-to-l" />
      <Particles />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 bottom-0 w-40 bg-gradient-to-r from-transparent via-rev/[0.07] to-transparent animate-streak" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent animate-streak" style={{ animationDelay: "4.4s" }} />
      </div>
      <div className="absolute top-24 end-4 md:end-10 font-mono text-[10px] tracking-[0.3em] text-ash hidden md:flex flex-col items-end gap-1">
        <span>33.3152° N — 44.3661° E</span>
        <span className="text-rev animate-blink">● {t.hero.status}</span>
      </div>

      <motion.div style={{ opacity: fade }} className="relative z-10 w-full px-4 md:px-8 lg:px-16 pb-20 sm:pb-24 pt-32 md:pt-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mono-label brackets mb-5 md:mb-6 inline-block whitespace-nowrap text-[9px] tracking-[0.08em] sm:text-[11px] sm:tracking-[0.25em]"
          data-testid="hero-kicker"
        >
          {t.hero.kicker}
        </motion.p>
        <h1 className="font-display font-black tracking-tight leading-[1.06] sm:leading-[1.02] text-[12vw] sm:text-6xl md:text-7xl lg:text-[6.5rem] max-w-6xl">
          <MaskedLine delay={0.35}>{t.hero.line1}</MaskedLine>
          <MaskedLine delay={0.5}>
            <span className="text-rev">{t.hero.line2}</span>
          </MaskedLine>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="text-smoke text-sm sm:text-base md:text-lg max-w-xl mt-5 md:mt-6 leading-relaxed"
        >
          {t.hero.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mt-7 md:mt-9"
        >
          <button
            data-testid="hero-book-button"
            onClick={() => scrollToId("#contact")}
            className="btn-sweep bg-rev text-white font-semibold px-8 py-4 text-base flex items-center justify-center gap-2 glow-red w-full sm:w-auto"
          >
            <Gauge size={18} />
            {t.hero.cta1}
          </button>
          <button
            data-testid="hero-services-button"
            onClick={() => scrollToId("#services")}
            className="border border-white/25 hover:border-rev hover:text-rev px-8 py-4 text-base font-semibold transition-colors duration-300 flex items-center justify-center gap-2 backdrop-blur-sm w-full sm:w-auto"
          >
            <Wrench size={18} />
            {t.hero.cta2}
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => scrollToId("#vehicles")}
        style={{ opacity: fade }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-ash hover:text-rev transition-colors"
        aria-label={t.hero.scroll}
      >
        <span className="font-mono text-[10px] tracking-[0.35em]">{t.hero.scroll}</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.button>
    </section>
  );
}
