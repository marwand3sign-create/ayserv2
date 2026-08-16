import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { services as staticServices } from "../data/services";
import { vehicleBrands as staticBrands } from "../data/vehicles";
import { faqItems as staticFaq } from "../data/faq";
import { siteConfig } from "../data/siteConfig";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

export const defaultContent = {
  services: staticServices,
  brands: staticBrands,
  faq: staticFaq,
  settings: {
    whatsapp: siteConfig.whatsapp,
    phoneDisplay: siteConfig.phoneDisplay,
    phoneDisplay2: siteConfig.phoneDisplay2,
    cityAr: siteConfig.city.ar,
    cityEn: siteConfig.city.en,
    cityKu: siteConfig.city.ku,
    instagram: siteConfig.socials.instagram,
    tiktok: siteConfig.socials.tiktok,
    facebook: siteConfig.socials.facebook,
    power: 245,
    torque: 360,
    response: 18,
  },
};

const ContentContext = createContext(defaultContent);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    axios
      .get(`${API}/content`)
      .then(({ data }) => {
        setContent({
          services: data.services?.length ? data.services.filter((s) => !s.hidden) : staticServices,
          brands: data.brands?.length ? data.brands.filter((b) => !b.hidden) : staticBrands,
          faq: data.faq?.length ? data.faq.filter((f) => !f.hidden) : staticFaq,
          settings: { ...defaultContent.settings, ...(data.settings || {}) },
        });
      })
      .catch(() => {});
  }, []);

  const value = {
    ...content,
    waLink: (message) =>
      `https://wa.me/${content.settings.whatsapp}?text=${encodeURIComponent(message)}`,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
