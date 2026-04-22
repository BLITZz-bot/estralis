import { motion } from "framer-motion"

export default function Section({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "-10%" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
