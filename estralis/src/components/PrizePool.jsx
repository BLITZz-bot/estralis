import { motion, useInView } from "framer-motion"
import { useEffect, useState, useRef } from "react"

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

  return <span ref={ref}>₹ {count.toLocaleString()}</span>
}

const prizes = [
  { place: "1st", icon: "🥇", amount: "₹ 50,000+", color: "from-amber-400 to-yellow-600", glow: "shadow-[0_0_40px_rgba(251,191,36,0.35)]", border: "border-amber-400/50", bg: "from-amber-900/30 to-transparent", size: "scale-110 z-10" },
  { place: "2nd", icon: "🥈", amount: "₹ 30,000+", color: "from-slate-300 to-slate-500", glow: "shadow-[0_0_30px_rgba(148,163,184,0.25)]", border: "border-slate-400/40", bg: "from-slate-800/30 to-transparent", size: "" },
  { place: "3rd", icon: "🥉", amount: "₹ 20,000+", color: "from-orange-400 to-orange-700", glow: "shadow-[0_0_30px_rgba(251,146,60,0.25)]", border: "border-orange-500/40", bg: "from-orange-900/30 to-transparent", size: "" },
]

export default function PrizePool() {
  return (
    <section className="relative py-20 md:py-32 px-6 overflow-hidden">

      {/* Dramatic background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)" }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Eyebrow + Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="apple-eyebrow mb-4">🏆 Win Big</p>
          <h2 className="apple-heading text-5xl md:text-7xl mb-4">Prize Pool</h2>
          <p className="text-white/40 text-sm tracking-widest uppercase font-medium mb-12">
            Estralis 2026 &bull; Total Winnings
          </p>
        </motion.div>

        {/* GRAND TOTAL counter — hero number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          className="mb-16"
        >
          <div className="inline-block relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(168,85,247,0.4) 60%, transparent 100%)" }} />

            <div className="relative text-7xl md:text-9xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #fff 50%, #a855f7 75%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 40px rgba(251,191,36,0.4))"
              }}>
              <Counter value="100000" duration={2} />
            </div>
          </div>
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mt-4 font-bold">Grand Total Prize Money</p>
        </motion.div>

        {/* Motivational tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-white/30 text-xs md:text-sm tracking-widest uppercase font-medium"
        >
          Compete. Create. Conquer.
        </motion.p>
      </div>
    </section>
  )
}
