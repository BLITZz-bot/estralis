import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

export default function Venue() {
  return (
    <section id="venue" className="relative min-h-screen px-6 py-20 overflow-hidden group">
      
      <SectionBackground 
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
        alt="Venue Architecture" 
      />

      <div className="relative z-10 text-center mb-16">
        <span className="astral-eyebrow text-teal-500 mb-4 inline-block uppercase font-astral">Geospatial_Link</span>
        <h2 className="astral-heading text-5xl sm:text-6xl lg:text-7xl mb-2 text-white uppercase tracking-tighter">
          VENUE
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">

        {/* ===== Venue Info Card ===== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="astral-glass p-8 md:p-14 h-full flex flex-col justify-center hover:border-teal-500/40 transition-all duration-500 relative"
        >
          <h3 className="text-2xl font-astral mb-6 text-teal-400 tracking-tight leading-snug">
            GOPALAN COLLEGE OF ENGINEERING <br className="hidden md:block" /> AND MANAGEMENT
          </h3>

          <div className="space-y-1 mb-8 font-tech text-white/80 text-base md:text-lg">
            <p>Behind SAP Labs, Seetharam Palya,</p>
            <p>Basavanagar, Hoodi,</p>
            <p>Bengaluru - 560048</p>
          </div>

          <p className="text-white/50 text-sm font-tech leading-relaxed mb-10 border-l-2 border-teal-500/30 pl-4 py-1 italic">
            Join us at GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT to celebrate ESTRALIS together.
          </p>

          <a
            href="https://maps.google.com/?q=Gopalan+College+of+Engineering+and+Management"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-teal-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all font-astral w-fit text-center"
          >
            OPEN IN GOOGLE MAPS
          </a>
        </motion.div>

        {/* ===== Map ===== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="w-full h-full min-h-[400px] astral-glass overflow-hidden relative group z-10 p-2 border-teal-500/20"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
          {/* Floating Expand Button (Always visible on mobile, hover on desktop) */}
          <a
            href="https://maps.google.com/?q=Gopalan+College+of+Engineering+and+Management"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 z-30 px-5 py-2.5 bg-teal-500/90 backdrop-blur-md rounded-xl text-black text-[10px] font-black tracking-widest uppercase
                 border border-white/20 shadow-xl hover:bg-white transition-all flex items-center gap-2 font-astral
                 md:opacity-0 md:group-hover:opacity-100"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            EXPAND
          </a>

          <iframe
            title="venue-map"
            src="https://www.google.com/maps?q=Gopalan+College+of+Engineering+and+Management&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
