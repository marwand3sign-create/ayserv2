import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../data/i18n";

const LanguageContext = createContext(null);

export const LANGS = [
  { code: "ar", label: "عربي" },
  { code: "ku", label: "کوردی" },
  { code: "en", label: "EN" },
];

const RTL = ["ar", "ku"];

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("ar");
  const dir = RTL.includes(lang) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = translations[lang] || translations.ar;
  const tr = (obj) => (obj ? obj[lang] ?? obj.ar ?? obj.en ?? "" : "");

  return (
    <LanguageContext.Provider value={{ lang, dir, t, tr, setLang, langs: LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
