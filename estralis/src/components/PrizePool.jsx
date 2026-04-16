import { motion, useInView } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import SectionBackground from "./SectionBackground"

function Counter({ value, duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = parseInt(value)
      const frames = duration * 60
      const increment = Math.ceil(end / frames)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) { setCount(end); clearInterval(timer) }
        else setCount(start)
      }, 16)
      return () => clearInterval(timer)
    }
  }, [value, duration, isInView])

  return <span ref={ref}>₹{count.toLocaleString()}</span>
}

export default function PrizePool() {
  return (
    <section className="relative py-20 md:py-32 px-6 bg-transparent overflow-hidden group">
      
      <SectionBackground 
        src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80" 
        alt="Cryptic Bounty Fluid" 
      />

      {/* Background Poster Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-[0.04] pointer-events-none select-none flex justify-center items-center">
         <h2 className="text-[22vw] md:text-[26vw] font-black tracking-tighter uppercase leading-none text-center text-white">BOUNTY</h2>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <span className="astral-eyebrow text-teal-500 mb-6 block">Transmission Est. 404-X</span>
          <h2 className="astral-heading text-5xl md:text-7xl lg:text-8xl mb-4 uppercase">Prize Pool</h2>
          <div className="saarang-block mx-auto inline-block px-12 py-3 mt-4">
            <p className="saarang-serif italic text-teal-400 text-xl md:text-2xl">The Cumulative Interstellar Pool</p>
          </div>
        </motion.div>

        {/* Massive Counter Reward */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative group"
        >
          {/* Decorative Corner Chevrons (Saarang Style) */}
          <div className="absolute -top-10 -left-10 text-teal-500/20 text-4xl opacity-0 group-hover:opacity-100 transition-opacity">/ /</div>
          <div className="absolute -bottom-10 -right-10 text-teal-500/20 text-4xl opacity-0 group-hover:opacity-100 transition-opacity">/ /</div>

          <div className="inline-block relative">
             <h1 className="saarang-banner-text text-[12vw] md:text-[10vw] lg:text-[8vw] text-white tracking-tighter leading-none drop-shadow-[0_20px_60px_rgba(45,212,191,0.2)]">
                <Counter value="210000" duration={3} />
             </h1>
          </div>

          <p className="mt-12 text-teal-100/30 text-[10px] md:text-xs tracking-[0.5em] uppercase font-black">
             Total Rewards to be Claimed &bull; Protocol V.26
          </p>
        </motion.div>

        {/* Gritty Noise Background for the whole section */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none opacity-20 bg-gradient-to-t from-teal-500/5 to-transparent" />
      </div>
    </section>
  )
}
