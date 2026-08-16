import Lenis from "lenis";

let lenis = null;

export const initLenis = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  const raf = (time) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
};

export const scrollToId = (id) => {
  const el = document.querySelector(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
};
