import { motion } from "framer-motion";
import Team from "./Team";
import StarBackground from "./StarBackground";

export default function TeamPortal() {
  const goHome = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-white overflow-y-auto custom-scrollbar z-[500] selection:bg-teal-500/30">
      {/* High-Tech Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <StarBackground />
        {/* Scifi Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
        
        {/* Moving Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(45,212,191,0.05)_50%,transparent_50%)] bg-[size:100%_4px] animate-scanline pointer-events-none" />
      </div>

      <div className="relative z-10">
        {/* HUD Header */}
        <div className="sticky top-0 p-4 md:p-8 flex items-center justify-between bg-[#020617]/40 backdrop-blur-md border-b border-white/5 z-50">
          <div className="flex items-center gap-6">
             <div className="relative">
                <div className="w-12 h-12 border border-teal-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-teal-500 rounded-sm animate-pulse" />
                </div>
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-teal-500" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-teal-500" />
             </div>
             
             <div className="hidden sm:block">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-black tracking-[0.2em] text-white uppercase">Personnel_Database</h1>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-[8px] font-black text-teal-400 border border-teal-500/20">LIVE_CONNECTION</span>
                </div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Sector 7-G // Encryption: AES-256 // System: ESTRALIS_OS</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4 text-[9px] font-black text-teal-500/40 tracking-widest uppercase border-r border-white/10 pr-6">
                <span>CPU: 12%</span>
                <span>MEM: 4.2GB</span>
                <span className="animate-pulse">LATENCY: 14MS</span>
            </div>

            <button 
                onClick={goHome}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-xl bg-teal-500 text-black font-black tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            >
                <span className="text-[10px]">EXIT_PORTAL</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-12 md:py-20">
            <Team />
        </div>

        {/* Footer HUD */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
            <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-teal-500" />
                <p className="font-mono text-[8px] tracking-[0.5em] uppercase">Security Level 4 Restricted Access</p>
            </div>
            
            <p className="font-mono text-[9px] tracking-[0.8em] uppercase">Estralis 2026 // Command Matrix V.26</p>
            
            <div className="flex items-center gap-4 text-[8px] font-bold text-teal-500 uppercase">
                <span className="animate-pulse">● System_Online</span>
                <span className="text-white/20">Data_Synchronized</span>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
