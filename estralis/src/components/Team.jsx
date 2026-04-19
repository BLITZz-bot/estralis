import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

const TEAM_MEMBERS = [
  {
    name: "M M BHARATH",
    role: "TECH HEAD",
    image: "/jj.jpeg", // Using existing photo
    bio: "Lead Architect of the Estralis Digital Ecosystem."
  },
  {
    name: "ABHISHEK R",
    role: "EVENT HEAD",
    image: "/special-guest.png", // Placeholder
    bio: "Strategic Coordinator for Festival Events."
  },
  {
    name: "DIVYASHREE R M",
    role: "EVENT HEAD",
    image: "/special-guest.png", // Placeholder
    bio: "Manager of Cultural and Event Operations."
  },
  {
    name: "BHARATH KUMAR S",
    role: "MANAGEMENT HEAD",
    image: "/special-guest.png", // Placeholder
    bio: "Chief of Management and Logistics."
  },
  {
    name: "VENU GOPAL",
    role: "MANAGEMENT HEAD",
    image: "/special-guest.png", // Placeholder
    bio: "Lead of Administrative Operations."
  },
  {
    name: "SOHAN S P",
    role: "CREATIVE HEAD",
    image: "/special-guest.png", // Placeholder
    bio: "Creative Director and Visual Strategist."
  },
  {
    name: "PRAVEEN KUMAR S",
    role: "CREATIVE HEAD",
    image: "/special-guest.png", // Placeholder
    bio: "Chief of Visual Arts and Design."
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
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: idx * 0.1,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="astral-glass p-1 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-teal-400/50 group-hover:shadow-[0_0_40px_rgba(45,212,191,0.3)]">
                <div className="relative h-72 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-50 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating Role Badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                     <span className="text-[9px] font-black tracking-[0.2em] text-teal-400 uppercase bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-500/30 font-astral block text-center">
                       {member.role}
                     </span>
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-lg font-black text-white tracking-widest uppercase mb-1">
                    {member.name}
                  </h3>
                  <div className="w-10 h-0.5 bg-teal-500/30 mx-auto transition-all duration-500 group-hover:w-20 group-hover:bg-teal-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
