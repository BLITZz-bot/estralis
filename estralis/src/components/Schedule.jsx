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
    date: "May 14",
    time: "09:00 AM - 10:00 AM",
    title: "INAUGURATION",
    location: "Amphitheatre",
    description: "The grand opening ceremony of ESTRALIS. Join us for the official kickoff of our cultural festival with traditional lighting of the lamp and inaugural performances.",
    category: "Ceremony",
    prize: "",
    minTeamSize: 0,
    maxTeamSize: 0,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Join the ceremony on time.", "Open for all students and guests.", "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.", 
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
    ],
    coordinators: ["Core Team"],
    registerLink: "#",
    fee: "FREE",
  },
  {
    date: "May 14",
    time: "10:30 AM - 12:00 PM",
    title: "WESTERN SOLO",
    location: "Amphitheatre",
    description: "An individual dance competition focusing on western styles such as hip-hop, contemporary, jazz, or freestyle. Participants must showcase technique, expression, and strong stage presence while delivering a powerful and engaging solo performance.",
    category: "Dance",
    prize: "₹8,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Each participant will be allotted a performance time of 4+1 minutes. Exceeding the time limit may result in penalties.",
      "Only Western dance styles such as Hip-Hop, Freestyle, Contemporary, Jazz, etc., are permitted.",
      "Participants must submit their performance tracks (MP3 format) and optional background visuals (MP4 format) at least 48 hours prior to the event. No on-site modifications or submissions will be permitted.",
      "Use of dangerous or hazardous props (such as fire, glass, sharp objects, etc.) is strictly prohibited.",
      "Performances must be appropriate and respectful. Any vulgar or offensive content will lead to disqualification.",
      "Carry your college ID cards.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 1 hour prior to the scheduled time.",
    ],
    coordinators: ["Ramya Victoria - 7204210703", "Ritkriti - 8618080973"],
    registerLink: "#",
    fee: "₹500",
  },
  {
    date: "May 14",
    time: "10:30 AM(1st day) - 11:00 AM(2nd day)",
    title: "REELS MAKING",
    location: "1ST Floor Class Room",
    description: "A digital creativity challenge where participants create short, engaging videos. From concept and shooting to editing and storytelling, this event tests creativity, trend awareness, and presentation skills.",
    category: "Fun",
    prize: "₹9,000",
    minTeamSize: 1,
    maxTeamSize: 3,
    rules: [
      "Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Duration: 30–60 seconds | Vertical video format mandatory",
      "Carry your college ID cards.",
      "Individual or team (max 3 members)",
      "Content must be original | No copyright violations allowed.",
      "Judging based on creativity, editing & presentation.",
      "Participants get 24 hours to shoot & create the reel | Must be fully edited before submission.",
      "Reel must be submitted before deadline | Late submissions will not be accepted.",
      "Participants have to bring their own equipment (camera, phone, laptop), as they will not be provided by the college.",
      "The videos submitted must not include any watermarks or logos.",
      "The video must not include any kind of slander towards the institution.",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 30 minutes prior to the scheduled time.",
    ],
    coordinators: ["Rupa Shree - 9741095149", "Varun - 8310307771"],
    registerLink: "#",
    fee: "₹500"
  },
  {
    date: "May 14",
    time: "11:00 AM - 01:00 PM",
    title: "TREASURE HUNT",
    location: "GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT Campus",
    description: "An adventurous team-based game where participants solve clues and complete challenges to find the final treasure. It encourages logical thinking, teamwork, and quick decision-making under time pressure.",
    category: "Fun",
    prize: "₹10,000",
    minTeamSize: 1,
    maxTeamSize: 5,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Each team must consist of exactly 5 members.",
      "All clues must be solved and followed in the given sequence.",
      "Skipping clues is not allowed and will lead to disqualification.",
      "Use of unfair means or malpractice will result in immediate disqualification.",
      "Mobile phones or external help are strictly prohibited unless permitted by organizers.",
      "The team completing all clues in the shortest time wins.",
      "The decision of the organizers/judges will be final and binding.",
      "Carry your college ID cards.",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 30 minutes prior to the scheduled time.",
    ],
    coordinators: ["Ujwala Gowda - 8197388105", "Vishaka - 8431217851"],
    registerLink: "#",
    fee: "₹500",
  },
  {
    date: "May 14",
    time: "11:00 AM - 01:00 PM",
    title: "FACE PAINTING",
    location: "1st Floor,GCEM CAMPUS",
    description: "An artistic event where participants transform faces into creative masterpieces using colors and imagination. Attention to detail, neatness, and originality are essential as artists bring their ideas to life.",
    category: "Fun",
    prize: "₹3,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Time limit: 90 minutes.",
      "It is an open theme.",
      "Participants must bring their own materials.",
      "Only one model per participant.",
      "Judging based on creativity and neatness.",
      "No pre-drawn designs allowed.",
      "The decision of the judges will be final and binding.",
      "Carry your college ID cards.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 30 minutes prior to the scheduled time.",
    ],
    coordinators: ["Pranitha - 9845649134", "Sneha - 7204981094"],
    registerLink: "#",
    fee: "₹200",
  },
  {
    date: "May 14",
    time: "12:00 PM - 03:00 PM",
    title: "BGMI",
    location: "1ST Floor Classroom",
    description: "A competitive gaming event where players battle in BGMI matches to prove their strategy and survival skills. Team coordination, quick reflexes, and tactical gameplay are essential to secure victory.",
    category: "Gaming",
    prize: "₹15,000",
    minTeamSize: 4,
    maxTeamSize: 5,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Tournament consists of 4 matches.",
      "Maps will be selected randomly.",
      "All required maps must be downloaded beforehand.",
      "Teams must join the room on time (5-minute grace allowed).",
      "No rematches for late entry or absence.",
      "Cheating, hacking, teaming, or use of third-party tools = disqualification.",
      "Account sharing is strictly prohibited.",
      "Participants are responsible for their own devices.",
      "No refunds for schedule clashes.",
      "Organizers' decision will be final and binding.",
      "Points System:",
      `Placement Points:
      1st - 10 pts
      2nd - 6 pts
      3rd - 5 pts
      4th - 4 pts
      5th - 3 pts
      6th - 2 pts
      7th-8th - 1 pt
      9th-16th - 0 pts
      Each kill = +1 point`,
      "Points will be calculated across all matches Network Rules:",
      "WiFi may be provided; players are advised to keep mobile data backup.",
      "No rematches for lag, disconnection, or network issues.",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 30 minutes prior to the scheduled time.",
    ],
    coordinators: ["Kishore V - 9742726861", "Anas Ansari - 9008892112", "Hari Kumar - 6362965600"],
    registerLink: "#",
    fee: "₹1000",
  },
  {
    date: "May 14",
    time: "12:30 PM - 02:30 PM",
    title: "CLASSICAL GROUP",
    location: "Amphitheatre",
    description: "A graceful group dance event that celebrates traditional dance forms and cultural storytelling. Teams perform synchronized routines with expressive gestures, rhythm, and elegance, reflecting the richness of classical art forms.",
    category: "Dance",
    prize: "₹30,000",
    minTeamSize: 3,
    maxTeamSize: 15,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Each team will be allotted a performance time of 8+2 minutes. Exceeding the time limit may result in penalties.",
      "Only Indian classical dance forms such as Bharatanatyam, Kathak, Kuchipudi, Mohiniyattam, Odissi, etc., are permitted. Fusion with non-classical styles is not allowed.",
      "Performances must be appropriate and respectful. Any vulgar or offensive content will lead to disqualification.",
      "Participants must submit their performance tracks (MP3 format) and optional background visuals (MP4 format) at least 48 hours prior to the event. No on-site modifications or submissions will be permitted.",
      "Use of props is allowed, but participants must manage them without causing delays or hazards.",
      "Judging based on expressions (Abhinaya), technique, and grace.",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Carry your college ID cards.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 1 hour prior to the scheduled time.",
    ],
    coordinators: ["Arsha G - 9538622342", "Jyothi - 9008111237"],
    registerLink: "#",
    fee: "₹2,500",
  },
  {
    date: "May 14",
    time: "02:30 PM - 03:30 PM",
    title: "BEAT BOXING",
    location: "Amphitheatre",
    description: "A high-energy vocal percussion battle where participants create beats, rhythms, and musical effects using only their voice. This event challenges creativity, breath control, and rhythm sense as performers showcase unique sound patterns and freestyle skills. Stage presence and crowd engagement play a key role in standing out.",
    category: "Fun",
    prize: "₹8,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Only vocal sounds are permitted. The use of musical instruments or external devices is strictly prohibited.",
      "Performances must be appropriate and respectful. Any form of offensive, vulgar, or inappropriate content will lead to disqualification.",
      "This is a solo performance event; group participation is not allowed.",
      "Judging will be based on rhythm, creativity, originality, stage presence, and clarity.",
      "The judges' decision will be final.",
      "Participants are advised to check the event schedule before registering for multiple events. No refunds will be provided for scheduling conflicts.",
      "Carry your college ID cards.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 1 hour prior to the scheduled time.",
    ],
    coordinators: ["Manoj N - 7760396379", "Sirisha - 7019176616"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    date: "May 14",
    time: "03:30 PM - 05:00 PM",
    title: "WESTERN GROUP",
    location: "Amphitheatre",
    description: "A dynamic group dance competition where teams perform energetic western routines. Coordination, formations, creativity, and synchronization are key as groups deliver impactful and entertaining performances.",
    category: "Dance",
    prize: "₹30,000",
    minTeamSize: 6,
    maxTeamSize: 15,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Team size: 6 - 15 members.",
      "Time limit: 5 - 10 minutes (including entry & exit).",
      "Only western dance styles allowed.",
      "Participants must submit their performance tracks (MP3 format) and optional background visuals (MP4 format) at least 48 hours prior to the event. No on-site modifications or submissions will be permitted.",
      "Dangerous props, fire, or risky stunts are strictly prohibited.",
      "Teams must be ready before their slot.",
      "Exceeding time limit may lead to penalty or disqualification.",
      "Any damage to stage/property is team's responsibility.",
      "Judging criteria: Synchronization & coordination, choreography & creativity, energy & expressions.",
      "Teams must report on time for registration and sound check.",
      "Carry college ID cards.",
      "The judges’ decision is final and binding.",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 1 hour prior to the scheduled time.",
    ],
    coordinators: ["Siya - 9886483177", "Shruti - 6282173819"],
    registerLink: "#",
    fee: "₹2,500"
  },
]

