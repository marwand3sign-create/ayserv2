# PRD — TUNING BY AYSER

## Original Problem Statement
Iraqi automotive ECU performance & coding website ("TUNING BY AYSER"). Dark, premium, motion-rich digital automotive experience — not a generic landing page. Arabic (Iraqi-professional) RTL default + English. Includes: cinematic hero with real performance car photo, interactive vehicle selector, 12 tuning services (CAT/DPF/EGR/O2/AdBlue/EVAP/Swirl Flaps/Speed Limiter/Rev Limiter/Pop&Bang/Launch Control/IMMO OFF) with detail modals, ECU data-flow visualization, Before/After slider, demo performance dashboard, brand marquee, numbered why-us chapters, 6-step process timeline, booking form (DB save + WhatsApp), FAQ, footer, floating WhatsApp, custom cursor, intro loader, easter eggs, SEO, accessibility, mobile-first.

## User Personas
- Car owners (petrol/diesel) seeking ECU remapping, deletes, diagnostics
- Performance enthusiasts & modified-car owners
- Workshops seeking coding partners
- European/American/Japanese car owners in Iraq

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll) + react-icons. RTL-first via logical properties. Content fully data-driven: `/app/frontend/src/data/` (services.js, vehicles.js, faq.js, i18n.js, siteConfig.js) — admin-panel-ready.
- Backend: FastAPI + MongoDB (motor). Routes: `GET /api/`, `POST /api/bookings`, `GET /api/bookings`.
- Fonts: Beiruti (AR display), IBM Plex Sans Arabic (AR body), Chivo (EN), JetBrains Mono (technical).
- Accent: Electric Red #FF2020 + diagnostic blue #00F0FF (sparing).

## Implemented (2026-08-15)
- ECU-boot intro loader with progress + mono log lines
- Hero: masked line-by-line title reveal, mouse parallax, canvas particles, light streaks, scroll parallax, technical coordinates
- Interactive Vehicle Selector: brand→model→year→fuel→engine chips, "ANALYZING ECU COMPATIBILITY" micro-loading, fuel-filtered available services, click-through to service modal, auto-fills booking form
- Services: interactive list with hover preview panel (scanline), detail modal (desc/benefit/systems/WhatsApp ask), Rev Limiter RPM-gauge easter egg
- ECU data-flow visualization (5 nodes, animated dashed data line, LIVE DATA STREAM)
- Before/After draggable slider (stock grayscale vs modified + dyno curves, demo-data disclaimer)
- Performance dashboard with count-up gauges (demo data labeled)
- Dual-direction infinite brand marquee (react-icons + wordmarks, pause on hover)
- Why-Us numbered manifesto chapters (01–05, stroke numbers fill red on hover)
- Process timeline with scroll-driven glowing line (6 steps)
- Booking form → POST /api/bookings (MongoDB) + success state + WhatsApp continue
- Floating WhatsApp button (appears after hero, prefilled with selected vehicle)
- Custom cursor (desktop only, EXPLORE/VIEW labels), logo 5-click "Performance Mode" easter egg
- Navbar: transparent→glass on scroll, fullscreen animated mobile menu, AR/EN switcher (dir swap)
- SEO: title/meta/OG/Twitter/JSON-LD AutoRepair schema; FAQ legal disclaimer; reduced-motion support
- Mobile verified at 390px — no horizontal overflow

## Mobile Polish (2026-06-15)
- Hero: kicker forced to one line (9px/nowrap), CTAs full-width & stacked, scroll indicator hidden <640px (no overlap), particle count reduced to 18 on mobile
- Services: mobile rows now show technical/Arabic subtitle + always-visible arrow + "tap for details" hint; modal padding/typography scaled, max-h 90svh
- Before/After: aspect 3/4 on mobile, STOCK/MODIFIED badges lifted above clip layers (no clipping), 56px round drag handle
- Global rhythm: section padding 96px → 64px on mobile; SectionHead title 28px, tighter margins; mono-label 10px/0.18em on mobile
- Touch targets ≥44–52px (chips, FAQ rows, service rows, inputs 50px, 16px input font to stop iOS zoom)
- Dashboard: DEMO DATA badge realigned, gauge value 4xl, labels more legible
- Footer: 2-column mobile grid + extra bottom padding so floating WhatsApp never covers content
- Navbar: AR/EN switcher fixed (Arabic label was clipped), mobile menu spacing/size tuned
- Verified via screenshots at 360px, 390px, 768px in both AR (RTL) and EN (LTR)

## Full Vehicle Database + Instant WhatsApp Handoff (2026-06-15)
- `src/data/vehicles.js` expanded to 47 brands (Iraq market: Toyota, Kia, Hyundai, Chevrolet, Dodge, Jeep, Ford, Nissan, Honda, Mitsubishi, Mazda, Suzuki, Lexus, Infiniti, BMW, Mercedes, Audi, VW, Porsche, Land Rover, Genesis, Chery, Jetour, MG, Haval, Geely, Changan, Peugeot, Renault, Skoda, SEAT, Fiat, Jaguar, Volvo, Cadillac, GMC, RAM, Lincoln, Maybach, Bentley, Rolls-Royce, Isuzu, Daihatsu, Subaru, Opel, Iveco) with full model lists
- Years now 1990–2026 (38 options); engine lists expanded (petrol + diesel)
- "Other" (أخرى) path everywhere: selector shows free-text brand/model inputs; booking form switches select → text input; auto-fill detects unknown brand/model
- Vehicle selector: "More brands" / "Older years" toggles so mobile chip lists stay short
- Booking submit now opens WhatsApp on the user's own device (wa.me deep link) with ALL details prefilled (name, phone, brand+model, year, engine, service, notes) — no Twilio, no OTP, zero setup. Success screen keeps a manual fallback button + hint text
- Verified: 48 brand options / 38 year options in the form, custom brand+model booking saved to MongoDB, WhatsApp tab opens with encoded Arabic details

## Backlog
- P0: Real WhatsApp number (currently placeholder +964 770 000 0000), real social links
- P1: Admin panel to manage services/vehicles/FAQ/bookings (data layer already decoupled)
- P1: Booking notifications (email/WhatsApp via Resend/Twilio)
- P2: Real dyno charts per car, gallery of completed builds, Google Maps location
