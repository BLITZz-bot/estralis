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
    message = "THE WAIT IS OVER — LET'S GO!";
    ringColor = "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] bg-yellow-900/20";
    textColor = "text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]";
    iconColor = "bg-yellow-400 animate-ping shadow-[0_0_10px_rgba(250,204,21,1)]";
  } else if (t.d === 1) {
    message = "LAST CHANCE — register now or miss out!";
    ringColor = "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-950/30";
    textColor = "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    iconColor = "bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]";
  } else if (t.d === 0 && !t.finished) {
    message = "Last few spots left — closing anytime.";
    ringColor = "border-red-600 shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-red-950/40";
    textColor = "text-red-500 font-black drop-shadow-[0_0_12px_rgba(239,68,68,1)]";
    iconColor = "bg-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]";
  } else if (t.d === 2) {
    message = "Final spots left — registrations closing soon!";
    ringColor = "border-orange-500 border-x-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)] bg-orange-950/20";
    textColor = "text-orange-400";
    iconColor = "bg-orange-500 animate-pulse";
  } else if (t.d === 3) {
    message = "Almost full — secure your spot before it's gone!";
    ringColor = "border-amber-500/50 border-x-amber-500/80 bg-amber-950/20";
    textColor = "text-amber-400";
    iconColor = "bg-amber-500/80";
  } else if (t.d === 4) {
    message = "Spots are filling fast — secure yours now!";
    ringColor = "border-yellow-500/30 border-x-yellow-500/60 bg-yellow-950/10";
    textColor = "text-yellow-400";
    iconColor = "bg-yellow-500/80";
  } else if (t.d === 5) {
    message = "Only 5 days left — registrations are filling fast!";
    ringColor = "border-purple-500/30 border-x-purple-500/60 bg-purple-950/10";
    textColor = "text-purple-300";
    iconColor = "bg-purple-400";
  }


  // Static box - no flip animation (for DAYS, HOURS, MINS)
  const StaticBox = ({ v, l }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-[72px] h-[82px] sm:w-[88px] sm:h-[96px] md:w-[106px] md:h-[116px]
          rounded-2xl
          bg-[rgba(20,20,35,0.85)]
          backdrop-blur-md
          border border-white/[0.06]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.5)]
          flex flex-col items-center justify-center"
      >
        <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
          {String(v).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mt-2">{l}</span>
    </div>
  )

  // Animated box - flip animation (SECS only)
  const AnimatedBox = ({ v, l }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-[72px] h-[82px] sm:w-[88px] sm:h-[96px] md:w-[106px] md:h-[116px]
          rounded-2xl
          bg-[rgba(20,20,35,0.85)]
          backdrop-blur-md
          border border-white/[0.06]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.5)]
          flex flex-col items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={v}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-none"
          >
            {String(v).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mt-2">{l}</span>
    </div>
  )

  const titleGlow = t.finished
    ? "bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
    : "bg-gradient-to-b from-white via-blue-200 to-blue-400";
  const subtitle1 = t.finished
    ? "text-yellow-400/90 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"
    : "text-blue-300/80";
  const subtitle2 = t.finished ? "text-yellow-600/90" : "text-gray-400";

  return (
    <div className="flex flex-col items-center gap-6 relative w-full">
      {/* Dynamic Titles */}
      <div className="flex flex-col items-center z-20">
        <p className={`tracking-[0.55em] text-sm md:text-base mb-2 transition-all duration-1000 ${subtitle1}`}>
          CULTURAL FEST 2026
        </p>

        <p className={`tracking-widest text-xs md:text-sm mb-2 mt-3 transition-colors duration-1000 ${subtitle2}`}>
          GOPALAN COLLEGE OF ENGINEERING & MANAGEMENT
        </p>
        <h1 className={`text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent tracking-wide transition-all duration-1000 pb-2 ${titleGlow}`}>
          ESTRALIS
        </h1>
      </div>
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
