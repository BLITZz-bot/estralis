import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

const TEAM_MEMBERS = [
  {
    name: "M M BHARATH",
    role: "TECH HEAD & ARCHITECT",
    image: "/jj.jpeg", // Using jj.jpeg as a placeholder or the actual photo if intended
    bio: "Chief technology strategist and lead developer of the Estralis digital ecosystem."
  },
  {
    name: "CORE COMMANDER",
    role: "FESTIVAL PRESIDENT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    bio: "Overseeing the grand revival of the Estralis cultural legacy."
  },
  {
    name: "THE VISIONARY",
    role: "VICE PRESIDENT",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    bio: "Driving the creative vision and strategic planning for the symposium."
  }
];

export default function Team() {
  return (
    <motion.section
      id="team"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <SectionBackground
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
        alt="Team Background"
        activeOpacity="opacity-20"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="astral-eyebrow text-teal-500 block mb-4"
          >
            THE_ARCHITECTS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="astral-heading text-5xl md:text-7xl uppercase tracking-tighter"
          >
            CORE <span className="text-teal-400">COMMAND</span>
          </motion.h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative"
            >
              <div className="astral-glass p-1 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(45,212,191,0.2)] group-hover:border-teal-500/50">
                <div className="relative h-96 overflow-hidden rounded-[1.8rem]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 flex gap-2">
                     <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                     <div className="w-8 h-[1px] bg-teal-500/30 self-center" />
                  </div>
                </div>

                <div className="p-8 text-center relative">
                  <span className="text-[10px] font-black tracking-[0.3em] text-teal-400 uppercase mb-2 block font-astral">
                    {member.role}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-4">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-tech leading-relaxed px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Background Glow for Member */}
              <div className="absolute -inset-4 bg-teal-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="mt-20 pt-10 border-t border-white/5 text-center"
        >
           <p className="text-teal-400/30 text-[10px] font-black uppercase tracking-[0.5em] font-astral">
             Signals Integrity Confirmed // Command Access ONLY
           </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
