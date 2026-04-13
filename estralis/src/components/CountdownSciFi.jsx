import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function CountdownSciFi() {
  const target = new Date("2026-05-12T09:00:00")
  const canvasRef = useRef(null);

  const calc = () => {
    const now = new Date()
    const diff = target - now

    if (diff <= 0) {
      return { d: 0, h: 0, m: 0, s: 0, finished: true }
    }

    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
      finished: false
    }
  }

  const [t, setT] = useState(calc())

  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(i)
  }, [])

  // Firework/Cracker Blast Confetti Effect!
  useEffect(() => {
    if (t.finished && canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true
      });

      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 60 * (timeLeft / duration);
        // Golden Papers & Crackers colors
        const goldColors = ['#FFD700', '#FFA500', '#FDB931', '#FFDF00', '#FFFFFF'];

        // Pop from random spots on the upper left
        myConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: goldColors,
        });

        // Pop from random spots on the upper right
        myConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: goldColors,
        });

        // ⭐ NEW: Massive burst directly from the centre countdown boxes! ⭐
        myConfetti({
          ...defaults,
          particleCount: Math.floor(particleCount * 1.5), // Thicker, denser burst from the box
          spread: 360,     // Full circle explosion
          startVelocity: 45, // Faster, stronger pop
          origin: { x: 0.5, y: 0.65 }, // Roughly where the countdown boxes sit vertically
          colors: goldColors,
        });
      }, 250);

      return () => {
        clearInterval(interval);
        myConfetti.reset();
      };
    }
  }, [t.finished]);

  const isBlinking = t.s % 2 === 0;

  // Determine the dynamic FOMO message based on days left
  let message = "";
  let ringColor = ""; // For the box borders and background
  let textColor = ""; // For the actual text 
  let iconColor = ""; // For the blinking status dot

  if (t.finished) {
    message = "THE MISSION HAS COMMENCED — ENJOY!";
    ringColor = "border-teal-400 bg-teal-900/20";
    textColor = "text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]";
    iconColor = "bg-teal-400 animate-ping shadow-[0_0_10px_rgba(45,212,191,1)]";
  } else if (t.d <= 2) {
    message = "FINAL ORBITAL SLOT — CLOSING SOON!";
    ringColor = "border-cyan-500 bg-cyan-950/30";
    textColor = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]";
    iconColor = "bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]";
  } else {
    message = "Secure your transmission — entries open!";
    ringColor = "saarang-block border-teal-500/50 bg-teal-950/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)]";
    textColor = "text-teal-400 font-black";
    iconColor = "bg-teal-400 animate-pulse transition-all duration-1000";
  }


  // Static box - no flip animation (for DAYS, HOURS, MINS)
  const StaticBox = ({ v, l }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-[72px] h-[82px] sm:w-[88px] sm:h-[96px] md:w-[110px] md:h-[120px]
          bg-slate-900/40
          backdrop-blur-xl
          border-l-4 border-l-teal-500 border-r border-y border-white/5
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          flex flex-col items-center justify-center group transition-all hover:bg-teal-500/10"
      >
        <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-none font-astral group-hover:text-teal-400 transition-colors">
          {String(v).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] uppercase font-black tracking-[0.4em] text-teal-400/40 mt-3">{l}</span>
    </div>
  )

  // Animated box - flip animation (SECS only)
  const AnimatedBox = ({ v, l }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-[72px] h-[82px] sm:w-[88px] sm:h-[96px] md:w-[106px] md:h-[116px]
          rounded-2xl
          bg-black/40
          backdrop-blur-xl
          border border-cyan-500/30
          shadow-[0_0_30px_rgba(34,211,238,0.1)]
          flex flex-col items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={v}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-cyan-400 leading-none font-mono"
          >
            {String(v).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-[0.3em] text-cyan-400/30 mt-3">{l}</span>
    </div>
  )

  const subtitle1 = "text-teal-400/80 uppercase tracking-[0.4em] font-black text-xs";
  const subtitle2 = "text-white/40 uppercase tracking-[0.2em] font-bold text-[10px] mt-2 mb-10";

  return (
    <div className="flex flex-col items-center gap-6 relative w-full justify-center">
      

      {/* Decorative Block (Saarang Style) */}
      <motion.div
        initial={{ opacity: 0, rotate: -90, x: -50 }}
        animate={{ opacity: 1, rotate: 0, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="hidden md:block absolute left-4 sm:left-10 lg:left-20 top-1/2 -translate-y-1/2 saarang-block border-teal-500 z-20"
      >
        <span className="astral-eyebrow text-[10px] tracking-[0.3em] uppercase">Transmission Est. 2026</span>
      </motion.div>

      {/* Dynamic Titles */}
      {/* Dynamic Titles Removed to avoid duplication with FestivalHero */}
      <canvas
        ref={canvasRef}
        className={`absolute pointer-events-none z-0 w-[150vw] h-[150vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${t.finished ? 'block' : 'hidden'}`}
      />

      <div className="flex items-center gap-2 sm:gap-3 justify-center relative z-10 min-h-[5rem]">
        <StaticBox v={t.d} l="DAYS" />
        <span className="text-white/30 text-3xl md:text-4xl font-black mb-5 select-none">:</span>
        <StaticBox v={t.h} l="HOURS" />
        <span className="text-white/30 text-3xl md:text-4xl font-black mb-5 select-none">:</span>
        <StaticBox v={t.m} l="MINS" />
        <span className="text-white/30 text-3xl md:text-4xl font-black mb-5 select-none">:</span>
        <AnimatedBox v={t.s} l="SECS" />
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`
              mt-2 flex items-center justify-center gap-3 sm:gap-4
              px-6 py-4 sm:px-10 sm:py-5
              rounded-xl sm:rounded-2xl
              bg-black/40 backdrop-blur-xl 
              border-x-[4px] border-y border-y-white/5
              shadow-lg relative z-10 mx-auto overflow-hidden group
              ${ringColor}
            `}
          >
            <motion.div
              animate={{ x: ["-100%", "250%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            />
            {/* HUD Status Dot */}
            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${iconColor}`} />
            {/* Message Text */}
            <span className={`text-[10px] sm:text-[12px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase ${textColor}`}>
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
