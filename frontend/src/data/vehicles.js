export const OTHER = "__other__";

export const vehicleBrands = [
  { id: "toyota", name: "Toyota", models: ["Land Cruiser", "Land Cruiser Prado", "FJ Cruiser", "Fortuner", "Hilux", "Tundra", "Tacoma", "Camry", "Corolla", "Avalon", "Yaris", "RAV4", "Highlander", "Sequoia", "4Runner", "Aurion", "Crown", "Innova", "Rush", "Supra", "C-HR", "Coaster", "Hiace"] },
  { id: "kia", name: "Kia", models: ["Rio", "Cerato", "K3", "K5", "Optima", "K8", "Sportage", "Sorento", "Seltos", "Telluride", "Carnival", "Stinger", "Picanto", "Soul", "Cadenza", "Mohave", "EV6"] },
  { id: "hyundai", name: "Hyundai", models: ["Accent", "Elantra", "Avante", "Sonata", "Azera", "Grandeur", "Tucson", "Santa Fe", "Palisade", "Creta", "Kona", "Veloster", "Genesis Coupe", "H1", "Staria", "Porter", "i10", "i20", "i30"] },
  { id: "chevrolet", name: "Chevrolet", models: ["Camaro", "Corvette", "Malibu", "Impala", "Cruze", "Aveo", "Spark", "Captiva", "Equinox", "Traverse", "Blazer", "Tahoe", "Suburban", "Silverado", "Colorado", "Trailblazer", "Groove"] },
  { id: "dodge", name: "Dodge", models: ["Charger", "Challenger", "Durango", "Journey", "Dart", "Ram 1500", "Viper", "Nitro"] },
  { id: "jeep", name: "Jeep", models: ["Grand Cherokee", "Cherokee", "Wrangler", "Gladiator", "Compass", "Renegade", "Grand Wagoneer", "Patriot"] },
  { id: "ford", name: "Ford", models: ["Mustang", "F-150", "F-250", "Ranger", "Explorer", "Expedition", "Edge", "Escape", "Bronco", "Taurus", "Focus", "Fusion", "Everest", "Raptor", "Transit"] },
  { id: "nissan", name: "Nissan", models: ["Patrol", "Patrol Super Safari", "Altima", "Maxima", "Sentra", "Sunny", "Micra", "X-Trail", "Pathfinder", "Armada", "Kicks", "Juke", "Navara", "Titan", "GT-R", "370Z", "Z", "Urvan"] },
  { id: "honda", name: "Honda", models: ["Accord", "Civic", "City", "CR-V", "HR-V", "Pilot", "Odyssey", "Ridgeline", "Passport", "Insight"] },
  { id: "mitsubishi", name: "Mitsubishi", models: ["Pajero", "Montero Sport", "Outlander", "ASX", "Eclipse Cross", "Lancer", "Attrage", "L200", "Xpander", "Canter"] },
  { id: "mazda", name: "Mazda", models: ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-9", "CX-60", "MX-5", "BT-50"] },
  { id: "suzuki", name: "Suzuki", models: ["Swift", "Baleno", "Ciaz", "Dzire", "Vitara", "Grand Vitara", "Jimny", "Ertiga", "S-Presso", "Fronx"] },
  { id: "lexus", name: "Lexus", models: ["IS 300", "IS 350", "ES 350", "GS 350", "LS 500", "RX 350", "NX 300", "GX 460", "LX 570", "LX 600", "UX 200", "RC F", "LC 500"] },
  { id: "infiniti", name: "Infiniti", models: ["Q50", "Q60", "Q70", "QX50", "QX60", "QX70", "QX80", "FX35", "FX50", "M37"] },
  { id: "bmw", name: "BMW", models: ["318i", "320i", "328i", "330i", "M3", "520i", "528i", "530i", "540i", "M5", "730Li", "740Li", "750Li", "X1", "X3", "X4", "X5", "X6", "X7", "M4", "M8", "Z4", "i4", "iX"] },
  { id: "mercedes", name: "Mercedes-Benz", models: ["C180", "C200", "C300", "C63 AMG", "E200", "E300", "E350", "E63 AMG", "S450", "S500", "S560", "S580", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE 350", "GLE 450", "GLS 450", "GLS 600", "G500", "G63 AMG", "ML 350", "Vito", "Sprinter"] },
  { id: "audi", name: "Audi", models: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "S4", "S5", "RS3", "RS6", "RS7", "TT", "e-tron"] },
  { id: "volkswagen", name: "Volkswagen", models: ["Golf", "Golf GTI", "Golf R", "Jetta", "Passat", "Arteon", "Polo", "Tiguan", "Touareg", "Teramont", "T-Roc", "Amarok", "Caddy"] },
  { id: "porsche", name: "Porsche", models: ["911 Carrera", "911 Turbo", "718 Cayman", "718 Boxster", "Panamera", "Cayenne", "Cayenne Coupe", "Macan", "Taycan"] },
  { id: "landrover", name: "Land Rover", models: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery", "Discovery Sport", "Freelander"] },
  { id: "genesis", name: "Genesis", models: ["G70", "G80", "G90", "GV70", "GV80", "GV60"] },
  { id: "chery", name: "Chery", models: ["Tiggo 2", "Tiggo 4", "Tiggo 7 Pro", "Tiggo 8 Pro", "Arrizo 5", "Arrizo 6", "Arrizo 8", "Omoda 5"] },
  { id: "jetour", name: "Jetour", models: ["X70", "X70 Plus", "X90", "X95", "Dashing", "T2"] },
  { id: "mg", name: "MG", models: ["MG 5", "MG 6", "MG ZS", "MG HS", "MG RX5", "MG RX8", "MG GT", "MG One", "MG Whale"] },
  { id: "haval", name: "Haval", models: ["H6", "H9", "Jolion", "Dargo", "Big Dog", "F7"] },
  { id: "geely", name: "Geely", models: ["Coolray", "Azkarra", "Emgrand", "Tugella", "Okavango", "Monjaro"] },
  { id: "changan", name: "Changan", models: ["CS35 Plus", "CS55 Plus", "CS75 Plus", "CS85", "Eado", "Alsvin", "UNI-T", "UNI-K", "Hunter"] },
  { id: "peugeot", name: "Peugeot", models: ["208", "301", "308", "2008", "3008", "5008", "508", "Partner", "Boxer"] },
  { id: "renault", name: "Renault", models: ["Logan", "Sandero", "Megane", "Duster", "Captur", "Koleos", "Talisman", "Dokker", "Master"] },
  { id: "skoda", name: "Skoda", models: ["Octavia", "Superb", "Rapid", "Fabia", "Kodiaq", "Karoq", "Kamiq", "Scala"] },
  { id: "seat", name: "SEAT", models: ["Ibiza", "Leon", "Toledo", "Ateca", "Arona", "Tarraco"] },
  { id: "fiat", name: "Fiat", models: ["Tipo", "500", "Punto", "Doblo", "Ducato", "Fullback"] },
  { id: "jaguar", name: "Jaguar", models: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type"] },
  { id: "volvo", name: "Volvo", models: ["S60", "S90", "XC40", "XC60", "XC90", "V60"] },
  { id: "cadillac", name: "Cadillac", models: ["Escalade", "CT4", "CT5", "CT6", "XT4", "XT5", "XT6", "SRX", "CTS"] },
  { id: "gmc", name: "GMC", models: ["Yukon", "Yukon XL", "Sierra", "Acadia", "Terrain", "Canyon", "Hummer EV"] },
  { id: "ram", name: "RAM", models: ["1500", "2500", "3500", "Rebel", "TRX", "ProMaster"] },
  { id: "lincoln", name: "Lincoln", models: ["Navigator", "Aviator", "Nautilus", "Corsair", "MKZ", "MKX"] },
  { id: "maybach", name: "Maybach", models: ["S580", "S680", "GLS 600", "57", "62"] },
  { id: "bentley", name: "Bentley", models: ["Continental GT", "Flying Spur", "Bentayga"] },
  { id: "rollsroyce", name: "Rolls-Royce", models: ["Ghost", "Phantom", "Cullinan", "Wraith", "Dawn"] },
  { id: "isuzu", name: "Isuzu", models: ["D-Max", "MU-X", "NPR", "NQR"] },
  { id: "daihatsu", name: "Daihatsu", models: ["Terios", "Sirion", "Gran Max", "Hijet"] },
  { id: "subaru", name: "Subaru", models: ["Impreza", "WRX", "Legacy", "Forester", "Outback", "XV", "BRZ"] },
  { id: "opel", name: "Opel", models: ["Astra", "Corsa", "Insignia", "Grandland", "Crossland", "Mokka"] },
  { id: "iveco", name: "Iveco", models: ["Daily", "Eurocargo", "Stralis", "S-Way"] },
];

export const years = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => String(2026 - i));

export const engines = {
  petrol: ["1.0", "1.3", "1.5", "1.5 Turbo", "1.6", "1.8", "2.0", "2.0 Turbo", "2.4", "2.5", "2.7", "3.0 V6", "3.5 V6", "3.6 V6", "4.0 V6", "4.0 V8", "4.6 V8", "5.0 V8", "5.6 V8", "5.7 V8", "6.2 V8", "6.4 V8", "6.7 V8", "V10", "V12"],
  diesel: ["1.5 dCi", "1.6 TDI", "2.0 TDI", "2.2 Diesel", "2.4 Diesel", "2.5 Diesel", "2.8 Diesel", "3.0 TDI", "3.0 Diesel", "4.2 Diesel", "4.5 Diesel", "6.7 Cummins", "6.6 Duramax"],
};

export const fuels = [
  { id: "petrol", ar: "بنزين", en: "Petrol" },
  { id: "diesel", ar: "ديزل", en: "Diesel" },
];

export const brandMarquee = [
  "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Porsche", "Toyota",
  "Lexus", "Nissan", "Ford", "Chevrolet", "Jeep", "Dodge",
  "Hyundai", "Kia", "Land Rover", "Range Rover", "Mitsubishi", "Honda",
];
