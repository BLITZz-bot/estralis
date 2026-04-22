import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function SectionBackground({ src, alt = "Background", activeOpacity = "opacity-40 md:opacity-50" }) {
  const ref = useRef(null);
  
  // Tracks exactly when this background is within the middle 40% of the viewport (mobile + desktop)
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px", amount: 0.1 });

  return (
    <div 
      ref={ref}
      className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 transform-gpu
        group-hover:grayscale-0 group-hover:opacity-40 md:group-hover:opacity-60
        ${isInView ? `grayscale-0 ${activeOpacity}` : 'grayscale opacity-10 md:opacity-20'}
      `}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] ease-out will-change-transform z-0
          group-hover:scale-100
          ${isInView ? 'scale-100' : 'scale-105'}
          ${typeof window !== 'undefined' && window.innerWidth < 768 ? 'mix-blend-normal opacity-20 transition-none' : 'mix-blend-screen'}
        `} 
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617] z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-[#020617]/90 z-10" />
    </div>
  );
}
