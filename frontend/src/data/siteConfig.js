import heroCars from "../assets/hero-cars.jpg";

export const siteConfig = {
  name: "TUNING BY AYSER",
  nameShort: "TBA",
  whatsapp: "9647703055957",
  phoneDisplay: "+964 770 305 5957",
  phoneDisplay2: "+964 773 775 7771",
  city: { ar: "العراق - اربيل - الصناعة الشمالية - كراج 98", en: "Iraq — Erbil — North Industrial — Garage 98", ku: "عێراق - هەولێر - پیشەسازیی باکوور - گەراجی ٩٨" },
  socials: {
    instagram: "https://www.instagram.com/tuned_by_ayser",
    tiktok: "https://www.tiktok.com/@aesaraeob",
    facebook: "https://www.facebook.com/share/1EdnVYNcJF/",
  },
  images: {
    hero: heroCars,
    servicesBg: "https://images.unsplash.com/photo-1784609525306-93e21dbf3c85?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    engine: "https://images.unsplash.com/photo-1527383418406-f85a3b146499?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
};

export const buildWhatsAppLink = (message) =>
  `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
