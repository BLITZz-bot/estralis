import { motion } from "framer-motion"

export default function FestivalHero() {
  return (
    <div className="relative w-full flex flex-col items-center pt-24 pb-12 px-6 text-center select-none overflow-hidden">

      {/* Background Poster Depth - Subtle Overlay Text */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="saarang-serif text-teal-400 italic text-2xl md:text-3xl lg:text-4xl mb-2 tracking-wide"
        >
          The Interstellar Symposium
        </motion.p>

        {/* Massive Primary Title and Chromatic Glow */}
        <div className="relative w-full flex justify-center items-center my-10 perspective-1000">

          {/* Chromatic Aberration Layers */}
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, x: [-3, 3, -3], y: [-2, 2, -2] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              opacity: { duration: 1.2, ease: "easeOut" },
              x: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            className="saarang-banner-text text-cyan-500/60 absolute text-[13vw] sm:text-[12vw] leading-normal pb-4 tracking-tight blur-[8px] z-0"
            style={{ transform: 'scaleY(1.4)', transformOrigin: 'bottom' }}
          >
            ESTRALIS
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, x: [3, -3, 3], y: [2, -2, 2] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              opacity: { duration: 1.2, ease: "easeOut" },
              x: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
            className="saarang-banner-text text-fuchsia-500/60 absolute text-[13vw] sm:text-[12vw] leading-normal pb-4 tracking-tight blur-[8px] z-0"
            style={{ transform: 'scaleY(1.4)', transformOrigin: 'bottom' }}
          >
            ESTRALIS
          </motion.h1>

          {/* Main Hero Text with Holographic Liquid Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9, backgroundPosition: '0% 50%' }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              opacity: { duration: 1.2, ease: "easeOut" },
              y: { duration: 1.2, ease: "easeOut" },
              scale: { duration: 1.2, ease: "easeOut" },
              backgroundPosition: { repeat: Infinity, duration: 8, ease: "linear" }
            }}
            className="saarang-banner-text text-transparent bg-clip-text text-[13vw] sm:text-[12vw] leading-normal pb-4 tracking-tight z-10 bg-gradient-to-r from-teal-300 via-fuchsia-400 to-cyan-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{
              transform: 'scaleY(1.4)',
              transformOrigin: 'bottom',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ESTRALIS
          </motion.h1>

          {/* Glassmorphic Futuristic HUD Badges */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: [-5, 5, -5] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              opacity: { duration: 1, delay: 1 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            className="absolute -top-[20%] sm:-top-[15%] md:top-[5%] left-[5%] sm:left-[10%] md:left-[20%] z-20"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/20 text-cyan-300 font-mono tracking-[0.2em] text-[7px] sm:text-[9px] px-2 sm:px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.2)] uppercase whitespace-nowrap">
              v1.0 Symposium
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: [-4, 4, -4] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              opacity: { duration: 1, delay: 1.1 },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }
            }}
            className="absolute top-[65%] sm:top-[70%] md:top-[35%] left-1/2 md:left-[48%] -translate-x-1/2 md:translate-x-0 z-20"
          >
            <div className="backdrop-blur-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-200 font-mono tracking-[0.2em] text-[7px] sm:text-[9px] px-2 sm:px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)] uppercase transform -rotate-3 whitespace-nowrap">
              May 14-15
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: [-6, 6, -6] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              opacity: { duration: 1, delay: 1.2 },
              y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }
            }}
            className="absolute -top-[20%] sm:top-[2%] md:top-[10%] right-[5%] sm:right-[15%] md:right-[25%] z-20"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/20 text-teal-300 font-mono tracking-[0.2em] text-[7px] sm:text-[9px] px-2 sm:px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.3)] uppercase whitespace-nowrap">
              Coordinates Locked
            </div>
          </motion.div>

          {/* Abstract Orbital Rings instead of cartoon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, rotateZ: 360, rotateX: 60, rotateY: 30 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ opacity: { duration: 1.5, delay: 0.5 }, rotateZ: { repeat: Infinity, duration: 20, ease: "linear" } }}
            className="absolute bottom-[-10%] right-[10%] w-[60px] h-[60px] sm:w-[120px] sm:h-[120px] md:w-[180px] md:h-[180px] rounded-full border border-teal-500/30 border-dashed z-0"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, rotateZ: -360, rotateX: 40, rotateY: 70 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ opacity: { duration: 1.5, delay: 0.8 }, rotateZ: { repeat: Infinity, duration: 15, ease: "linear" } }}
            className="absolute bottom-[-10%] right-[10%] w-[60px] h-[60px] sm:w-[120px] sm:h-[120px] md:w-[180px] md:h-[180px] rounded-full border-2 border-fuchsia-500/20 z-0 shadow-[0_0_30px_rgba(217,70,239,0.2)]"
          />

        </div>

        {/* Date / Location Info (Saarang Grid Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl"
        >
          <div className="flex flex-col items-center md:items-end w-full md:w-1/2 md:pr-12 md:border-r border-teal-500/30 pb-4 md:pb-0 mb-4 md:mb-0 md:text-right text-center">
            <span className="text-teal-400 font-bold text-[15px] tracking-[0.25em] uppercase">Coordinates</span>
            <span className="text-white/50 font-mono text-[13px] uppercase tracking-[0.15em] mt-1">GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT Campus, BENGALURU</span>
          </div>

          <div className="flex flex-col items-center md:items-start w-full md:w-1/2 md:pl-12 text-center md:text-left">
            <span className="text-teal-400 font-bold text-[15px] tracking-[0.25em] uppercase">Launch Window</span>
            <span className="text-white/50 font-mono text-[13px] uppercase tracking-[0.15em] mt-1">MAY 14 — 15, 2026</span>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
