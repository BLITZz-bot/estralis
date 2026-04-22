import { motion } from "framer-motion"

export default function Section({ children, className = "", id }) {
  const yOffset = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 80;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: yOffset, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
