import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

export default function About({ onOpenProtocol }) {
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

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-center md:items-start">

        {/* Title Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/3 flex flex-col text-center md:text-left relative md:sticky md:top-32 z-0"
        >
          <span className="astral-eyebrow text-teal-500 mb-4 block uppercase font-astral">Decrypting_Data</span>
          <h2 className="astral-heading text-4xl sm:text-6xl lg:text-6xl mb-2 text-white uppercase tracking-[0.05em] font-unbounded italic">
            ABOUT
          </h2>
          <h2 className="saarang-banner-text text-5xl sm:text-7xl lg:text-[4rem] text-teal-400 font-unbounded tracking-tighter">
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
          <div className="astral-glass p-8 md:p-14 hover:border-teal-500/40 transition-all duration-500 relative group">
            <p className="text-white/80 text-sm md:text-base saarang-serif tracking-wide leading-loose mb-10">
              This fest marks a grand revival of our college’s cultural spirit after an eight-year hiatus. It is envisioned as a vibrant celebration that brings together talent, creativity, and innovation through a diverse array of competitive and engaging events.
            </p>

            <p className="text-white/80 text-sm md:text-base saarang-serif tracking-wide leading-loose mb-12">
              The fest provides an inspiring platform for students to showcase their abilities, collaborate with peers, and celebrate excellence, fostering a sense of unity and cultural enthusiasm across the campus.
            </p>

            <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-6 justify-between items-center">
              <button
                onClick={onOpenProtocol}
                className="px-12 py-5 bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all font-astral"
              >
                READ PROTOCOL
              </button>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black tracking-widest uppercase text-white/20 font-astral">
                  Secure_Transmission
                </span>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  )
}
