import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Flame, Play, Square, Sparkles, Disc } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SectionHead } from "./Reveal";

const SOUND_PROFILES = [
  {
    id: "popbang",
    title: { ar: "Pops & Bangs (فرقعات الإكزوزت)", ku: "دەنگی پۆپ و بانگ", en: "Pops & Bangs / Burble" },
    desc: {
      ar: "نغمات تفجير رياضي ولهب خفيف عند رفع الدواسة مع استجابة نارية.",
      ku: "دەنگی تەقەی وەرزشی کاتی لابردنی پێ لەسەر پایدەر بە ئاستی کۆنترۆڵکراو.",
      en: "Aggressive crackles and deceleration pops engineered via ignition timing delay.",
    },
    tag: "MOST POPULAR",
    tagCls: "bg-rev/20 text-rev border-rev/40",
    color: "#FF2020",
    frequencies: [120, 250, 480, 80],
  },
  {
    id: "launch",
    title: { ar: "Launch Control (نظام الانطلاق)", ku: "سیستەمی لانچ کۆنترۆڵ", en: "Launch Control & Anti-Lag" },
    desc: {
      ar: "تثبيت دوران الـ RPM وتوليد ضغط التوربو (Boost) قبل الإقلاع الصاروخي.",
      ku: "ڕاگرتنی RPM و دروستکردنی پەستانی تێربۆ پێش دەستپێکردنی خێرا.",
      en: "Precision 2-step RPM limiter building boost pressure for instantaneous traction launch.",
    },
    tag: "MOTORSPORT",
    tagCls: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    color: "#F59E0B",
    frequencies: [180, 320, 140, 600],
  },
  {
    id: "turbo",
    title: { ar: "Turbo Spool & Cat-Off (تفريغ وصوت التوربو)", ku: "دەنگی سافی تێربۆ", en: "Turbo Spool & Cat-Off" },
    desc: {
      ar: "صوت صافرة التوربو النقي مع تدفق هواء سريع بدون كتمة الفلاتر.",
      ku: "دەنگی سافی تێربۆ و جووڵەی خێرای هەوا دوای لابردنی کاتالیزەر.",
      en: "High-pitch turbo spool whine paired with free-flowing exhaust harmonics.",
    },
    tag: "HIGH FLOW",
    tagCls: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    color: "#06B6D4",
    frequencies: [450, 850, 1200, 300],
  },
];

export default function SoundShowcase() {
  const { lang } = useLanguage();
  const [playingId, setPlayingId] = useState(null);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Web Audio Synthesizer Engine for realistic engine sound simulation
  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setPlayingId(null);
  };

  const playSoundEffect = (profile) => {
    if (playingId === profile.id) {
      stopAudio();
      return;
    }
    stopAudio();
    setPlayingId(profile.id);

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const triggerBurble = () => {
        if (!ctx || ctx.state === "closed") return;

        // Base engine rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        if (profile.id === "popbang") {
          // Sharp pops
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(60 + Math.random() * 80, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.18);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(400 + Math.random() * 300, ctx.currentTime);

          gain.gain.setValueAtTime(0.35, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        } else if (profile.id === "launch") {
          // Rapid limiter stutter
          osc.type = "square";
          osc.frequency.setValueAtTime(140 + (Math.sin(ctx.currentTime * 20) * 40), ctx.currentTime);
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(350, ctx.currentTime);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        } else {
          // High turbo whistle
          osc.type = "sine";
          osc.frequency.setValueAtTime(400 + Math.random() * 150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 300, ctx.currentTime + 0.3);
          filter.type = "highpass";
          filter.frequency.setValueAtTime(300, ctx.currentTime);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        }

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      };

      triggerBurble();
      intervalRef.current = setInterval(
        triggerBurble,
        profile.id === "launch" ? 110 : profile.id === "popbang" ? 220 : 380
      );

      // Auto stop after 8 seconds
      setTimeout(() => {
        if (playingId === profile.id) stopAudio();
      }, 8000);
    } catch (e) {
      console.warn("Audio Context init error:", e);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const titles = {
    ar: {
      kicker: "تجربة الصوتيات الحية",
      title: "استمع إلى نغمات الإكزوزت والبرمجة",
      sub: "اضغط على أي نمط لتجربة ومعاينة المؤثرات الصوتية الناتجة عن برمجة العادم وتأخير الإشعال والـ Launch Control.",
      play: "تشغيل الصوت",
      stop: "إيقاف",
    },
    ku: {
      kicker: "تەجرەبەی دەنگی وەرزشی",
      title: "گوێ لە دەنگی ئێگزۆست و تەقە بگرە",
      sub: "کلیک بکە بۆ بیستنی دەنگی پۆپ و بانگ، لانچ کۆنترۆڵ و سافی تێربۆ.",
      play: "لێدان",
      stop: "ڕاگرتن",
    },
    en: {
      kicker: "Acoustic Showcase",
      title: "Experience Exhaust Harmonics & Sound Profiles",
      sub: "Click any profile to preview the acoustics created by custom ECU ignition tables and boost management.",
      play: "Play Sound",
      stop: "Stop",
    },
  };

  const t = titles[lang] || titles.ar;

  return (
    <section id="sound" className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-black/60">
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHead kicker={t.kicker} title={t.title} sub={t.sub} align="center" />

        <div className="grid md:grid-cols-3 gap-6 my-10">
          {SOUND_PROFILES.map((p) => {
            const isPlaying = playingId === p.id;
            return (
              <div
                key={p.id}
                className={`tech-panel p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                  isPlaying
                    ? "border-rev bg-rev/10 shadow-[0_0_30px_rgba(255,32,32,0.25)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${p.tagCls}`}>
                      {p.tag}
                    </span>
                    <Disc
                      size={18}
                      className={`${isPlaying ? "text-rev animate-spin" : "text-ash"}`}
                    />
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {p.title[lang] || p.title.ar}
                  </h3>
                  <p className="text-xs text-smoke leading-relaxed mb-6">
                    {p.desc[lang] || p.desc.ar}
                  </p>
                </div>

                <div>
                  {/* Dynamic Audio Visualizer Waves */}
                  <div className="h-10 flex items-center justify-center gap-1.5 mb-5 px-3 py-2 bg-black/50 border border-white/5">
                    {[16, 28, 40, 22, 35, 18, 30, 14, 25, 38, 20].map((h, i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-white/30 rounded-full"
                        animate={
                          isPlaying
                            ? {
                                height: [8, h, 6, h * 0.8, 10],
                                backgroundColor: [
                                  "rgba(255,32,32,0.4)",
                                  p.color,
                                  "rgba(255,255,255,0.7)",
                                ],
                              }
                            : { height: 6, backgroundColor: "rgba(255,255,255,0.15)" }
                        }
                        transition={{
                          repeat: Infinity,
                          duration: 0.4 + (i % 4) * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => playSoundEffect(p)}
                    className={`w-full py-3 px-4 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isPlaying
                        ? "bg-rev text-white shadow-[0_0_15px_rgba(255,32,32,0.4)]"
                        : "bg-white/10 text-white hover:bg-rev/80 hover:text-white"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square size={14} fill="currentColor" />
                        <span>{t.stop}</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        <span>{t.play}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
