import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 36, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ kicker, title, sub, align = "start" }) => (
  <div className={`mb-10 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
    <Reveal>
      <span className="mono-label brackets inline-block" data-testid="section-kicker">{kicker}</span>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className="font-display text-[28px] sm:text-4xl lg:text-5xl font-black tracking-tight mt-3 md:mt-4 leading-[1.15]">
        {title}
      </h2>
    </Reveal>
    {sub && (
      <Reveal delay={0.16}>
        <p className={`text-smoke text-sm sm:text-base max-w-xl mt-3 md:mt-4 leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>{sub}</p>
      </Reveal>
    )}
  </div>
);
