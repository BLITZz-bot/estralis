import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SectionBackground from "./SectionBackground"

const timelineData = {
  "MAY 12": [
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
  "MAY 13": [
    { time: "09:30 AM – 10:30 AM", title: "WESTERN GROUP",       type: "Cultural" },
    { time: "11:00 AM – 12:30 PM", title: "BATTLE OF BANDS",     type: "Cultural" },
    { time: "01:00 PM – 03:00 PM", title: "PRIZE DISTRIBUTION",  type: "Ceremony" },
    { time: "06:00 PM – 07:30 PM", title: "ARTIST PERFORMANCE",  type: "Cultural" },
    { time: "07:30 PM – 08:30 PM", title: "DJ NIGHT",            type: "Fun" },
  ],
}

export default function Timeline() {
  const [activeTab, setActiveTab] = useState(Object.keys(timelineData)[0])
  const events = timelineData[activeTab]

  return (
    <section id="timeline" className="relative py-24 md:py-32 overflow-hidden group">
      
      <SectionBackground 
        src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80" 
        alt="Chronological Track" 
      />

      <div className="relative z-10 px-6 max-w-7xl mx-auto">
        {/* Block Header */}
        <div className="flex flex-col mb-16 md:mb-24 text-center md:text-left">
         <span className="astral-eyebrow text-teal-500 mb-2 block">SEQUENCE LOG</span>
         <h2 className="saarang-banner-text text-5xl sm:text-6xl md:text-[6rem] lg:text-[8rem] text-teal-400 leading-[0.85] tracking-tighter">
            TIMELINE
         </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-20 relative z-10 border-b border-white/10 pb-6">
        {Object.keys(timelineData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-8 py-4 text-xs md:text-sm font-black tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? "bg-teal-500 text-black shadow-[0_0_30px_rgba(45,212,191,0.3)]" : "bg-black/50 text-teal-500/50 border border-teal-500/20 hover:text-teal-400 hover:border-teal-500/70 hover:bg-white/5"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Timeline Stream - Horizontal Track Style */}
      <div className="relative z-10 w-full mt-12 max-w-[100vw] overflow-hidden">
        
        {/* Continuous Horizontal Line */}
        <div className="absolute top-[46px] left-0 right-0 h-[2px] bg-teal-500/20 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="flex overflow-x-auto gap-8 pb-12 pt-4 px-6 md:px-12 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} /* Hide scrollbar for smooth visual */
          >
            {events.map((event, i) => (
              <TimelineNode key={i} event={event} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </section>
  )
}

function TimelineNode({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start group"
    >
       {/* Connection to line (Diamond) */}
       <div className="absolute top-[40px] left-[15px] w-3 h-3 bg-black border-2 border-teal-400 rotate-45 group-hover:bg-teal-400 transition-colors z-20 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />

       {/* Vertical drop line connecting diamond to card */}
       <div className="absolute left-[20px] top-[46px] h-10 w-[2px] bg-teal-500/20 group-hover:bg-teal-500/60 transition-colors z-10" />

       {/* Time above line */}
       <div className="mb-10 pl-4 h-[30px] flex items-center pr-2">
          <span className="font-mono text-teal-400 font-bold text-xs md:text-sm tracking-widest uppercase">
            &gt; {event.time.replace(" – ", " ")}
          </span>
       </div>

       {/* Content below line */}
       <div className="mt-8">
          <div className="saarang-block border-l-4 border-r border-y border-teal-500/20 border-l-teal-500 hover:border-teal-500 transition-colors duration-500 p-6 bg-black/40 backdrop-blur-sm h-full flex flex-col justify-between group-hover:bg-black/60 shadow-lg">
             <div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-3 block">
                   // PROTOCOL: {event.type}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase leading-tight group-hover:text-teal-300 transition-colors">
                   {event.title}
                </h3>
             </div>
             
             <div className="mt-6 pt-4 border-t border-teal-500/10">
                <p className="text-[9px] text-teal-500/40 font-mono tracking-[0.2em] group-hover:text-teal-400 text-left uppercase whitespace-nowrap">
                   STATUS: [AWAITING_CHRONO]
                </p>
             </div>
          </div>
       </div>
    </motion.div>
  )
}
