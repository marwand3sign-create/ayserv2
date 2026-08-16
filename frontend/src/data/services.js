export const services = [
  {
    id: "cat-off",
    num: "01",
    name: "CAT OFF",
    ar: "إلغاء الكتالايزر",
    tech: "Catalytic Converter Delete",
    fuels: ["petrol", "diesel"],
    desc: {
      ar: "تعديل برمجي لنظام العادم بعد إزالة المحول الحفاز، لمنع ظهور أخطاء الحساسات وضمان عمل المحرك بشكل صحيح.",
      en: "Software calibration after catalytic converter removal to prevent sensor faults and keep the engine running correctly.",
    },
    benefit: {
      ar: "استجابة عادم أفضل وصوت رياضي أوضح حسب تركيب السيارة.",
      en: "Improved exhaust flow and a sportier note depending on setup.",
    },
    systems: ["Bosch ME / MED", "Magneti Marelli", "Delphi"],
  },
  {
    id: "dpf-off",
    num: "02",
    name: "DPF OFF",
    ar: "إلغاء فلتر الديزل DPF",
    tech: "Diesel Particulate Filter Off",
    fuels: ["diesel"],
    desc: {
      ar: "معالجة برمجية لمشاكل فلتر جزيئات الديزل المسدود أو التالف، مع إيقاف دورات التجديد المتكررة.",
      en: "Software solution for clogged or failed DPF systems, disabling repeated regeneration cycles.",
    },
    benefit: {
      ar: "إنهاء مشاكل انسداد الفلتر المتكررة وتقليل أعطال نظام العادم.",
      en: "Ends recurring filter blockage issues and exhaust system faults.",
    },
    systems: ["Bosch EDC17", "Delphi DCM", "Siemens / Continental"],
  },
  {
    id: "egr-off",
    num: "03",
    name: "EGR OFF",
    ar: "إلغاء نظام EGR",
    tech: "Exhaust Gas Recirculation Off",
    fuels: ["petrol", "diesel"],
    desc: {
      ar: "إيقاف برمجي لنظام إعادة تدوير غاز العادم الذي يسبب تراكم الكربون داخل مجمع السحب مع الوقت.",
      en: "Software deactivation of exhaust gas recirculation that causes carbon buildup in the intake over time.",
    },
    benefit: {
      ar: "سحب أنظف للمحرك وتقليل تراكم الرواسب الكربونية.",
      en: "Cleaner intake and reduced carbon deposit buildup.",
    },
    systems: ["Bosch EDC17 / MED17", "VAG Simos", "Delphi"],
  },
  {
    id: "o2-off",
    num: "04",
    name: "O2 OFF",
    ar: "إلغاء حساس الأوكسجين",
    tech: "Oxygen Sensor Off",
    fuels: ["petrol"],
    desc: {
      ar: "معالجة برمجية لقراءات حساس الأوكسجين الخلفي بعد تعديلات نظام العادم، لمنع لمبة المكينة.",
      en: "Software handling of downstream O2 readings after exhaust modifications to prevent check-engine lights.",
    },
    benefit: {
      ar: "تشغيل نظيف بدون إنذارات بعد تعديل العادم.",
      en: "Clean operation without warnings after exhaust work.",
    },
    systems: ["Bosch ME / MED", "Continental", "Denso"],
  },
  {
    id: "adblue-off",
    num: "05",
    name: "ADBLUE / SCR OFF",
    ar: "إلغاء نظام AdBlue",
    tech: "Selective Catalytic Reduction Off",
    fuels: ["diesel"],
    desc: {
      ar: "حل برمجي لأعطال نظام AdBlue / SCR التي توقف السيارة أو تحد من قوتها عند انتهاء السائل أو تعطل المضخة.",
      en: "Software solution for AdBlue / SCR faults that immobilize the vehicle or limit power when fluid runs out or pumps fail.",
    },
    benefit: {
      ar: "إنهاء رسائل العد التنازلي وأعطال نظام SCR المكلفة.",
      en: "Ends countdown warnings and costly SCR system faults.",
    },
    systems: ["Bosch EDC17", "Denso", "Cummins CM"],
  },
  {
    id: "evap-off",
    num: "06",
    name: "EVAP OFF",
    ar: "إلغاء نظام EVAP",
    tech: "Evaporative Emission System Off",
    fuels: ["petrol"],
    desc: {
      ar: "معالجة برمجية لأعطال نظام التبخير EVAP وحساساته عند تعطل الصمامات أو التسريبات المتكررة.",
      en: "Software handling of EVAP system faults and sensors when valves fail or leaks recur.",
    },
    benefit: {
      ar: "إطفاء إنذارات EVAP المستمرة بعد التشخيص الصحيح.",
      en: "Clears persistent EVAP warnings after proper diagnosis.",
    },
    systems: ["Bosch ME", "Denso", "Hitachi"],
  },
  {
    id: "swirl-flaps",
    num: "07",
    name: "SWIRL FLAPS OFF",
    ar: "إلغاء صمامات السحب",
    tech: "Swirl Flaps Delete",
    fuels: ["diesel", "petrol"],
    desc: {
      ar: "إلغاء برمجي لصمامات السحب الدوامية المعروفة بأعطالها واحتمال سقوطها داخل المحرك في بعض المحركات.",
      en: "Software delete of swirl flaps known for failure and potential engine damage in certain engines.",
    },
    benefit: {
      ar: "حماية المحرك من عطل ميكانيكي محتمل في مجمع السحب.",
      en: "Protects the engine from potential intake manifold failure.",
    },
    systems: ["Bosch EDC16 / EDC17", "Siemens"],
  },
  {
    id: "vmax-off",
    num: "08",
    name: "SPEED LIMITER OFF",
    ar: "إلغاء محدد السرعة",
    tech: "V-MAX Removal",
    fuels: ["petrol", "diesel"],
    desc: {
      ar: "إزالة أو تعديل سقف السرعة الإلكتروني المفروض مصنعيًا على وحدة التحكم.",
      en: "Removal or adjustment of the factory electronic top-speed limiter in the ECU.",
    },
    benefit: {
      ar: "تحرير السقف الأعلى للسرعة حسب إمكانيات السيارة الفعلية.",
      en: "Frees the top-speed ceiling according to the vehicle's real capability.",
    },
    systems: ["Bosch MED17", "Continental", "Delphi"],
  },
  {
    id: "rev-limiter",
    num: "09",
    name: "REV LIMITER",
    ar: "تعديل محدد الدورات",
    tech: "RPM Limit Calibration",
    fuels: ["petrol"],
    desc: {
      ar: "معايرة حدود دورات المحرك (RPM) بما يناسب طبيعة المحرك وحالته الميكانيكية.",
      en: "Calibration of engine RPM limits to suit the engine's character and mechanical condition.",
    },
    benefit: {
      ar: "مدى دورات أوسع واستجابة رياضية حسب حالة المحرك.",
      en: "Wider rev range and sportier response based on engine health.",
    },
    systems: ["Bosch MED9 / MED17", "Magneti Marelli"],
  },
  {
    id: "pop-bang",
    num: "10",
    name: "POP & BANG",
    ar: "خريطة البوب والبانج",
    tech: "Crackle Map",
    fuels: ["petrol"],
    desc: {
      ar: "إضافة صوت فرقعة العادم عند رفع القدم عن دواسة الوقود، بمعايرة قابلة للضبط حسب رغبتك.",
      en: "Adds exhaust crackle on lift-off, with adjustable calibration to your preference.",
    },
    benefit: {
      ar: "طابع صوتي رياضي مميز لسيارتك بمستوى تتحكم به.",
      en: "A distinctive sporty exhaust character at a level you control.",
    },
    systems: ["Bosch MED17", "MG1", "MD1"],
  },
  {
    id: "launch-control",
    num: "11",
    name: "LAUNCH CONTROL",
    ar: "نظام الانطلاق",
    tech: "Launch Control Activation",
    fuels: ["petrol"],
    desc: {
      ar: "تفعيل نظام انطلاق ثابت الدورات لبداية قوية ومضبوطة، حسب دعم ناقل الحركة والسيارة.",
      en: "Activates a consistent-RPM launch system for strong, controlled starts, subject to gearbox support.",
    },
    benefit: {
      ar: "انطلاقة ثابتة ومتكررة بدون فقدان السيطرة.",
      en: "Consistent, repeatable launches without losing control.",
    },
    systems: ["Bosch MED17", "DSG DQ", "ZF 8HP"],
  },
  {
    id: "immo-off",
    num: "12",
    name: "IMMO OFF",
    ar: "إلغاء نظام الإيمو",
    tech: "Immobilizer Off",
    fuels: ["petrol", "diesel"],
    desc: {
      ar: "حلول برمجية لمشاكل نظام منع التشغيل Immobilizer عند فقدان المفاتيح أو تلف وحدة IMMO، بعد التحقق من الملكية.",
      en: "Software solutions for immobilizer issues when keys are lost or the IMMO unit fails, after ownership verification.",
    },
    benefit: {
      ar: "إعادة تشغيل السيارة المتوقفة بسبب أعطال نظام المفاتيح.",
      en: "Restarts vehicles stranded by key system faults.",
    },
    systems: ["Bosch ME7", "EDC15 / EDC16", "Delphi"],
  },
];

export const servicesForFuel = (fuel) =>
  services.filter((s) => !fuel || s.fuels.includes(fuel));
