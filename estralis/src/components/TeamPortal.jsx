import { motion } from "framer-motion";
import Team from "./Team";
import StarBackground from "./StarBackground";

export default function TeamPortal() {
  const goHome = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-white overflow-y-auto custom-scrollbar z-[500]">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <StarBackground />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header / Back Button */}
        <div className="sticky top-0 p-6 md:p-10 flex items-center justify-between bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-50">
          <div className="flex items-center gap-4">
             <div className="w-1 h-8 bg-teal-500 rounded-full" />
             <div>
                <h1 className="text-xl font-black tracking-widest text-white uppercase">Team Portal</h1>
                <p className="text-[10px] font-bold text-teal-400/60 uppercase tracking-widest">Protocol V.26 // CORE_COMMAND</p>
             </div>
          </div>
          
          <button 
            onClick={goHome}
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all"
          >
            <span className="text-[10px] font-black tracking-widest uppercase text-white/60 group-hover:text-teal-400">Exit Portal</span>
            <svg className="w-4 h-4 text-white/40 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="py-10">
            <Team />
        </div>

        {/* Footer */}
        <div className="py-20 text-center opacity-20 border-t border-white/5">
            <p className="font-mono text-[10px] tracking-[0.5em] uppercase">
                Estralis 2026 // Team Matrix // End of Transmission
            </p>
        </div>
      </div>
    </div>
  );
}
