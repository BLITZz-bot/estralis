import { motion, useScroll } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-teal-500 via-aqua-500 to-cyan-500 z-[60]"
    />
  )
}
