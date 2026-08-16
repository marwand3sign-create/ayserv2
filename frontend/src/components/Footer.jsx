import { SiInstagram, SiTiktok, SiFacebook, SiWhatsapp } from "react-icons/si";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { scrollToId } from "../lib/scroll";

export default function Footer() {
  const { t, lang } = useLanguage();
  const { services, settings, waLink } = useContent();
  const navLinks = [
    { id: "#home", label: t.nav.home },
    { id: "#services", label: t.nav.services },
    { id: "#vehicles", label: t.nav.vehicles },
    { id: "#process", label: t.nav.process },
    { id: "#contact", label: t.nav.contact },
  ];
  const socials = [
    { icon: SiInstagram, href: settings.instagram, label: "Instagram" },
    { icon: SiTiktok, href: settings.tiktok, label: "TikTok" },
    { icon: SiFacebook, href: settings.facebook, label: "Facebook" },
    { icon: SiWhatsapp, href: waLink(t.wa.msg), label: "WhatsApp" },
  ];

  return (
    <footer data-testid="footer" className="border-t border-white/[0.06] pt-12 md:pt-16 pb-24 md:pb-8 px-4 md:px-8 lg:px-16 bg-graphite">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-9 md:gap-10 mb-12 md:mb-14">
        <div className="col-span-2 lg:col-span-1">
          <div className="font-display font-black text-xl mb-4">TUNING <span className="text-rev">BY AYSER</span></div>
          <p className="text-smoke text-sm leading-relaxed">{t.footer.desc}</p>
          <div className="flex gap-3 mt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                data-testid={`social-${s.label.toLowerCase()}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-smoke hover:text-rev hover:border-rev transition-colors duration-300"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="mono-label mb-5">{t.footer.nav}</div>
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button data-testid={`footer-nav-${l.id.slice(1)}`} onClick={() => scrollToId(l.id)} className="text-smoke hover:text-rev text-sm transition-colors duration-300">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mono-label mb-5">{t.footer.services}</div>
          <ul className="space-y-3">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <button onClick={() => scrollToId("#services")} className="text-smoke hover:text-rev text-sm transition-colors duration-300">
                  {lang === "en" ? s.name : (s[lang] || s.ar)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mono-label mb-5">{t.footer.contact}</div>
          <ul className="space-y-3 text-sm text-smoke">
            <li dir="ltr" className="font-mono text-start rtl:text-end">{settings.phoneDisplay}</li>
            {settings.phoneDisplay2 && (
              <li dir="ltr" className="font-mono text-start rtl:text-end">{settings.phoneDisplay2}</li>
            )}
            <li>{lang === "en" ? settings.cityEn : (lang === "ku" ? (settings.cityKu || settings.cityAr) : settings.cityAr)}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between gap-3">
        <span className="font-mono text-[11px] text-ash">{t.footer.rights}</span>
        <span className="text-[11px] text-ash/70 max-w-xl leading-relaxed">{t.footer.legal}</span>
      </div>
    </footer>
  );
}