export const eventsDay2 = [
  {
    date: "May 15",
    time: "10:00 AM - 12:00 PM",
    title: "BATTLE OF BANDS",
    location: "Amphitheatre",
    description: "A thrilling live music competition where bands perform to showcase their musical talent and coordination. Whether it’s original compositions or covers, bands are judged on rhythm, harmony, stage presence, and connection with the audience.",
    category: "Fun",
    prize: "₹30,000",
    minTeamSize: 3,
    maxTeamSize: 12,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Type: Team | Team size: 3 – 12",
      "All genres allowed (rock, fusion, indie, etc.)",
      "Live performance only (no lip-sync)",
      "Time limit: 10–15 min (including setup) | Exceeding time = penalty",
      "Original composition encouraged | No explicit or inappropriate content",
      "Equipment: Basic sound provided | Bring your own instruments | Inform in advance for special requirements",
      "Judging: Musicality & coordination | Stage presence & energy | Creativity & originality | Audience engagement",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 1 hour prior to the scheduled time.",
    ],
    coordinators: ["Rovin - 9019142436", "Shivaraj - 6360236878"],
    registerLink: "#",
    fee: "₹2,500"
  },
  {
    date: "May 15",
    time: "11:00 AM - 12:30 PM",
    title: "FITNESS CHALLENGE - Push-ups",
    location: "Open Amphitheatre",
    description: "A test of upper body strength. Participants compete to perform the maximum number of proper form push-ups within a set time limit, showcasing stamina and discipline.",
    category: "Sports",
    prize: "₹11,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: [
      "Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Maximum number of proper form push-ups in 2 minutes.",
      "Arms must be fully extended at the top and chest close to the ground at the bottom.",
      "Proper form must be maintained throughout the attempt.",
      "Knees touching the ground will end the attempt.",
      "Any misconduct or unfair means will lead to disqualification.",
      "Carry your college ID cards.",
      "The judges' decision is final.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 30 minutes prior to the scheduled time.",
    ],
    coordinators: ["Chandan Kumar J - 8050661979", "Shivayogi - 7760333829"],
    registerLink: "#",
    fee: "₹500",
  },
  {
    date: "May 15",
    time: "12:30 PM - 02:00 PM",
    title: "FITNESS CHALLENGE - Plank",
    location: "Open Amphitheatre",
    description: "A test of core stability and endurance. Participants compete to maintain a proper elbow plank position for the longest possible duration.",
    category: "Sports",
    prize: "₹11,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: [
      "Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Longest duration maintained in a proper elbow plank position wins.",
      "Proper form: back straight, body parallel to ground, weight on forearms and toes.",
      "Knees or any other body part touching the ground ends the attempt.",
      "Timer starts when the participant is in the correct position.",
      "Participants are requested to bring their own mat (if required).",
      "Any misconduct or unfair means will lead to disqualification.",
      "Carry your college ID cards.",
      "The judges' decision is final.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 30 minutes prior to the scheduled time.",
    ],
    coordinators: ["Vinay - 9380661129", "Dheeraj - 9686508926"],
    registerLink: "#",
    fee: "₹500",
  },
  {
    date: "May 15",
    time: "12:00 PM - 03:00 PM",
    title: "FASHION WALK",
    location: "Amphitheatre",
    description: "A visually captivating runway event where teams present a predefined theme through style, choreography, and attitude. From costume design to expressions, every element contributes to storytelling on stage. It’s a perfect blend of fashion, creativity, and confidence.",
    category: "Fashion",
    prize: "₹45,000",
    minTeamSize: 6,
    maxTeamSize: 15,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "Theme : Open theme.",
      "Team size: 6 - 15 members.",
      "Time limit: 8 - 15 minutes.",
      "Participants must submit their performance tracks (MP3 format) and optional background visuals (MP4 format) at least 48 hours prior to the event. No on-site modifications or submissions will be permitted.",
      "No dangerous props or fire elements allowed.",
      "Carry your college ID cards.",
      "For team-based events, all registered members must be present at the venue simultaneously for registration and verification.",
      "Judging based on coordination, creativity, and confidence.",
      "Participants must perform as a team.",
      "No offensive or vulgar content.",
      "Judges' decision will be final.",
      "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued.",
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "The participants must reach the venue 1 hour prior to the scheduled time.",
    ],
    coordinators: ["Raksha M - 8867555612", "Deepthi V - 8867839042"],
    registerLink: "#",
    fee: "₹3,000",
  },
  {
    date: "May 15",
    time: "03:00 PM - 04:00 PM",
    title: "PRIZE DISTRIBUTION",
    location: "Amphitheatre",
    description: "The grand finale ceremony where winners across all categories are honored. Join us to celebrate the talent and hard work of all participants.",
    category: "Ceremony",
    prize: "",
    minTeamSize: 0,
    maxTeamSize: 0,
    rules: ["Everyone should come at 8.30 for venue and the registration will be 8.30 to 9.30",
      "All winners must be present at the venue.", "Open for all students and guests.", "Students from GCC and GPUC are requested to consult their respective event coordinators prior to registration.", 
      "The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "Participants are advised to review the event schedule for potential overlaps before registering for multiple events. Management is not responsible for scheduling conflicts, and no refunds will be issued."],
    coordinators: ["Core Team"],
    registerLink: "#",
    fee: "FREE",
  },

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

function EventCard({ title, fee, category, onClick, isOpen, t, time }) {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`} />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
              {isOpen ? 'Incoming Signal' : 'Transmission Offline'}
            </span>
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60">
            {time.split(" - ")[0]}
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
    <div className={`relative w-full py-12 md:py-24 lg:py-32 border-b ${t.borderB} group overflow-hidden`}>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6 mt-12 xl:mt-0 w-full">
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

  useEffect(() => {
    setActiveTab("about");
  }, [event]);

  if (!event) return null

  const cat = event.category || "Tech"
  const teamText = event.minTeamSize === event.maxTeamSize
    ? `${event.minTeamSize}`
    : `${event.minTeamSize || "?"} – ${event.maxTeamSize || "?"}`

  const tabs = [
    { id: "about", label: "Overview", icon: "✧" },
    { id: "rules", label: "Guidelines", icon: "✦" },
    { id: "coordinators", label: "Concierge", icon: "◈" },
  ]

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center z-[100] p-0 sm:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[85vh] bg-[#020617]/80 backdrop-blur-3xl border border-white/10 rounded-none sm:rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]`}
        style={{ borderColor: `rgba(${theme.accent === 'cyan-500' ? '6, 182, 212' : theme.accent === 'fuchsia-500' ? '217, 70, 239' : '45, 212, 191'}, 0.2)` }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-8 right-8 ${theme.text} opacity-60 hover:opacity-100 transition-all z-[60] p-2 hover:bg-white/5 rounded-full`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Border Glow Overlay */}
        <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-[40px] z-20" />

        {/* Colour Grading Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 ${theme.bgSoft}`} />
          <div className={`absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 ${theme.bgSoft}`} />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        </div>

        {/* Left Sidebar - Navigation & Title (Desktop) */}
        <div className={`w-full md:w-[450px] bg-black/40 border-b md:border-b-0 md:border-r border-white/10 flex flex-col p-8 sm:p-14 lg:p-16 justify-between relative z-10`}
          style={{ backdropFilter: 'blur(40px)' }}>
          <div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-[1px] ${theme.bg}`} />
                <span className={`text-[10px] font-black tracking-[0.5em] uppercase ${theme.text}`}>
                  {cat}
                </span>
              </div>

              <h3 className={`text-3xl sm:text-4xl lg:text-5xl saarang-serif italic leading-[1.2] pr-10 mb-4 bg-gradient-to-br from-white via-white/90 to-${theme.accent.split('-')[0]}-300 bg-clip-text text-transparent`}>
                {event.title}
              </h3>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-6 mt-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 text-left transition-all duration-500 ${activeTab === tab.id ? theme.text : "text-white/20 hover:text-white/40"
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className={`text-[11px] font-black tracking-[0.4em] uppercase ${activeTab === tab.id ? "translate-x-2" : ""
                  } transition-transform`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Tab Icons */}
          <div className="flex md:hidden justify-around mt-8 pt-6 border-t border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? theme.text : "text-white/20"
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[8px] font-black tracking-widest uppercase">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-transparent overflow-y-auto custom-scrollbar p-8 sm:p-16 lg:p-24 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-full flex flex-col"
            >
              {activeTab === "about" && (
                <div className="space-y-16">
                  {/* Elegant Quote Description */}
                  <div className="relative py-8">
                    <span className={`absolute -top-6 -left-10 text-8xl ${theme.text} opacity-10 saarang-serif pointer-events-none`}>“</span>
                    <p className="saarang-serif text-white/80 text-lg sm:text-xl lg:text-2xl leading-[1.8] italic relative z-10 max-w-4xl">
                      {event.description}
                    </p>
                  </div>

                  {/* Minimalist Info Grid */}
                  <div className="flex flex-wrap gap-x-12 gap-y-10 pt-8">
                    <div className="space-y-3 min-w-[150px]">
                      <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Schedule</p>
                      <p className={`text-xl font-bold text-white uppercase tracking-tight`}>
                        {event.date} // {event.time.split(" - ")[0]}
                      </p>
                    </div>
                    <div className="space-y-3 min-w-[120px]">
                      <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Investment</p>
                      <p className={`text-xl font-bold ${theme.text} uppercase tracking-tight`}>{event.fee}</p>
                    </div>
                    <div className="space-y-3 min-w-[180px] max-w-full">
                      <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Venue</p>
                      <p className="text-xl font-bold text-white uppercase tracking-tight break-words">@{event.location}</p>
                    </div>
                    {event.prize && (
                      <div className="space-y-3 min-w-[120px]">
                        <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Reward</p>
                        <p className={`text-xl font-bold ${theme.text} uppercase tracking-tight`}>{event.prize}</p>
                      </div>
                    )}
                    {(event.minTeamSize > 0 || event.maxTeamSize > 0) && !event.title?.toUpperCase().includes("DJ NIGHT") && !event.title?.toUpperCase().includes("ARTIST PERFORMANCE") && (
                      <div className="space-y-3 min-w-[120px]">
                        <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Squad Size</p>
                        <p className={`text-xl font-bold text-white uppercase tracking-tight`}>{teamText}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row gap-8 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${theme.bg} animate-pulse shadow-[0_0_15px_${theme.bg}]`} />
                      <span className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Registration Live</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("rules")}
                      className="px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-white/90 transition-all active:scale-95"
                    >
                      Read Protocol
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "rules" && (
                <div className="space-y-12">
                  <div className="flex items-center gap-6">
                    <h4 className="text-3xl saarang-serif text-white italic">Event Protocol</h4>
                    <div className="flex-1 h-[1px] bg-white/10" />
                  </div>

                  <div className="grid gap-8">
                    {event.rules.map((rule, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-8 group"
                      >
                        <span className={`text-2xl saarang-serif ${theme.text} opacity-60 group-hover:opacity-100 transition-opacity italic`}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <p className="text-base text-white/70 leading-loose tracking-wide pt-1">
                          {rule.trim()}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {isEventOpen && (
                    <div className="pt-16">
                      <button
                        disabled={slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0)}
                        onClick={() => onRegister(event)}
                        className={`w-full py-8 ${slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0)
                          ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                          : 'bg-white text-black hover:invert'
                          } text-[11px] font-black tracking-[0.5em] uppercase rounded-full transition-all duration-700 active:scale-95 shadow-2xl`}
                      >
                        {slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0) ? 'SOLD OUT' : 'Confirm Registry'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "coordinators" && (
                <div className="space-y-12">
                  <div className="flex items-center gap-6">
                    <h4 className="text-3xl saarang-serif text-white italic">Support Concierge</h4>
                    <div className="flex-1 h-[1px] bg-white/10" />
                  </div>

                  <div className="grid gap-6">
                    {event.coordinators.map((c, i) => {
                      const parts = c.split(/ [–-] |-| – /);
                      const name = parts[0]?.trim();
                      const phone = parts[1]?.trim();

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-10 border border-white/5 rounded-[30px] flex flex-col sm:flex-row items-center justify-between group hover:bg-white/5 transition-all duration-500"
                        >
                          <div className="text-center sm:text-left mb-6 sm:mb-0">
                            <p className="text-white font-bold tracking-widest uppercase text-2xl mb-1">{name}</p>
                            <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">Coordinator Access</p>
                          </div>
                          <div className="text-center sm:text-right">
                            <a
                              href={`tel:${phone}`}
                              className={`text-2xl font-bold font-tech ${theme.text} hover:opacity-60 transition-all block mb-1`}
                            >
                              {phone}
                            </a>
                            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Secure Transmission</span>
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
  );
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="px-6 mb-20 text-center relative"
        >
          {/* Impact Italic Heading with Smooth Slide-and-Fade */}
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="astral-heading text-6xl md:text-9xl lg:text-[11vw] mb-4 italic !tracking-widest leading-none"
            style={{ fontFamily: 'Impact, sans-serif' }}
          >
            Event Zones
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="saarang-serif italic text-white/30 text-xl lg:text-2xl"
          >
            Discover the Interstellar Spectrum
          </motion.p>
        </motion.div>

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
