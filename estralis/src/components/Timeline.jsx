import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const timelineData = {
  "APR 10": [
    { time: "09:00 AM – 10:00 AM", title: "INAUGURATION",      type: "Ceremony" },
    { time: "10:30 AM – 12:00 PM", title: "CLASSICAL GROUP",   type: "Cultural" },
    { time: "10:30 AM – 01:00 PM", title: "REELS MAKING",      type: "Fun" },
    { time: "11:00 AM – 01:00 PM", title: "TREASURE HUNT",     type: "Fun" },
    { time: "11:00 AM – 01:00 PM", title: "FACE PAINTING",     type: "Fun" },
    { time: "11:00 AM – 01:00 PM", title: "FITNESS CHALLENGE", type: "Sports" },
    { time: "11:30 AM – 12:30 PM", title: "BEAT BOXING",       type: "Cultural" },
    { time: "12:00 PM – 01:00 PM", title: "WESTERN SOLO",      type: "Cultural" },
    { time: "12:00 PM – 03:00 PM", title: "BGMI",              type: "Gaming" },
  ],
  "APR 11": [
    { time: "09:30 AM – 10:30 AM", title: "WESTERN GROUP",       type: "Cultural" },
    { time: "11:00 AM – 12:30 PM", title: "BATTLE OF BANDS",     type: "Cultural" },
    { time: "01:00 PM – 03:00 PM", title: "PRIZE DISTRIBUTION",  type: "Ceremony" },
    { time: "06:00 PM – 07:30 PM", title: "ARTIST PERFORMANCE",  type: "Cultural" },
    { time: "07:30 PM – 08:30 PM", title: "DJ NIGHT",            type: "Fun" },
  ],
}

/* ── Per-type color maps ── */
const typeStyles = {
  Ceremony: {
    orb:       "bg-amber-400/80 shadow-[0_0_16px_rgba(251,191,36,0.7)]",
    line:      "bg-gradient-to-b from-amber-400/60 to-transparent",
    card:      "border-amber-400/40 hover:border-amber-400/80 hover:shadow-[0_0_28px_rgba(251,191,36,0.2)]",
    bg:        "from-amber-900/25 via-yellow-900/10 to-transparent",
    badge:     "bg-amber-400/15 border-amber-400/40 text-amber-300",
    timePill:  "bg-amber-400/10 border-amber-400/20 text-amber-200",
    icon:      "🏛️",
  },
  Cultural: {
    orb:       "bg-pink-500/80 shadow-[0_0_16px_rgba(236,72,153,0.7)]",
    line:      "bg-gradient-to-b from-pink-500/60 to-transparent",
    card:      "border-pink-500/40 hover:border-pink-400/80 hover:shadow-[0_0_28px_rgba(236,72,153,0.2)]",
    bg:        "from-pink-900/25 via-rose-900/10 to-transparent",
    badge:     "bg-pink-500/15 border-pink-400/40 text-pink-300",
    timePill:  "bg-pink-500/10 border-pink-400/20 text-pink-200",
    icon:      "🎭",
  },
  Fun: {
    orb:       "bg-red-500/80 shadow-[0_0_16px_rgba(239,68,68,0.7)]",
    line:      "bg-gradient-to-b from-red-500/60 to-transparent",
    card:      "border-red-500/40 hover:border-red-400/80 hover:shadow-[0_0_28px_rgba(239,68,68,0.2)]",
    bg:        "from-red-900/25 via-rose-900/10 to-transparent",
    badge:     "bg-red-500/15 border-red-400/40 text-red-300",
    timePill:  "bg-red-500/10 border-red-400/20 text-red-200",
    icon:      "🎉",
  },
  Sports: {
    orb:       "bg-emerald-400/80 shadow-[0_0_16px_rgba(52,211,153,0.7)]",
    line:      "bg-gradient-to-b from-emerald-400/60 to-transparent",
    card:      "border-emerald-400/40 hover:border-emerald-400/80 hover:shadow-[0_0_28px_rgba(52,211,153,0.2)]",
    bg:        "from-emerald-900/25 via-green-900/10 to-transparent",
    badge:     "bg-emerald-400/15 border-emerald-400/40 text-emerald-300",
    timePill:  "bg-emerald-400/10 border-emerald-400/20 text-emerald-200",
    icon:      "💪",
  },
  Gaming: {
    orb:       "bg-violet-500/80 shadow-[0_0_16px_rgba(139,92,246,0.7)]",
    line:      "bg-gradient-to-b from-violet-500/60 to-transparent",
    card:      "border-violet-500/40 hover:border-violet-400/80 hover:shadow-[0_0_28px_rgba(139,92,246,0.2)]",
    bg:        "from-violet-900/25 via-purple-900/10 to-transparent",
    badge:     "bg-violet-500/15 border-violet-400/40 text-violet-300",
    timePill:  "bg-violet-500/10 border-violet-400/20 text-violet-200",
    icon:      "🎮",
  },
}

