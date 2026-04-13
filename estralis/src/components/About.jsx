import { motion } from "framer-motion"

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative py-24 px-6"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Minimal hardware-accelerated ambient glows */}
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 translate-z-0" />
      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="apple-eyebrow mb-3">✨ The Fest</p>
          <h2 className="apple-heading text-5xl md:text-7xl">
            About <span style={{'WebkitTextFillColor': 'transparent', background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #818cf8 100%)', WebkitBackgroundClip: 'text'}}>ESTRALIS</span>
          </h2>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="apple-glass p-8 md:p-14 text-center group"
        >
          <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed tracking-wide group-hover:text-white transition-colors duration-500">
            This fest marks a grand revival of our college’s cultural spirit after an eight-year hiatus. It is envisioned as a vibrant celebration that brings together talent, creativity, and innovation through a diverse array of competitive and engaging events.

The fest provides an inspiring platform for students to showcase their abilities, collaborate with peers, and celebrate excellence, fostering a sense of unity and cultural enthusiasm across the campus.
          </p>
        </motion.div>

      </div>
      {/* Subtle Bottom Right Watermark */}
      {/* <div className="absolute bottom-2 right-4 opacity-80 pointer-events-none select-none">
        <span className="text-[10px] font-black tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-400">GRAFIK</span>
      </div> */}
    </motion.section>
  )
}
