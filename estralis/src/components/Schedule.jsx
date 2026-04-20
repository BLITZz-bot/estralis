import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
// import StarBackground from "./StarBackground"
import RegistrationForm from "./RegistrationForm"
import SectionBackground from "./SectionBackground"

const IconPhone = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconMapPin = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconTrophy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)


export const eventsDay1 = [
  {
    time: "12:00 PM",
    title: "CLASSICAL GROUP",
    location: "Amphitheatre",
    description: "A graceful group dance event that celebrates traditional dance forms and cultural storytelling. Teams perform synchronized routines with expressive gestures, rhythm, and elegance, reflecting the richness of classical art forms.",
    category: "Dance",
    prize: "₹30,000",
    minTeamSize: 2,
    maxTeamSize: 15,
    rules: [" Each team will be allotted a performance time of 8+2 minutes. Exceeding the time limit may result in penalties.",
      " Only Indian classical dance forms such as Bharatanatyam, Kathak, Kuchipudi, Mohiniyattam, Odissi, etc., are permitted. Fusion with non-classical styles is not allowed.",
      " Performances must be appropriate and respectful. Any vulgar or offensive content will lead to disqualification.",
      "  Teams must submit their music track in advance in the specified format. No changes will be allowed on the spot.",
      " Use of props is allowed, but participants must manage them without causing delays or hazards.",
      " All teams must report to the venue at least 30 minutes prior to their scheduled time.",
      " Judging based on expressions (Abhinaya), technique, and grace.",
      " Carry your college ID cards.",
    ],
    coordinators: ["Arsha – 9538622342",],
    registerLink: "#",
    fee: "₹1,500",
  },
  {
    time: "10:00 AM",
    title: "REELS MAKING",
    location: "Online",
    description: "A digital creativity challenge where participants create short, engaging videos. From concept and shooting to editing and storytelling, this event tests creativity, trend awareness, and presentation skills.",
    category: "Fun",
    prize: "₹9,000",
    minTeamSize: 2,
    maxTeamSize: 3,
    rules: [
      "Duration: 30–60 seconds | Vertical video format mandatory | Individual or team (max 3 members)",
      "Content must be original | No copyright violations allowed.",
      "Judging based on creativity, engagement, editing & presentation.",
      "Participants get 24 hours to shoot & create the reel | Must be fully edited before submission.",
      "Reel must be submitted before deadline | Late submissions will not be accepted.",
      "Carry your college ID cards."
    ],
    coordinators: ["Rupa – 9741095149"],
    registerLink: "#",
    fee: "₹500"
  },
  {
    time: "11:00 AM",
    title: "TREASURE HUNT",
    location: "GCEM Campus",
    description: "An adventurous team-based game where participants solve clues and complete challenges to find the final treasure. It encourages logical thinking, teamwork, and quick decision-making under time pressure.",
    category: "Fun",
    prize: "₹10,000",
    // comboPass: "₹450 (HIGHLIGHT REEL + SHOT CUT)",
    minTeamSize: 5,
    maxTeamSize: 5,
    rules: ["Each team must consist of exactly 5.",
      "All clues must be solved and followed in the given sequence.",
      "Skipping clues is not allowed and will lead to disqualification.",
      "Use of unfair means or malpractice will result in immediate disqualification ,Mobile phones or external help are strictly prohibited unless permitted by organizers.",
      "The team completing all clues in the shortest time wins.",
      "The decision of the organizers/judges will be final and binding.",
      "All teams must report to the venue at least 30 minutes prior to their scheduled time.",
      "Carry your college ID cards.  "
    ],
    coordinators: ["Ujwala Gowda – 8197388105", "Vishaka – 8431217851"],
    registerLink: "#",
    fee: "₹500",
  },
  {
    time: "11:00 AM",
    title: "FACE PAINTING",
    location: "Amphitheatre",
    description: "An artistic event where participants transform faces into creative masterpieces using colors and imagination. Attention to detail, neatness, and originality are essential as artists bring their ideas to life.",
    category: "Fun",
    prize: "₹3,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: [
       "Time limit: 60 minutes.",
       "The theme will be announced in prior(theme by the coordinator).",
       "Participants must bring their own materials.",
       "Only one model per participant.",
       "Judging based on creativity and neatness.",
       "No pre-drawn designs allowed",
       "The decision of the judges will be final and binding.",
       "Carry your college ID cards.",
    ],
    coordinators: ["Pranitha - 9845649134"],
    registerLink: "#",
    fee: "₹200",
  },
  {
    time: "11:00 AM",
    title: "FITNESS CHALLENGE",
    location: "Open Amphitheatre",
    description: "A test of strength and endurance featuring push-up and plank challenges. Participants compete against time to push their physical limits, showcasing stamina, discipline, and determination.",
    category: "Sports",
    prize: "₹11,000",
    minTeamSize: 4,
    maxTeamSize: 4,
    rules: [
      "The event consists of two rounds: Push-Up Challenge and Plank Challenge",
      "Participants can take part in one or both rounds",
      "Time limit for each round: 2 minutes",
      "Maximum number of push-ups in 2 minutes will be counted",
      "Only proper form push-ups will be considered",
      "Arms must be fully extended and chest close to the ground",
      "Knees touching the ground will end the attempt",
      "Participants are requested to bring their own mat (if required)",
      "Any misconduct or unfair means will lead to disqualification",
    ],
    coordinators: ["Dheeraj – 9686508926"],
    registerLink: "#",
    fee: "₹500",
  },
  {
    time: "11:00 AM",
    title: "FITNESS CHALLENGE",
    location: "Open Amphitheatre",
    description: "A test of strength and endurance featuring push-up and plank challenges. Participants compete against time to push their physical limits, showcasing stamina, discipline, and determination.",
    category: "Sports",
    prize: "₹11,000",
    minTeamSize: 4,
    maxTeamSize: 4,
    rules: [
     "The event consists of two rounds: Push-Up Challenge and Plank Challenge",
     "Participants can take part in one or both rounds",
     "Time limit for each round: 2 minutes",
     "Participants must hold plank position for a maximum of 2 minutes",
     "Elbows should be directly under shoulders Participants are requested to bring their own mat (if required)",
     "Any misconduct or unfair means will lead to disqualification",
     "Judges' decision will be final",
     "Participants must report to the venue at least 30 minutes prior to their scheduled time.",
    ],
    coordinators: ["Rittkriti – 8618080973"],
    registerLink: "#",
    fee: "₹500",
  },
  // {
  //   time: "11:00 AM",
  //   title: "FACE PAINTING",
  //   location: "LAB 5, Ground Floor, GCEM Campus",
  //   description: "An artistic challenge where participants showcase their creativity by painting vibrant and imaginative designs on the face. Focus on detail, color coordination, and originality.",
  //   category: "Art",
  //   prize: "₹6,000",
  //   minTeamSize: 1,
  //   maxTeamSize: 1,
  //   rules: ["1. Participants must be currently enrolled in their college.",
  //     "2.  Participants must bring a valid college ID card.",
  //     "3.  Participants must bring their laptops with all necessary software pre-installed",
  //     "4.  Computers will be provided to participants who are not able to bring their laptops(only limited computers available). ",
  //     "5.  Internet access will be provided at the venue.",
  //     "6.  The theme of the poster will be announced at the start of the competition.",
  //     "7.  Specific instructions will be provided before the start of the event. ",
  //     "8.  Please check the schedule for overlapping events before registering for multiple events.",
  //     "9.  If you have registered for overlapping events, MANAGEMENT is not responsible, no refund will be initiated.10. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
  //     "11. Report to the coordinator 30 minutes before the event starts.",
  //     "12. Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",


  //   ],
  //   coordinators: ["Nithelan Jayakumar – 8904572607", "Bushra M – 8310084375"],
  //   registerLink: "#",
  //   fee: "₹200",
  // },
  {
    time: "11:30 PM",
    title: "BEAT BOXING",
    location: "Amphitheatre",
    description: "A high-energy vocal percussion battle where participants create beats, rhythms, and musical effects using only their voice. This event challenges creativity, breath control, and rhythm sense as performers showcase unique sound patterns and freestyle skills. Stage presence and crowd engagement play a key role in standing out.",
    category: "Fun",
    prize: "₹8,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["Only vocal sounds are permitted. The use of musical instruments or external devices is strictly prohibited.",
            "Performances must be appropriate and respectful. Any form of offensive, vulgar, or inappropriate content will lead to disqualification.",
            "This is a solo performance event; group participation is not allowed.",
            "Judging will be based on rhythm, creativity, originality, stage presence, and clarity.",
            "Participants must report to the venue at least 30 minutes prior to their scheduled time.",
            "Judges' decision will be final.",
            "Participants are advised to check the event schedule before registering for multiple events. No refunds will be provided for scheduling conflicts.",
            "Please carry ID card"
    ],
    coordinators: ["Manoj – 7760396379"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    time: "10:30 AM",
    title: "WESTERN SOLO",
    location: "Amphitheatre",
    description: "An individual dance competition focusing on western styles such as hip-hop, contemporary, jazz, or freestyle. Participants must showcase technique, expression, and strong stage presence while delivering a powerful and engaging solo performance.",
    category: "Dance",
    prize: "₹8,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: [" Each participant will be allotted a performance time of 4+1 minutes. Exceeding the time limit may result in penalties.",
            " Only Western dance styles such as Hip-Hop, Freestyle, Contemporary, Jazz, etc., are permitted.",
            " Participant must submit their music track in advance in the specified format. No changes will be allowed on the spot.",
            " Use of dangerous or hazardous props (such as fire, glass, sharp objects, etc.) is strictly prohibited.",
            " Performances must be appropriate and respectful. Any vulgar or offensive content will lead to disqualification.",
            " Participants must report to the venue at least 30 minutes prior to their scheduled time.",
            " Carry your college ID cards.",
            "",],
    coordinators: ["Akhila - 8073557585"],
    registerLink: "#",
    fee: "₹500",
    // theme: "OPEN THEME"
  },
  {
    time: "12:00 PM",
    title: "BGMI",
    location: "6th floor Seminar hall",
    description: "A competitive gaming event where players battle in BGMI matches to prove their strategy and survival skills. Team coordination, quick reflexes, and tactical gameplay are essential to secure victory.",
    category: "Gaming",
    prize: "₹15,000",
    minTeamSize: 5,
    maxTeamSize: 5,
    rules: [
      "Toumament consists of 4 matches",
      "Maps will be selected randomly",
      "All required maps must be downloaded beforehand",
      "Teams must join the room on time (5-minute grace allowed)",
      "No rematches for late entry or absence",
      "Fair Play:",
      "Cheating, hacking, teaming, or use of third-party tools = disqualification",
      "Account sharing is strictly prohibited",
      "Participants are responsible for their own devices",
      "No refunds for schedule clashes",
      "Organizers decision will be final and binding",
      "Points System:",
      `Placement Points:
      1st - 10 pts
      2nd - 6 pts
      3rd - 5 pts
      4th - 4 pts
      5th - 3 pts
      6th - 2 pts
      7th-8th - 1 pt
      9th-16th-0pts
      Each kill = +1 point`,
      "Points will be calculated across all matches Network Rules:",
      "WiFi may be provided; players are advised to keep mobile data backup",
      "No rematches for lag, disconnection, or network issues ",

      ],
    coordinators: ["Kishore - 9742726867", "Hari Kumar - 6362965600", "Anas Ansari - 9008892112"],
    registerLink: "#",
    fee: "₹1000",
    // theme: "OPEN THEME"
  },
]

