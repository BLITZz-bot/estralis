import { motion } from "framer-motion"
import SectionBackground from "./SectionBackground"

const TEAM_MEMBERS = [
  { name: "AKASH SHARMA", role: "ORGANIZER", image: "/akash.webp" },
  { name: "VYSHNAVI D", role: "ORGANIZER", image: "/vyshnavi.webp" },
  { name: "SHIVAPRASAD", role: "CO-ORGANIZER", image: "/shivu.webp" },
  { name: "DIVYA CHACHADI", role: "CO-ORGANIZER", image: "/divya.webp" },
  { name: "THANISHA", role: "FINANCE / SPONSORSHIP HEAD", image: "/thanisha.webp" },
  { name: "VINITH JOYAPPA", role: "FINANCE / SPONSORSHIP HEAD", image: "/vineeth.webp" },
  { name: "MALLIKARJUN GOUDA", role: "MARKETING HEAD", image: "/mallii.webp" },
  { name: "LIKITH D T", role: "MARKETING HEAD", image: "/likith.webp" },
  { name: "SURESH PATIL", role: "EVENT HEAD", image: "/suri.webp" },
  { name: "SHREYA B N", role: "EVENT HEAD", image: "/2.webp" },
  { name: "BHARGAV BHAT", role: "PRODUCTION HEAD", image: "/bharagv.webp" },
  { name: "SRINIVAS", role: "PRODUCTION HEAD", image: "/seena.png" }, // Failed conversion, keeping png
  { name: "AKHILA G", role: "DESIGN HEAD", image: "/akhila.webp" },
  { name: "Siri", role: "DESIGN HEAD", image: "/siri.webp" },
  { name: "M M BHARATH", role: "TECH HEAD", image: "/bharath.webp" },
  { name: "YESHWANTH", role: "TECH HEAD", image: "/yesh.webp" },
  { name: "HARSHITH", role: "ARTIST HEAD", image: "/har.webp" },
  { name: "CHAMPA", role: "ARTIST HEAD", image: "/champa.webp" },
  { name: "DHYAN", role: "HOSPITALITY HEAD", image: "/dhyan.webp" },
  { name: "V Vyshnavi", role: "HOSPITALITY HEAD", image: "/3.webp" },
  { name: "GANESH", role: "VOLUNTEER HEAD", image: "/ganesh.webp" },
  { name: "Rohith Y S", role: "VOLUNTEER HEAD", image: "/rohith.webp" },
];

export default function Team() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <motion.section
      id="team"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-24 md:py-40 px-6 overflow-hidden"
    >
      <SectionBackground
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
        alt="Team Background"
        activeOpacity="opacity-20"
      />

      <div className="relative max-w-7xl mx-auto">

        {/* ================= CENTERED HEADER ================= */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-[7px] md:text-[10px] font-black tracking-[1em] text-teal-500 uppercase font-astral mb-4 md:mb-6 block"
          >
            Core_Command_Matrix
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.5em" }}
            whileInView={{ opacity: 1, scale: 1, letterSpacing: "0.15em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="astral-heading text-3xl md:text-9xl uppercase font-black"
          >
            THE <span className="text-teal-400">TEAM</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "150px" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px md:h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent mx-auto mt-6 md:mt-8"
          />
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12" style={isMobile ? {} : { perspective: "2000px" }}>
          {TEAM_MEMBERS.map((member, idx) => (
            <TeamMemberCard key={member.name} member={member} idx={idx} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 pt-10 border-t border-white/5 text-center"
        >
          <p className="text-teal-400/30 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] font-astral">
            Signals Integrity Confirmed // Command Access ONLY
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}

function TeamMemberCard({ member, idx }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      initial={isMobile ? {
        opacity: 0,
        y: 40
      } : {
        opacity: 0,
        rotateX: -90,
        y: 100,
        z: -100
      }}
      whileInView={isMobile ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 1,
        rotateX: 0,
        y: 0,
        z: 0
      }}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
      transition={{
        type: isMobile ? "tween" : "spring",
        damping: 15,
        stiffness: 70,
        delay: isMobile ? 0 : idx * 0.05,
        duration: isMobile ? 0.4 : 0.8
      }}
      whileHover={isMobile ? {} : {
        scale: 1.05,
        y: -10,
        transition: { duration: 0.2 }
      }}
      className="group relative"
      style={isMobile ? {} : { transformStyle: "preserve-3d" }}
    >
      <div className={`p-1 rounded-2xl md:rounded-[2.5rem] overflow-hidden ${isMobile ? '' : 'transition-all duration-500 group-hover:border-teal-400/50 group-hover:shadow-[0_0_80px_rgba(45,212,191,0.3)]'} ${isMobile ? 'team-card-glass' : 'astral-glass bg-slate-950/40'}`}>
        <div className="relative h-40 md:h-64 overflow-hidden rounded-xl md:rounded-[2.2rem] m-1" style={isMobile ? {} : { transform: "translateZ(30px)" }}>
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover ${isMobile ? '' : 'transition-all duration-700'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-4 md:p-8 text-center pt-4 md:pt-6" style={isMobile ? {} : { transform: "translateZ(60px)" }}>
          <h3 className="text-xs md:text-lg font-black text-white tracking-widest uppercase mb-1">
            {member.name}
          </h3>
          <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-teal-400 uppercase font-astral block opacity-60 group-hover:opacity-100 transition-opacity">
            {member.role}
          </span>
          <div className="w-6 md:w-10 h-px bg-teal-500/10 mx-auto mt-4 md:mt-6 transition-all duration-700 group-hover:w-16 md:group-hover:w-24 group-hover:bg-teal-500" />
        </div>
      </div>
    </motion.div>
  )
}
