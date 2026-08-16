import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [fine, setFine] = useState(false);
  const [label, setLabel] = useState(null);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 24 });
  const ry = useSpring(y, { stiffness: 260, damping: 24 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return;
    document.body.classList.add("has-cursor");
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const tagged = e.target.closest("[data-cursor]");
      setLabel(tagged ? tagged.dataset.cursor : null);
      setActive(!!e.target.closest("a, button, [role='button'], input, select, textarea, [data-cursor]"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!fine) return null;

  return (
    <>
      <motion.div
        data-testid="custom-cursor-dot"
        className="fixed top-0 left-0 z-[95] w-2 h-2 rounded-full bg-rev pointer-events-none"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        data-testid="custom-cursor-ring"
        className="fixed top-0 left-0 z-[95] rounded-full border border-white/40 pointer-events-none flex items-center justify-center"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 76 : active ? 48 : 34,
          height: label ? 76 : active ? 48 : 34,
          backgroundColor: label ? "rgba(255,32,32,0.92)" : "rgba(255,32,32,0)",
          borderColor: label ? "rgba(255,32,32,0)" : "rgba(255,255,255,0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && <span className="font-mono text-[10px] tracking-[0.2em] text-white">{label}</span>}
      </motion.div>
    </>
  );
}