export const eventsDay2 = [
  {
    time: "09:30 AM",
    title: "WESTERN GROUP",
    location: "Amphitheatre",
    description: "A dynamic group dance competition where teams perform energetic western routines. Coordination, formations, creativity, and synchronization are key as groups deliver impactful and entertaining performances.",
    category: "Dance",
    prize: "₹30,000",
    minTeamSize: 8,
    maxTeamSize: 15,
    rules: [ 
          "Team size: 6-12 members | Time limit: 5-10 minutes (including entry & exit) | Only western dance styles allowed",
          "Music must be appropriate (non-offensive) and submitted in advance as per instructions",
          "Dangerous props, fire, or risky stunts are strictly prohibited | Teams must be ready before their slot",
          "Exceeding time limit may lead to penalty or disqualification | Any damage to stage/property is team's responsibility",
          "Judging criteria: Synchronization & coordination, choreography & creativity, energy & expressions",
          "Teams must report on time for registration and sound check | Carry college ID cards | Judges' decision is final and binding",
    ],
    coordinators: ["Siya - 9886483177"],
    registerLink: "#",
    fee: "₹2,500"
  },
  {
    time: "11:00 AM",
    title: "BATTLE OF BANDS",
    location: "Amphitheatre",
    description: "A thrilling live music competition where bands perform to showcase their musical talent and coordination. Whether it’s original compositions or covers, bands are judged on rhythm, harmony, stage presence, and connection with the audience.",
    category: "Fun",
    prize: "₹30,000",
    minTeamSize: 3,
    maxTeamSize: 8,
    rules: ["Type: Team | Team size: 3–8",
            "All genres allowed (rock, fusion, indie, etc.) | Live performance only (no lip-sync)",
            "Time limit: 10–15 min (including setup) | Exceeding time = penalty",
            "Original composition encouraged | No explicit or inappropriate content",
            "Equipment: Basic sound provided | Bring your own instruments | Inform in advance for special requirements",
            "Judging: Musicality & coordination | Stage presence & energy | Creativity & originality | Audience engagement",
    ],
    coordinators: ["Charan Kumar – 9019142436"],
    registerLink: "#",
    fee: "₹2,500"
  },
  {
    time: "01:00 PM",
    title: "FASHION SHOW",
    location: "Amphitheatre",
    description: "A visually captivating runway event where teams present a predefined theme through style, choreography, and attitude. From costume design to expressions, every element contributes to storytelling on stage. It’s a perfect blend of fashion, creativity, and confidence.",
    category: "Fashion",
    prize: "₹45,000",
    minTeamSize: 8,
    maxTeamSize: 15,
    rules: ["Each team must follow a predefined theme",
            "Team size: 6-12 members",
            "Time limit: 8-12 minutes",
            "Music must be submitted before the event",
            "No dangerous props or fire elements allowed",
            "Judging based on coordination, creativity, and confidence",
            "Participants must perform as a team",
            "No offensive or vulgar content",
            "Judges' decision will be final",
            "All teams must report to the venue at least 30 minutes prior to their scheduled time",
    ],
    coordinators: ["Raksha M – 8867555612"],
    registerLink: "#",
    fee: "₹3,000",
  },

  // {
  //   time: "06:00 PM",
  //   title: "ARTIST PERFORMANCE AND DJ NIGHT",
  //   location: "Main stage, GCEM Campus",
  //   description: "Step into the spotlight and let your passion ignite the stage, where every move tells a story and every rhythm captivates the soul. Witness an electrifying showcase of talent, energy, and grace, as dancers compete to turn dreams into motion.",
  //   category: "Fun",
  //   prize: "₹300",
  //   minTeamSize: 2,
  //   maxTeamSize: 15,
  //   rules: ["*Duration: 6-8 minutes per team for their performance*",
  //     "All participants should arrive at the venue 1 hour prior to the event.",
  //     "1. Music",
  //     "• Teams must submit their music tracks in MP3 format via Google Drive/email by 07/03/2026.",
  //     "• File name format: College/Group Name.mp3",
  //     "• Backup copies of music tracks should be brought on USB drive.",
  //     "• Music should be appropriate and not contain any explicit content.",
  //     ".",
  //     "2. Choreography",
  //     "• All dance forms are allowed (Classical, Hip-hop, Semi-classical, Folk,Contemporary).",
  //     "• Choreography should be original or legally permissible.",
  //     ".",
  //     "3. Costumes",
  //     "• Costumes should be appropriate and respectful of cultural sensitivities.",
  //     "• Any form of obscenity will result in disqualification.",
  //     ".",
  //     "4. Props",
  //     "• Props are allowed but must be handled by participants themselves.",
  //     "• Dangerous/Problematic props (fire, sharp objects,powders etc) are prohibited.",
  //     ".",
  //     // "• There will be 2 prizes if more than 8 registrations; otherwise, only 1 prize",
  //     "5. Note",
  //     "• Please check the schedule for overlapping events before registering multiple events",
  //     "• If registered for overlapping events, MANAGEMENT is not responsible and no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
  //     "• Arrive at the venue and report to the coordinators 1 hour before the event starts",
  //     ".",
  //     "CODE OF CONDUCT",
  //     "• Participants are expected to maintain decorum and sportsmanship.",
  //     "• Any form of misbehavior or disrespect towards organizers, judges, or fellow will lead to disqualification.",
  //     "• Vulgar language, inappropriate gestures, and offensive content are strictly prohibited.",
  //     "• If technical issues occur, participants may be allowed to restart (subject to judges approval).",
  //     "• The decision of the judges is final and binding.",
  //     "• Performances are judged based on choreography, synchronization,expression, creativity, and overall impact.",
  //     ".",
  //     "SAFETY",
  //     "•Participants should ensure their performance is safe and does not pose any risk to themselves or the audience",
  //     "13.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",

  //   ],
  //   coordinators: ["Divyashree RM – 7019691887", "Abhishek R - 7019323085"],
  //   registerLink: "#",
  //   fee: "₹700",
  // },

]

