import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [showLinks, setShowLinks] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLinks(false);
      }
    }
    if (showLinks) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLinks]);

  return (
    <footer className="relative mt-32 px-6 pb-12 overflow-hidden">
      {/* Structural Divider */}
      <div className="flex items-center gap-4 mb-16 opacity-30">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-500 to-teal-500"></div>
        <span className="text-[10px] font-black tracking-[0.5em] text-teal-400 whitespace-nowrap uppercase">
          Archive Transmission End // Protocol 2.26
        </span>
        <div className="h-px w-24 bg-teal-500"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        
        {/* Identity Block */}
        <div className="md:col-span-4 space-y-6">
          <div>
            <h3 className="text-4xl font-black tracking-tight text-white mb-1">
              ESTRALIS<span className="text-teal-400">2026</span>
            </h3>
            <p className="saarang-serif text-teal-400/60 italic text-sm tracking-wide">
              The Great Interstellar Revival
            </p>
          </div>
          
          <div className="space-y-2 opacity-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-100">
              Gopalan College of Engineering and Management
            </p>
            <p className="text-[9px] font-medium tracking-[0.2em] text-teal-100/60 max-w-[200px]">
              WHITEFIELD, BENGALURU, KARNATAKA 560048, INDIA
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">Signal_Strength</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/gcem.students/" target="_blank" rel="noopener noreferrer" className="p-3 border border-teal-500/20 hover:border-teal-400/50 hover:bg-teal-400/5 transition-all group">
                <svg className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="http://www.linkedin.com/in/gcem" target="_blank" rel="noopener noreferrer" className="p-3 border border-teal-500/20 hover:border-teal-400/50 hover:bg-teal-400/5 transition-all group">
                <svg className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href="https://www.facebook.com/Gopalancolleges" target="_blank" rel="noopener noreferrer" className="p-3 border border-teal-500/20 hover:border-teal-400/50 hover:bg-teal-400/5 transition-all group">
                <svg className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.96 3.63 9.08 8.4 9.82v-6.94h-2.53v-2.88h2.53v-2.2c0-2.51 1.5-3.88 3.77-3.88 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.88h-2.34v6.94c4.78-.74 8.4-4.86 8.4-9.82 0-5.5-4.46-9.96-9.96-9.96z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">Contact_Freq</h4>
            <div className="space-y-4">
              <div className="text-[12px] font-black tracking-[0.2em] uppercase text-teal-300 mb-2 cursor-pointer">
                Bharath
              </div>
              <a href="mailto:bharatha9483@gmail.com" className="block group">
                <span className="text-[9px] text-teal-400/40 block mb-1">Inbound_Mail</span>
                <span className="text-[11px] text-white font-bold tracking-tight group-hover:text-teal-400 transition-colors italic">bharatha9483@gmail.com</span>
              </a>
              <a href="tel:7975871167" className="block group">
                <span className="text-[9px] text-teal-400/40 block mb-1">Emergency_Line</span>
                <span className="text-[11px] text-white font-bold tracking-tight group-hover:text-teal-400 transition-colors">+91 7975871167</span>
              </a>
            </div>
          </div>
        </div>

        {/* Rights Meta */}
        <div className="md:col-span-3 flex flex-col items-start md:items-end gap-6 text-left md:text-right">
          <div className="text-[10px] font-bold tracking-[0.1em] text-white/50 leading-relaxed md:mt-11">
            © 2026 ESTRALIS.<br />
            OFFICIAL FEST WEBSITE OF ESTRALIS.<br />
            ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>

      {/* Developer Reveal */}
      <div className="mt-20 flex flex-col items-center gap-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Designed & Developed_By
        </div>
        <div className="relative" ref={popupRef}>
          <button
            onClick={() => setShowLinks(!showLinks)}
            className="saarang-serif text-2xl text-teal-400/60 hover:text-teal-400 hover:glow-teal transition-all italic tracking-tight"
          >
            Bharath
          </button>

          <AnimatePresence>
            {showLinks && (
              <motion.div
                initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.9 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.9 }}
                className="absolute bottom-full left-1/2 mb-8 w-64 p-6 bg-black border border-teal-500/30 z-50 backdrop-blur-xl"
              >
                <div className="text-left space-y-4">
                  <div>
                    <h5 className="text-white font-black text-lg tracking-tighter uppercase">M M BHARATH</h5>
                    <p className="text-[8px] font-black tracking-[0.4em] text-teal-400 uppercase mt-1">Systems Architect</p>
                  </div>
                  <div className="space-y-2">
                    <a href="https://www.linkedin.com/in/bharath-m-m-a9960b309" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-white/60 hover:text-teal-400 transition-colors uppercase">
                      <span className="w-1 h-1 bg-teal-500"></span> LinkedIn
                    </a>
                    <a href="https://www.instagram.com/bharatha01/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-white/60 hover:text-teal-400 transition-colors uppercase">
                      <span className="w-1 h-1 bg-teal-500"></span> Instagram
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  );
}
