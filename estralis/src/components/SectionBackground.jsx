import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';

export default function SectionBackground({ src, alt = "Background", activeOpacity = "opacity-40 md:opacity-50" }) {
  const ref = useRef(null);

  // Tracks exactly when this background is within the middle 40% of the viewport (mobile + desktop)
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", amount: 0.1 });

  return (
    <div 
      ref={ref}
      className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000
        group-hover:grayscale-0 group-hover:opacity-40 md:group-hover:opacity-60
        ${isInView ? `grayscale-0 ${activeOpacity}` : 'grayscale opacity-10 md:opacity-20'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617] z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-[#020617]/90 z-10" />

      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.05 }}
        animate={{ scale: isInView ? 1 : 1.07 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full object-cover mix-blend-screen will-change-transform"
      />
    </div>
  );
}
