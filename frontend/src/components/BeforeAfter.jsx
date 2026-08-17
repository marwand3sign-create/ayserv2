import { useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { siteConfig } from "../data/siteConfig";
import { SectionHead, Reveal } from "./Reveal";

const DynoCurve = ({ tuned }) => (
  <svg viewBox="0 0 400 120" className="absolute bottom-6 inset-x-4 w-[calc(100%-2rem)]" aria-hidden="true">
    <path
      d={tuned ? "M0 105 C 90 100, 160 45, 400 12" : "M0 108 C 100 105, 200 78, 400 55"}
      fill="none"
      stroke={tuned ? "#FF2020" : "rgba(255,255,255,0.35)"}
      strokeWidth="2.5"
      strokeDasharray="500"
      strokeDashoffset="0"
    />
    <text x="8" y="20" fill={tuned ? "#FF2020" : "rgba(255,255,255,0.4)"} fontSize="9" fontFamily="JetBrains Mono">
      {tuned ? "TUNED MAP" : "STOCK MAP"}
    </text>
  </svg>
);

export default function BeforeAfter() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const update = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    update(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => dragging.current && update(e.clientX);
  const stop = () => (dragging.current = false);

  return (
    <section id="performance" data-testid="before-after-section" className="py-16 md:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHead kicker={t.beforeAfter.kicker} title={t.beforeAfter.title} sub={t.beforeAfter.note} />
        <Reveal>
          <div
            ref={ref}
            data-testid="before-after-slider"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stop}
            onPointerLeave={stop}
            className="relative aspect-[3/4] sm:aspect-[21/9] overflow-hidden border border-white/10 select-none touch-none cursor-ew-resize"
            role="slider"
            aria-valuenow={Math.round(pos)}
            aria-label={t.beforeAfter.drag}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
              if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
            }}
          >
            <div className="absolute inset-0">
              <img src={siteConfig.images.engine} alt="Modified engine bay — بعد البرمجة" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-rev/15 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <DynoCurve tuned />
            </div>
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img src={siteConfig.images.engine} alt="Stock engine bay — وضع المصنع" className="w-full h-full object-cover grayscale brightness-[0.55]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
              <DynoCurve tuned={false} />
            </div>
            <div className="absolute inset-x-0 top-3 sm:top-4 z-10 pointer-events-none" dir="ltr">
              <span className="absolute left-3 sm:left-4 font-mono text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.25em] bg-white/15 backdrop-blur px-2.5 py-1.5 whitespace-nowrap">{t.beforeAfter.stock}</span>
              <span className="absolute right-3 sm:right-4 font-mono text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.25em] bg-rev text-white px-2.5 py-1.5 whitespace-nowrap">{t.beforeAfter.modified}</span>
            </div>
            <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -translate-x-1/2 w-px bg-rev" />
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-11 sm:h-11 rounded-full sm:rounded-none bg-rev flex items-center justify-center glow-red">
                <ChevronsLeftRight size={22} className="text-white" />
              </div>
            </div>
          </div>
        </Reveal>
        <p className="text-center font-mono text-[10px] tracking-[0.15em] sm:tracking-[0.3em] text-ash mt-4">{t.beforeAfter.drag}</p>
      </div>
    </section>
  );
}
