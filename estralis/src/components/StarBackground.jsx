import { motion } from "framer-motion"

export default function StarBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const stars = Array.from({ length: isMobile ? 15 : 120 })

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
      {stars.map((_, i) => {
        const size = Math.random() * 2.5 + 1
        const duration = 6 + Math.random() * 8
        const delay = Math.random() * 10

        // On mobile: plain static dots — no JS animation, no GPU compositor layers
        if (isMobile) {
          return (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-200"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          )
        }

        // On desktop: full framer-motion twinkling animation
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-200 will-change-transform"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
            }}
          />
        )
      })}
    </div>
  )
}