function getCategoryStyles(category) {
  switch (category) {
    case "Tech":
      return "bg-blue-500/20 border-blue-400/30 text-blue-200"
    case "Fun":
      return "bg-red-500/20 border-red-400/30 text-red-200"
    case "Workshop":
      return "bg-green-500/20 border-green-400/30 text-green-200"
    default:
      return "bg-purple-500/20 border-purple-400/30 text-purple-200"
  }
}

/* 🔹 STAGGER CHILD VARIANTS */
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0 },
}

function EventCard({ title, fee, category, onClick, isOpen, t }) {
  const theme = t || { text: "text-teal-400", hoverText: "group-hover:text-teal-400", bg: "bg-teal-500", hoverBg: "hover:bg-teal-500/10", borderL: "border-l-teal-500", bgSoft: "bg-teal-500/10" };

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className={`relative group cursor-pointer astral-glass border-l-4 p-8 h-full flex flex-col justify-between transition-all duration-500 ${theme.borderL} ${theme.hoverBg} hover:border-l-white`}
    >
      {/* Blocky Price Tag (Saarang Style) */}
      <div className={`absolute top-0 right-0 text-black px-4 py-1.5 font-black text-xs tracking-widest uppercase transition-colors duration-500 rounded-tr-[1.5rem] rounded-bl-2xl ${theme.bg}`}>
        {fee || "FREE"}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`} />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
            {isOpen ? 'Incoming Signal' : 'Transmission Offline'}
          </span>
        </div>

        <h3 className={`text-xl sm:text-2xl font-black text-white mb-4 leading-tight transition-colors uppercase tracking-tight break-words overflow-hidden ${theme.hoverText}`}>
          {title}
        </h3>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${theme.text}`}>
          Access Protocol {" >>>"}
        </span>
        <svg className={`w-5 h-5 transition-transform group-hover:translate-x-2 ${theme.text}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
        </svg>
      </div>
    </motion.div>
  )
}

function CategoryZone({ title, subtitle, events, onEventClick, eventStatuses, bgImage, themeObj }) {
  const t = themeObj || { text: "text-teal-400", hoverText: "group-hover:text-teal-400", borderB: "border-b-teal-500/10", bg: "bg-teal-500", hoverBg: "hover:bg-teal-500/10", borderL: "border-l-teal-500", bgSoft: "bg-teal-500/10" };

  return (
    <div className={`relative w-full py-32 border-b ${t.borderB} group overflow-hidden`}>
      <SectionBackground
        src={bgImage}
        alt="Zone Background"
      />

      <div className="max-w-[1700px] mx-auto px-4 md:px-6 relative z-10 flex flex-col xl:grid xl:grid-cols-[1fr_3fr] gap-4 md:gap-16 items-start">
        {/* Massive Category Title (Saarang Style) */}
        <div className="flex flex-row xl:flex-col items-center xl:items-start text-center xl:text-left sticky top-24 pr-2 md:pr-0 w-full xl:w-auto mb-10 xl:mb-0 flex-nowrap gap-4 justify-center xl:justify-start">
          <motion.h2
            initial={{ opacity: 0.3, filter: "brightness(0.5) blur(2px)" }}
            whileInView={{
              opacity: 1,
              filter: "brightness(1.5) blur(0px)",
              textShadow: ["0 0 0px rgba(45,212,191,0)", "0 0 20px rgba(45,212,191,0.5)", "0 0 0px rgba(45,212,191,0)"]
            }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className={`saarang-banner-text text-[8vw] xl:text-[10vw] text-white/50 leading-[0.85] mb-0 xl:mb-4 ${t.hoverText} transition-colors duration-700 text-center flex flex-row xl:flex-col gap-1 xl:gap-1.5 justify-center xl:justify-start`}
          >
            {title.split("").map((char, i) => (
              <span key={i} className="xl:block">{char}</span>
            ))}
          </motion.h2>
          <div className="saarang-block mt-0 xl:mt-8 ml-0 xl:ml-0">
            <p className={`saarang-serif italic text-[10px] md:text-xl lg:text-2xl ${t.text}`}>{subtitle}</p>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-12 xl:mt-0 w-full">
          {events.map((e, i) => (
            <EventCard
              key={i}
              {...e}
              t={t}
              isOpen={eventStatuses.find(s => s.title === e.title)?.isOpen ?? true}
              onClick={() => onEventClick(e)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function getThemeForCategory(category) {
  const normalized = category?.toLowerCase();
  
  if (["cultural", "dance", "fashion"].includes(normalized)) {
    return { 
      text: "text-cyan-400", 
      hoverText: "group-hover:text-cyan-400", 
      borderB: "border-b-cyan-500/10", 
      bg: "bg-cyan-500", 
      hoverBg: "hover:bg-cyan-500/10", 
      borderL: "border-l-cyan-500", 
      bgSoft: "bg-cyan-500/10",
      accent: "cyan-500" 
    };
  }
  
  if (["fun"].includes(normalized)) {
    return { 
      text: "text-fuchsia-400", 
      hoverText: "group-hover:text-fuchsia-400", 
      borderB: "border-b-fuchsia-500/10", 
      bg: "bg-fuchsia-500", 
      hoverBg: "hover:bg-fuchsia-500/10", 
      borderL: "border-l-fuchsia-500", 
      bgSoft: "bg-fuchsia-500/10",
      accent: "fuchsia-500"
    };
  }
  
  if (["gaming", "tech", "sports"].includes(normalized)) {
    return { 
      text: "text-blue-400", 
      hoverText: "group-hover:text-blue-400", 
      borderB: "border-b-blue-500/10", 
      bg: "bg-blue-500", 
      hoverBg: "hover:bg-blue-500/10", 
      borderL: "border-l-blue-500", 
      bgSoft: "bg-blue-500/10",
      accent: "blue-500"
    };
  }

  // Default Teal
  return { 
    text: "text-teal-400", 
    hoverText: "group-hover:text-teal-400", 
    borderB: "border-b-teal-500/10", 
    bg: "bg-teal-500", 
    hoverBg: "hover:bg-teal-500/10", 
    borderL: "border-l-teal-500", 
    bgSoft: "bg-teal-500/10",
    accent: "teal-500" 
  };
}

export function EventModal({ event, isEventOpen, onClose, onRegister, overrideTheme }) {
  const [activeTab, setActiveTab] = useState("about")
  const [slotInfo, setSlotInfo] = useState(null);

  useEffect(() => {
    // Only fetch for limited events (DJ Night)
    if (event?.title?.toUpperCase().includes("DJ NIGHT")) {
      const fetchSlots = async () => {
        try {
          const normalizedTitle = event.title.trim().toUpperCase();
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/slots-status?eventTitle=${encodeURIComponent(normalizedTitle)}`);
          const data = await res.json();
          if (data.success && data.isLimited) {
            setSlotInfo(data);
          }
        } catch (err) {
          console.error("Slot fetch err:", err);
        }
      };
      fetchSlots();
    }
  }, [event?.title]);
  
  const theme = overrideTheme || getThemeForCategory(event?.category);
  const accentHex = theme.accent === "cyan-500" ? "rgba(6,182,212,0.5)" : 
                    theme.accent === "fuchsia-500" ? "rgba(217,70,239,0.5)" : 
                    theme.accent === "blue-500" ? "rgba(59,130,246,0.5)" : 
                    "rgba(45,212,191,0.5)";

  useEffect(() => {
    setActiveTab("about");
  }, [event]);

  if (!event) return null

  const cat = event.category || "Tech"
  const teamText = event.minTeamSize === event.maxTeamSize
    ? `${event.minTeamSize}`
    : `${event.minTeamSize || "?"} – ${event.maxTeamSize || "?"}`

  const tabs = [
    { id: "about", label: "INFO" },
    { id: "rules", label: "RULES" },
    { id: "coordinators", label: "CONTACT" },
  ]

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#020617]/90 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl astral-glass flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header Section */}
          <div className="relative p-8 sm:p-12 border-b border-white/5">
            <button
              onClick={onClose}
              className="absolute top-6 right-8 text-white/20 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>

            <div className="space-y-4">
              <span className={`astral-eyebrow ${theme.text} uppercase`}>
                {cat} SECTOR
              </span>
              <h3 
                className="text-xl sm:text-2xl font-black leading-[1.1] uppercase tracking-tighter astral-heading max-w-2xl"
                style={{ 
                  backgroundImage: `linear-gradient(to bottom, ${accentHex.replace('0.5', '1')}, ${accentHex.replace('0.5', '0.8')})`,
                  filter: `drop-shadow(0 0 20px ${accentHex})`,
                  WebkitTextStroke: `1px ${accentHex.replace('0.5', '0.2')}`
                }}
              >
                {event.title}
              </h3>

              <div className="flex flex-wrap gap-6 pt-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.bg} animate-pulse`} />
                    <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase font-tech">SQUAD SIZE: {teamText}</span>
                  </div>
                  {slotInfo && (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                      <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-1.5 h-1.5 rounded-full ${(slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0) ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : (slotInfo.slotsLeft > 20 ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]')}`} 
                      />
                      <span className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase font-astral ${(slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0) ? 'text-red-500' : (slotInfo.slotsLeft > 20 ? 'text-teal-400' : 'text-red-500')}`}>
                        {slotInfo.isManualOpen === false ? 'REGISTRATION CLOSED' : (slotInfo.slotsLeft <= 0 ? 'SOLD OUT' : `${slotInfo.slotsLeft} SLOTS REMAINING`)}
                      </span>
                    </div>
                  )}
                </div>
                {event.theme && (
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.bgSoft}`} />
                    <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase font-tech">THEME: {event.theme}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Control */}
          <div className="flex bg-black/20 border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-5 text-[10px] font-black tracking-[0.4em] relative transition-all duration-300 font-astral ${activeTab === tab.id ? "text-white" : "text-white/20 hover:text-white/40"
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme.bg} shadow-[0_0_10px_${accentHex}]`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-full"
              >
                {activeTab === "about" && (
                  <div className="space-y-12">
                    <p className={`saarang-serif text-white/80 text-xl leading-relaxed italic border-l-4 ${theme.borderL} opacity-30 pl-8`}>
                      "{event.description}"
                    </p>

                    <div className={`grid grid-cols-1 ${event.prize ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-6`}>
                      <div 
                        className="p-8 astral-glass-bright flex flex-col items-center text-center group transition-all"
                        style={{ borderColor: `rgba(${accentHex.match(/\d+, \d+, \d+/)}, 0.2)` }}
                      >
                        <span className={`text-[9px] font-black ${theme.text} uppercase tracking-widest mb-3 font-astral`}>Reg Fees</span>
                        <span className={`text-2xl font-black ${theme.text} italic font-astral`}>{event.fee}</span>
                      </div>
                      <div 
                        className="p-8 astral-glass-bright flex flex-col items-center text-center group transition-all"
                        style={{ borderColor: `rgba(${accentHex.match(/\d+, \d+, \d+/)}, 0.2)` }}
                      >
                        <span className={`text-[9px] font-black ${theme.text} uppercase tracking-widest mb-3 font-astral`}>Location</span>
                        <span className="text-base font-bold text-white uppercase italic font-tech text-center">@{event.location}</span>
                      </div>
                      {event.prize && (
                        <div 
                          className="p-8 astral-glass-bright flex flex-col items-center text-center group transition-all"
                          style={{ borderColor: `rgba(${accentHex.match(/\d+, \d+, \d+/)}, 0.2)` }}
                        >
                          <span className={`text-[9px] font-black ${theme.text} uppercase tracking-widest mb-3 font-astral`}>Prizes</span>
                          <span className={`text-xl font-black ${theme.text} italic font-astral`}>{event.prize}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 flex justify-center">
                      <button
                        onClick={() => setActiveTab("rules")}
                        className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all font-astral"
                      >
                        READ RULES & PROTOCOL →
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "rules" && (
                  <div className="space-y-10">
                    <div className="grid gap-4">
                      {event.rules.map((rule, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-start gap-6 p-6 astral-glass-bright border-transparent hover:border-${theme.accent}/20 transition-all group`}
                        >
                          <span className={`text-sm font-black ${theme.text} opacity-40 font-astral mt-1`}>
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <p className="text-sm text-white/70 leading-relaxed font-medium font-tech whitespace-pre-line">
                            {rule.trim()}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {isEventOpen && (
                      <div className="pt-8 flex flex-col items-center gap-4">
                        <div className={`flex items-center gap-3 ${theme.text} opacity-50 mb-2`}>
                          <div className={`w-12 h-[1px] ${theme.bgSoft}`} />
                          <span className="text-[9px] font-black tracking-widest uppercase font-astral">Protocol Complete</span>
                          <div className={`w-12 h-[1px] ${theme.bgSoft}`} />
                        </div>
                        <button
                          disabled={slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0)}
                          onClick={() => onRegister(event)}
                          className={`w-full max-w-md py-6 ${
                            slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0) 
                            ? 'bg-red-600 cursor-not-allowed shadow-none hover:bg-red-600 text-white' 
                            : theme.bg
                          } text-black text-[12px] font-black tracking-[0.4em] uppercase rounded-2xl hover:bg-white transition-all shadow-[0_0_40px_${accentHex}] font-astral`}
                        >
                          {slotInfo && slotInfo.isManualOpen === false ? 'REGISTRATION CLOSED' : (slotInfo && slotInfo.slotsLeft <= 0 ? 'SOLD OUT' : 'PROCEED_TO_REGISTRY')}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "coordinators" && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {event.coordinators.map((c, i) => {
                        // More robust splitting that handles different hyphen types and spaces
                        const parts = c.split(/ [–-] |-| – /);
                        const name = parts[0]?.trim();
                        const phone = parts[1]?.trim();

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 astral-glass-bright flex items-center justify-between group"
                          >
                            <div>
                              <p className="text-white font-black tracking-widest uppercase text-xl font-astral">{name}</p>
                              <p className={`text-[9px] font-black ${theme.text} opacity-50 tracking-widest uppercase font-astral mt-1`}>Coordinator Access</p>
                            </div>
                            <div className="text-right">
                              <a 
                                href={`tel:${phone}`}
                                className={`${theme.text} font-bold font-tech text-xl hover:brightness-150 transition-all block`}
                              >
                                {phone}
                              </a>
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest font-tech">Secure Line</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default function Schedule({ onModalToggle }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [eventStatuses, setEventStatuses] = useState([])

  // Notify parent of modal state
  useEffect(() => {
    onModalToggle && onModalToggle(!!selectedEvent || showRegistration);
  }, [selectedEvent, showRegistration, onModalToggle]);

  // Consolidated history handling for event details and registration form
  useEffect(() => {
    if (selectedEvent) {
      const currentState = window.history.state;

      if (showRegistration) {
        if (!currentState || currentState.modal !== "registration") {
          window.history.pushState({ modal: "registration" }, "");
        }
      } else {
        if (!currentState || (currentState.modal !== "event" && currentState.modal !== "registration")) {
          window.history.pushState({ modal: "event" }, "");
        }
      }

      const handlePopState = (e) => {
        if (!e.state) {
          setSelectedEvent(null);
          setShowRegistration(false);
        } else if (e.state.modal === "event") {
          setShowRegistration(false);
        } else if (e.state.modal === "registration") {
          setShowRegistration(true);
        } else {
          setSelectedEvent(null);
          setShowRegistration(false);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
        // Cleanup: pushState is handled by the effect, so we don't need manual back() here
        // as popstate will handle the UI state correctly.
      };
    } else {
      if (showRegistration) setShowRegistration(false);
    }
  }, [selectedEvent, showRegistration]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/status?t=${Date.now()}`);
        const data = await res.json();
        if (data.success) {
          // Map snake_case is_open to camelCase isOpen for frontend consistency
          const mapped = data.data.map(item => ({
            ...item,
            isOpen: item.is_open
          }));
          setEventStatuses(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch event statuses", err);
      }
    };
    fetchStatuses();

    const handleStatusChange = (e) => {
      if (e.detail) {
        setEventStatuses(prev => {
          const next = [...prev];
          const idx = next.findIndex(s => s.title === e.detail.eventTitle);
          if (idx >= 0) {
            next[idx].isOpen = e.detail.isOpen;
          } else {
            next.push({ title: e.detail.eventTitle, isOpen: e.detail.isOpen });
          }
          return next;
        });
      }
      fetchStatuses(); // Background sync
    };

    // Auto-refresh statuses every 30 seconds and listen for instant admin triggers
    const interval = setInterval(fetchStatuses, 30000);
    window.addEventListener('eventStatusChanged', handleStatusChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('eventStatusChanged', handleStatusChange);
    };
  }, []);

  const applyFilter = (events) => {
    return events.filter((e) => {
      const matchCategory = filter === "All" || e.category === filter
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }

  return (
    <>
      <section id="events" className="min-h-screen pt-32">
        <div className="px-6 mb-20 text-center">
          <h2 className="astral-heading text-6xl md:text-8xl lg:text-9xl mb-4">Event Zones</h2>
          <p className="saarang-serif italic text-white/30 text-xl lg:text-2xl">Discover the Interstellar Spectrum</p>
        </div>

        {/* Zone 1: Cultural */}
        <CategoryZone
          title="MOTION"
          subtitle="Dance, Fashion & Flow"
          events={[...eventsDay1, ...eventsDay2].filter(e => ["Cultural", "Dance", "Fashion"].includes(e.category))}
          onEventClick={setSelectedEvent}
          eventStatuses={eventStatuses}
          bgImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80"
          themeObj={{ text: "text-cyan-400", hoverText: "group-hover:text-cyan-400", borderB: "border-b-cyan-500/10", bg: "bg-cyan-500", hoverBg: "hover:bg-cyan-500/10", borderL: "border-l-cyan-500", bgSoft: "bg-cyan-500/10" }}
        />

        {/* Zone 2: Fun/Interactive */}
        <CategoryZone
          title="VIBE"
          subtitle="Fun & Interactive Signals"
          events={[...eventsDay1, ...eventsDay2].filter(e => e.category === "Fun")}
          onEventClick={setSelectedEvent}
          eventStatuses={eventStatuses}
          bgImage="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80"
          themeObj={{ text: "text-fuchsia-400", hoverText: "group-hover:text-fuchsia-400", borderB: "border-b-fuchsia-500/10", bg: "bg-fuchsia-500", hoverBg: "hover:bg-fuchsia-500/10", borderL: "border-l-fuchsia-500", bgSoft: "bg-fuchsia-500/10" }}
        />

        {/* Zone 3: Gaming/Tech */}
        <CategoryZone
          title="LOGIC"
          subtitle="Gaming, Sports & Tech"
          events={[...eventsDay1, ...eventsDay2].filter(e => ["Gaming", "Tech", "Sports"].includes(e.category))}
          onEventClick={setSelectedEvent}
          eventStatuses={eventStatuses}
          bgImage="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80"
          themeObj={{ text: "text-blue-400", hoverText: "group-hover:text-blue-400", borderB: "border-b-blue-500/10", bg: "bg-blue-500", hoverBg: "hover:bg-blue-500/10", borderL: "border-l-blue-500", bgSoft: "bg-blue-500/10" }}
        />

      </section>

      <AnimatePresence>
        {showRegistration && selectedEvent ? (
          <RegistrationForm
            key="registration-form"
            event={selectedEvent}
            onClose={() => setShowRegistration(false)}
          />
        ) : selectedEvent ? (
          <EventModal
            key="event-modal"
            event={selectedEvent}
            isEventOpen={(eventStatuses.find(s => s.title === selectedEvent.title)?.isOpen ?? true)}
            onClose={() => setSelectedEvent(null)}
            onRegister={() => setShowRegistration(true)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
