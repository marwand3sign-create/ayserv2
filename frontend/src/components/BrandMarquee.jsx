import {
  SiBmw, SiAudi, SiPorsche, SiVolkswagen, SiFord, SiHonda, SiToyota,
  SiNissan, SiChevrolet, SiJeep, SiHyundai, SiKia, SiMitsubishi,
} from "react-icons/si";
import { useLanguage } from "../context/LanguageContext";
import { brandMarquee } from "../data/vehicles";
import { Reveal } from "./Reveal";

const iconMap = {
  BMW: SiBmw, Audi: SiAudi, Porsche: SiPorsche, Volkswagen: SiVolkswagen,
  Ford: SiFord, Honda: SiHonda, Toyota: SiToyota, Nissan: SiNissan,
  Chevrolet: SiChevrolet, Jeep: SiJeep, Hyundai: SiHyundai, Kia: SiKia,
  Mitsubishi: SiMitsubishi,
};

const Row = ({ items, reverse }) => (
  <div className="overflow-hidden group">
    <div
      className={`flex w-max gap-14 pe-14 ${reverse ? "animate-marquee-rtl" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
    >
      {[...items, ...items].map((name, i) => {
        const Icon = iconMap[name];
        return (
          <div
            key={`${name}-${i}`}
            data-testid={i < items.length ? `brand-${name.replace(/\s/g, "-").toLowerCase()}` : undefined}
            className="flex items-center gap-3 text-white/30 hover:text-white transition-colors duration-500 shrink-0"
          >
            {Icon && <Icon size={30} />}
            <span className="font-mono text-sm tracking-[0.15em] uppercase whitespace-nowrap">{name}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default function BrandMarquee() {
  const { t } = useLanguage();
  const half = Math.ceil(brandMarquee.length / 2);
  return (
    <section data-testid="brands-section" className="py-14 md:py-28 border-y border-white/[0.06] overflow-hidden">
      <Reveal className="text-center mb-9 md:mb-12 px-4">
        <span className="mono-label brackets">{t.marquee.kicker}</span>
        <h2 className="font-display text-[26px] sm:text-4xl font-black tracking-tight mt-3 md:mt-4">{t.marquee.title}</h2>
      </Reveal>
      <div className="space-y-8 md:space-y-10" dir="ltr">
        <Row items={brandMarquee.slice(0, half)} />
        <Row items={brandMarquee.slice(half)} reverse />
      </div>
    </section>
  );
}
