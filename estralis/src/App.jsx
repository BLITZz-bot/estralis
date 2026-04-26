import { motion, useScroll, useTransform } from "framer-motion"

import Navbar from "./components/Navbar"
import Schedule from "./components/Schedule"
import Venue from "./components/Venue"
import Footer from "./components/Footer"
import ParticlesBg from "./components/ParticlesBg"
import About from "./components/About"
import ScrollProgress from "./components/ScrollProgress"
import CursorGlow from "./components/CursorGlow"
import Section from "./components/Section"
import FestivalHero from "./components/FestivalHero"
import HeroVideo from "./components/HeroVideo"
import CountdownSciFi from "./components/CountdownSciFi"
import StarBackground from "./components/StarBackground"
import Timeline from "./components/Timeline"
// import CornerLogos from "./components/Cornerlogos"
import MyRegistrations from "./components/MyRegistrations"
import AdminDashboard from "./components/AdminDashboard"
// import FixedWatermark from "./components/FixedWatermark"
import PrizePool from "./components/PrizePool"
import ThemeRevealModal from "./components/ThemeRevealModal"
import SectionBackground from "./components/SectionBackground"
import ProtocolModal from "./components/ProtocolModal"
import SpecialGuest from "./components/SpecialGuest"
import Team from "./components/Team"
import StaffScanner from "./components/StaffScanner"
import LuckyDraw from "./components/LuckyDraw"
import { useState, useEffect } from "react"

export default function App() {
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isThemeRevealOpen, setIsThemeRevealOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [isProtocolAccepted, setIsProtocolAccepted] = useState(false);


  /* ===== Scroll Parallax ===== */
  const { scrollY } = useScroll()

  const ySlow = useTransform(scrollY, [0, 2000], [0, -200])
  const yFast = useTransform(scrollY, [0, 2000], [0, -400])
  const yTitle = useTransform(scrollY, [0, 800], [0, -120])

  /* ===== URL Deep-Linking for Pass Downloads ===== */
  const [initialRegEmail, setInitialRegEmail] = useState("");
  const [autoDownload, setAutoDownload] = useState(false);
  const [isStaffPortal, setIsStaffPortal] = useState(false);
  const [isLuckyDrawPortal, setIsLuckyDrawPortal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Check for Staff Portal Mode
    if (params.get('portal') === 'scanner') {
      setIsStaffPortal(true);
      return; // Stop further deep link processing for scanner
    }

    if (params.get('portal') === 'luckydraw') {
      setIsLuckyDrawPortal(true);
      return;
    }

    if (params.get('openPass') === 'true' && params.get('email')) {
      const email = params.get('email');
      setInitialRegEmail(email);
      setAutoDownload(params.get('autoDownload') === 'true');
      setIsRegistrationsOpen(true);
      // Clean up URL without refreshing
      const newUrl = window.location.origin + window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  if (isStaffPortal) {
    return <StaffScanner />;
  }

  if (isLuckyDrawPortal) {
    return <LuckyDraw />;
  }

  return (
    <>
      <div className="noise-overlay" />

      <div className="min-h-screen overflow-x-hidden bg-[#020617] text-white">
        {/* ================= GLOBAL BACKGROUNDS ================= */}
        {/* Deep space base */}
        <div className="fixed inset-0 pointer-events-none -z-20" style={{ background: "linear-gradient(160deg, #020617 0%, #050a1f 40%, #010412 100%)" }} />

        {/* Stars */}
        <StarBackground />

        {/* Teal upper-left bleed */}
        <div className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none -z-10 translate-z-0"
          style={{ background: "radial-gradient(ellipse at top left, rgba(45,212,191,0.05) 0%, transparent 65%)" }} />

        {/* Cool Aqua upper-right bleed */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none -z-10 translate-z-0"
          style={{ background: "radial-gradient(ellipse at top right, rgba(8,145,178,0.06) 0%, transparent 65%)" }} />

        {/* Astral center mid-page glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none -z-10 translate-z-0"
          style={{ background: "radial-gradient(ellipse, rgba(45,212,191,0.03) 0%, transparent 70%)" }} />

        {/* Teal bottom-right */}
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none -z-10 translate-z-0"
          style={{ background: "radial-gradient(ellipse at bottom right, rgba(8,145,178,0.04) 0%, transparent 65%)" }} />

        {/* Parallax Astral lights */}
        <motion.div
          style={{ y: ySlow, background: "radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 70%)" }}
          className="fixed top-1/4 left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none -z-10 translate-z-0"
        />
        <motion.div
          style={{ y: yFast, background: "radial-gradient(circle, rgba(8,145,178,0.03) 0%, transparent 65%)" }}
          className="fixed top-1/3 right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none -z-10 translate-z-0"
        />

        <CursorGlow />

        <Navbar
          onOpenRegistrations={() => setIsRegistrationsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenThemeReveal={() => setIsThemeRevealOpen(true)}
        />

        <MyRegistrations
          isOpen={isRegistrationsOpen}
          onClose={() => { setIsRegistrationsOpen(false); setInitialRegEmail(""); setAutoDownload(false); }}
          initialEmail={initialRegEmail}
          autoDownload={autoDownload}
        />
        <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        <ThemeRevealModal isOpen={isThemeRevealOpen} onClose={() => setIsThemeRevealOpen(false)} />
        <ProtocolModal
          isOpen={isProtocolModalOpen}
          onClose={() => setIsProtocolModalOpen(false)}
          onAccept={() => {
            setIsProtocolAccepted(true);
            document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* <CornerLogos
          hide={isRegistrationsOpen || isAdminOpen || isScheduleModalOpen}
        /> */}
        {/* <FixedWatermark /> */}

        <ScrollProgress />

        {/* ================= VIDEO HERO ================= */}
        <section className="relative h-screen w-full overflow-hidden">
          <HeroVideo />

          {/* Optional center scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm animate-bounce">
            Scroll ↓
          </div>
        </section>


        {/* ================= HERO (Branding) ================= */}
        <Section id="home">
          <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            <FestivalHero />

          </section>
        </Section>

        {/* ================= COUNTDOWN (Next Page) ================= */}
        <Section id="countdown">
          <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden group">

            <SectionBackground
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
              alt="Tech Earth Background"
              activeOpacity="opacity-70 md:opacity-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="w-full flex flex-col items-center"
            >
              <CountdownSciFi />

              <div className="mt-16">
                <a
                  href="#events"
                  className="px-12 py-5 rounded-2xl bg-teal-500 text-black font-black tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_50px_rgba(45,212,191,0.7)] hover:bg-white hover:scale-105 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
                >
                  Explore_Archive
                </a>
              </div>
            </motion.div>
          </section>
        </Section>

        <PrizePool />

        {/* ================= ABOUT ================= */}
        <Section id="about">
          <About onOpenProtocol={() => setIsProtocolModalOpen(true)} />
        </Section>

        {/* ================= EVENTS ================= */}
        <Section id="events">
          <Schedule onModalToggle={setIsScheduleModalOpen} />
        </Section>

        <SpecialGuest />

        <div className="py-20 text-center astral-glass mx-6 mt-10 border-teal-500/10">
          <p className="astral-eyebrow text-teal-400">Archive Transmission End</p>
          <h3 className="saarang-serif text-3xl mt-4 italic text-white/40">More signals to be decoded soon.</h3>
        </div>

        <Timeline />

        {/* ================= VENUE ================= */}
        <Section id="venue">
          <Venue />
        </Section>

        <Section id="team">
          <Team />
        </Section>

        {/* ================= FOOTER ================= */}
        <Footer />
      </div>
    </>
  )
}
