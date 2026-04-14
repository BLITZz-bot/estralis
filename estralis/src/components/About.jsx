import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative py-24 md:py-32 px-6 overflow-hidden group"
    >
      
      <SectionBackground 
        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80" 
        alt="Tech Hub" 
      />

      {/* Gritty Noise Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent z-10" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-center md:items-start">

        {/* Title Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/3 flex flex-col text-center md:text-left relative md:sticky md:top-32 z-0"
        >
          <span className="astral-eyebrow text-teal-500 mb-4 block">INITIATING DECRYPT...</span>
          <h2 className="astral-heading text-4xl sm:text-5xl lg:text-6xl mb-2 text-white uppercase tracking-tighter">
            ABOUT
          </h2>
          <h2 className="saarang-banner-text text-5xl sm:text-6xl lg:text-[4rem] text-teal-400 leading-[0.8]">
            ESTRALIS
          </h2>
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full md:w-2/3"
        >
          <div className="saarang-block border-l-4 border-l-teal-500 p-8 md:p-12 hover:border-l-white transition-colors duration-500 relative group bg-black/40 backdrop-blur-sm">

            {/* Corner Decorative Elements */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-500/30 group-hover:border-teal-500/80 transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-500/30 group-hover:border-teal-500/80 transition-colors"></div>

            <p className="text-teal-100/70 text-sm md:text-base font-mono leading-relaxed tracking-wide mb-8">
              <span className="text-teal-400 font-bold tracking-widest">&gt; LOG ENTRY_ 01: </span><br />
              This fest marks a grand revival of our college’s cultural spirit after an eight-year hiatus. It is envisioned as a vibrant celebration that brings together talent, creativity, and innovation through a diverse array of competitive and engaging events.
            </p>

            <p className="text-teal-100/70 text-sm md:text-base font-mono leading-relaxed tracking-wide">
              <span className="text-teal-400 font-bold tracking-widest">&gt; LOG ENTRY_ 02: </span><br />
              The fest provides an inspiring platform for students to showcase their abilities, collaborate with peers, and celebrate excellence, fostering a sense of unity and cultural enthusiasm across the campus.
            </p>

            <div className="mt-12 pt-6 border-t border-teal-500/20 flex justify-between items-center">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-teal-500/50 block">
                End_Of_Transmission
              </span>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  )
}
