import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "../context/LanguageContext";
import { ContentProvider } from "../context/ContentContext";
import { initLenis } from "../lib/scroll";
import Loader from "../components/Loader";
import Cursor from "../components/Cursor";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import VehicleSelector from "../components/VehicleSelector";
import Services from "../components/Services";
import ECUFlow from "../components/ECUFlow";
import BeforeAfter from "../components/BeforeAfter";
import Dashboard from "../components/Dashboard";
import BrandMarquee from "../components/BrandMarquee";
import WhyUs from "../components/WhyUs";
import Process from "../components/Process";
import Booking from "../components/Booking";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

import DynoCalculator from "../components/DynoCalculator";
import SoundShowcase from "../components/SoundShowcase";
import TrackerModal from "../components/TrackerModal";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [openService, setOpenService] = useState(null);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    const lenis = initLenis();
    return () => lenis?.destroy?.();
  }, []);

  useEffect(() => {
    const handler = (e) => setOpenService(e.detail);
    window.addEventListener("open-service", handler);
    return () => window.removeEventListener("open-service", handler);
  }, []);

  const closeService = useCallback(() => setOpenService(null), []);

  return (
    <LanguageProvider>
      <ContentProvider>
        <AnimatePresence>
          {loading && <Loader onDone={() => setLoading(false)} />}
        </AnimatePresence>
        <Cursor />
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar onOpenTracker={() => setShowTracker(true)} />
        <main>
          <Hero />
          <VehicleSelector onChange={setVehicle} onServicePick={setOpenService} />
          <DynoCalculator />
          <Services openId={openService} onClose={closeService} />
          <ECUFlow />
          <BeforeAfter />
          <SoundShowcase />
          <Dashboard />
          <BrandMarquee />
          <WhyUs />
          <Process />
          <Booking vehicle={vehicle} />
          <FAQ />
        </main>
        <Footer />
        <WhatsAppFloat vehicle={vehicle} />
        <TrackerModal isOpen={showTracker} onClose={() => setShowTracker(false)} />
      </ContentProvider>
    </LanguageProvider>
  );
}