export default function Timeline() {
  const [activeTab, setActiveTab] = useState(Object.keys(timelineData)[0])
  const events = timelineData[activeTab]

  return (
    <section id="timeline" className="relative py-28 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="apple-eyebrow mb-3">🗓️ What's Happening</p>
          <h2 className="apple-heading text-5xl md:text-7xl mb-4">Schedule</h2>
          <p className="text-white/40 text-sm tracking-widest uppercase font-medium">Estralis 2026 &bull; Two Days of Excellence</p>
        </motion.div>
      </div>

      {/* Day Tabs */}
      <div className="flex justify-center mb-20 relative z-10">
        <div className="inline-flex apple-glass p-2 gap-1">
          {Object.keys(timelineData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-3.5 rounded-[1.5rem] text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-500 ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-white"}`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="timeline-tab"
                  className="absolute inset-0 bg-white rounded-[1.5rem]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>


      {/* Timeline Stream */}
      <div className="relative max-w-4xl mx-auto pl-8 md:pl-0 z-10">

        {/* Glowing central line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(168,85,247,0.6) 15%, rgba(236,72,153,0.5) 50%, rgba(251,191,36,0.5) 85%, transparent 100%)" }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-10 md:space-y-20"
          >
            {events.map((event, i) => (
              <TimelineNode key={i} event={event} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Day switcher button */}
        <div className="mt-20 flex justify-center relative z-20">
          {activeTab === "APR 10" ? (
            <button
              onClick={() => { setActiveTab("APR 11"); document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group apple-glass flex items-center gap-3 px-8 py-4 text-white font-bold hover:shadow-[0_0_24px_rgba(168,85,247,0.3)] transition"
            >
              Day Two
              <span className="transform group-hover:translate-x-1 transition">→</span>
            </button>
          ) : (
            <button
              onClick={() => { setActiveTab("APR 10"); document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group apple-glass flex items-center gap-3 px-8 py-4 text-white font-bold hover:shadow-[0_0_24px_rgba(168,85,247,0.3)] transition"
            >
              <span className="transform group-hover:-translate-x-1 transition">←</span>
              Day One
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function TimelineNode({ event, index }) {
  const isEven = index % 2 === 0
  const s = typeStyles[event.type] || typeStyles.Fun

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative flex items-start md:justify-between w-full group ${!isEven ? "md:flex-row-reverse" : ""}`}
    >
      {/* Glowing orb on the line */}
      <div className="absolute left-0 md:left-1/2 -translate-x-[calc(50%-0.5px)] md:-translate-x-1/2 mt-6 z-20">
        <div className={`w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-150 ${s.orb}`} />
      </div>

      {/* Spacer for alternate side on desktop */}
      <div className="hidden md:block w-[45%]" />

      {/* Card */}
      <div className="w-full md:w-[45%] pl-8 md:pl-0">
        <div className={`relative rounded-2xl border bg-gradient-to-br ${s.bg} backdrop-blur-md p-5 transition-all duration-300 overflow-hidden ${s.card}`}>

          {/* Subtle corner glow */}
          <div className={`absolute top-0 right-0 w-24 h-24 opacity-30 rounded-full blur-xl pointer-events-none ${s.orb.split(' ')[0]}`} />

          {/* Time + Type row */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-semibold tracking-widest ${s.timePill}`}>
              🕐 {event.time}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${s.badge}`}>
              {s.icon} {event.type}
            </span>
          </div>

          {/* Event title */}
          <h3 className="relative z-10 text-lg md:text-xl font-black text-white tracking-wide group-hover:tracking-wider transition-all duration-300">
            {event.title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}
