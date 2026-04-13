import { motion } from "framer-motion"

export default function FestivalHero() {
  return (
    <div className="relative w-full flex flex-col items-center pt-24 pb-12 px-6 text-center select-none overflow-hidden">
      
      {/* Background Poster Depth - Subtle Overlay Text */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[25vw] font-black tracking-[-0.1em] astral-heading opacity-30 leading-none">
          2026
        </span>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Artistic Sub-label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="saarang-serif text-teal-400 italic text-xl md:text-3xl lg:text-4xl mb-2 tracking-wide"
        >
          The Interstellar Symposium
        </motion.p>

        {/* Massive Primary Title */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="saarang-banner-text text-[11vw] sm:text-[12vw] text-white mix-blend-difference drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] tracking-tight md:tracking-normal"
          >
            ESTRALIS
          </motion.h1>
          
        </div>

        {/* Date / Location Info (Saarang Grid Style) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl"
        >
          <div className="flex flex-col items-center md:items-end w-full md:w-1/2 md:pr-12 md:border-r border-teal-500/30 pb-4 md:pb-0 mb-4 md:mb-0 md:text-right text-center">
            <span className="text-teal-400 font-bold text-[13px] tracking-[0.25em] uppercase">Coordinates</span>
            <span className="text-white/50 font-mono text-[11px] uppercase tracking-[0.15em] mt-1">GCEM CAMPUS, BENGALURU</span>
          </div>
          
          <div className="flex flex-col items-center md:items-start w-full md:w-1/2 md:pl-12 text-center md:text-left">
            <span className="text-teal-400 font-bold text-[13px] tracking-[0.25em] uppercase">Launch Window</span>
            <span className="text-white/50 font-mono text-[11px] uppercase tracking-[0.15em] mt-1">MAY 12 — 15, 2026</span>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
