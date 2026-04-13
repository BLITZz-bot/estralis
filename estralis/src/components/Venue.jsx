import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

export default function Venue() {
  return (
    <section id="venue" className="relative min-h-screen px-6 py-20 overflow-hidden group">
      
      <SectionBackground 
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
        alt="Venue Architecture" 
      />

      <div className="relative z-10 text-center mb-12">
        <p className="apple-eyebrow mb-3">🌍 Location</p>
        <h2 className="apple-heading text-5xl md:text-7xl">Venue</h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">

        {/* ===== Venue Info Card ===== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="apple-glass-panel p-10 md:p-14 h-full flex flex-col justify-center"
        >
          <h3 className="text-2xl font-black mb-4 text-white tracking-tight">
            GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT
          </h3>

          <p className="text-white/80 font-medium">
            Behind SAP Labs, Seetharam Palya, Basavanagar, Hoodi
          </p>
          <p className="text-white/80 font-medium mb-6">
            Bengaluru - 560048
          </p>

          <p className="text-white/60 text-sm leading-relaxed">
            Join us at GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT to celebrate ESTRALIS together.
          </p>

          <a
            href="https://maps.google.com/?q=Gopalan+College+of+Engineering+and+Management"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-105 hover:bg-gray-200 transition-all w-fit"
          >
            Open in Google Maps
          </a>
        </motion.div>

        {/* ===== Map ===== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full h-full min-h-[350px] apple-glass-panel overflow-hidden relative group z-10 p-2"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
          {/* Floating Expand Button (Always visible on mobile, hover on desktop) */}
          <a
            href="https://maps.google.com/?q=Gopalan+College+of+Engineering+and+Management"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 z-30 px-4 py-2 bg-black/70 backdrop-blur-md rounded-xl text-white text-xs font-bold 
                 border border-white/20 shadow-xl hover:bg-purple-600 transition-all flex items-center gap-2
                 md:opacity-0 md:group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Expand Map
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
