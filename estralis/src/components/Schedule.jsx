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
    time: "10:30 AM",
    title: "CLASSICAL GROUP",
    location: "Amphitheatre",
    description: "This is a web-based technical escape room competition conducted in a controlled lab environment. Teams will solve a series of logical, programming, and cybersecurity-based challenges across four progressive levels. Each level contains multiple puzzles that must be solved to obtain a key and unlock the next stage.",
    category: "Dance",
    prize: "₹30,000",
    minTeamSize: 2,
    maxTeamSize: 15,
    rules: ["1. Participants must be currently enrolled students of their respective institutions.",
      "2. Each team must consist of 1 to 3 members. Individual participation is allowed.",
      "3. All participants must carry a valid college ID card for verification.",
      "4. The event will be conducted on lab computers provided by the organizers. Use of personal laptops is strictly prohibited.",
      "5. The competition will run for a total duration of 3 hours, and teams must adhere strictly to the time limits.",
      "6. Participants will access the platform through a secured browser environment. Switching tabs, accessing external websites, or attempting to bypass system restrictions will result in penalties or disqualification.",
      "7. Mobile phones, smart devices, and any external storage devices are not permitted during the event. Participants may be asked to keep their phones aside before the competition begins.",
      "8. Teams must solve the challenges sequentially. A level must be completed to unlock the next level.",
      "9. A “Hint” option will be available. Using a hint will result in a time and points penalty as specified during the event.",
      "10. The leaderboard and scoring will be managed automatically by the system. The decision of the organizing team regarding scoring, eliminations, and final results will be final and binding.",
      "11. Eliminations will occur after designated levels based on performance.",
      "12. Any attempt to tamper with the system, share answers, or engage in unfair practices will lead to immediate disqualification.",
      "13. Specific instructions and login credentials will be provided at the venue before the event begins.",
      "14. Prizes will be awarded based on final rankings.",
      "15. Please check the event schedule before registering multiple events. Participants are responsible for checking the event schedule. The MANAGEMENT is not responsible for clashes with other events, and no refund will be provided in case of overlap.The participants from Gopalan Group of Institutions should contact the respective event coordinator before registering",
      "16. Report to the coordinator 30 minutes before the event starts.",
      "17.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",],
    coordinators: ["Jyesht M – 8951323830",
      "Vivek Kashyap – 8850623515",
      "Thanishka Reddy – 9449119449"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    time: "10:30 AM",
    title: "REELS MAKING",
    location: "1st Floor",
    description: "The tournament will follow standard FIDE chess rules, starting with 3 Swiss rounds where players earn points for wins and draws to determine rankings.",
    category: "Fun",
    prize: "₹6,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["*GAME RULES ARE SAME AS FIDE TOURNAMENTS*",
      "1. Tournament Format: The tournament will follow the Swiss System for 3 rounds. After the Swiss rounds, the Top 16 players will qualify for the Knockout stage.",

      "2. Rounds: All players will play 3 Swiss rounds. Pairings will be announced before each round.",

      "3. Scoring System:",
      "Win = 1 point",
      "Draw = 0.5 point",
      "Loss = 0 point",

      "4. Qualification: After 3 rounds, players will be ranked based on total points and tie-breaks. The Top 16 players will advance to knockouts.",

      "5. Knockout Stage: The knockout rounds will be played as Round of 16 → Quarterfinal → Semifinal → Final.",

      "6. Time Control: Each game will be played in Rapid format (7 minutes per player for Swiss rounds and 10 minutes per player for Knockout rounds).",

      "7. Touch-Move Rule: If a player touches a piece intentionally, that piece must be moved if a legal move exists.",

      "8. Illegal Moves: Two illegal moves by a player will result in the loss of the game.",

      "9. Fair Play: Mobile phones and electronic devices are not allowed in the playing area.",

      "10. Authority & ID: The arbiter’s decision will be final, and players must carry their college ID cards.",
      "11. Please check the schedule for overlapping events before registering for multiple events.",
      "12. If you have registered for overlapping events, management will not be responsible and no refund will be initiated. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "13. Participants must report to the coordinator 30 minutes before the event starts.",
      "14.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Saravanan M – 8618648916", "Nithesh – 8431648766"],
    registerLink: "#",
    fee: "₹250"
  },
  {
    time: "11:00 AM",
    title: "TREASURE HUNT",
    location: "410 Room, 4th Floor,GCEM Campus",
    description: "This event will require the participants to take photos and/or videos of the event happening on the day They are then required to compile these photos and/or videos into a single edited video of a span of max 2 mins. These videos will be evaluated by the jury and the winners will be announced.The participants will need to cover the event on both the days.",
    category: "Fun",
    prize: "₹7,500",
    comboPass: "₹450 (HIGHLIGHT REEL + SHOT CUT)",
    minTeamSize: 2,
    maxTeamSize: 3,
    rules: ["1. Participants must be currently enrolled in their college.",
      "2.  Participants must bring a valid college ID card.",
      "3.The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "4.The videos submitted must not include any watermarks or logos. ",
      "5.The video must not include any kind of slander towards the institution.",
      "6.Specific instructions about the video will be briefed to the teams before the start of the event.",
      "7.Participants have to bring their own equipment (camera, phone, laptop), as they will not be provided by the college.",
      "8. Participation as a group of 3(Min=2, Max=3)",
      "9. The originality of the edit will be verified by reviewing the project timeline/history in the editing software used by the participants.",
      "10. Please check the schedule for overlapping events before registering  multiple events",
      "11. If you have registered for overlapping events, management is not responsible, no refund will be initiated. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "12. Report to the coordinator 30 minutes before the event starts.",
      "13.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",],
    coordinators: ["Abdul Shuaib – 7892698624", "Veeresh Viraktamath – 9380022929"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    time: "11:00 AM",
    title: "FACE PAINTING",
    location: "Main Quadrangle",
    description: "Transform faces into living art in this creative challenge! Bring your imagination and vibrant colors to the ultimate face painting showdown.",
    category: "Fun",
    prize: "₹3,000",
    minTeamSize: 2,
    maxTeamSize: 2,
    rules: [
      "1. Participants must participate in pairs (one artist, one model).",
      "2. Only skin-safe, non-toxic paints are allowed.",
      "3. Time limit is strictly 1 hour.",
      "4. Judging will be based on creativity, execution, and theme adherence.",
      "5. Reference images are allowed but stencils are prohibited."
    ],
    coordinators: ["TBD"],
    registerLink: "#",
    fee: "₹200",
  },
  {
    time: "11:00 AM",
    title: "FITNESS CHALLENGE",
    location: "Room 405,406 & 407, 4th Floor, GCEM Campus",
    description: "The BGMI Tournament is a competitive esports event where teams battle in custom lobby matches to showcase their strategy, coordination, and combat skills.",
    category: "Sports",
    prize: "₹12,000",
    minTeamSize: 4,
    maxTeamSize: 4,
    rules: ["All participants should arrive at the venue 30 min prior to the event.", "1. Participants must be currently enrolled students of their respective institutions.",

      "2.  All participants must carry a valid college ID card for verification.",

      "3.  Each team must consist of 4 players only. No substitute players are allowed.",

      "4.  All players must have a BGMI account above Level 25, and the account must be at least 30 days old.",

      "5.  Only Android and iOS smartphones are permitted. Tablets, iPads, and emulators are strictly prohibited.",

      "6.  The tournament will consist of 4 matches in total. The maps for each match will be randomly selected, so all players must download all BGMI maps before the tournament.",

      "7.  Points will be awarded as follows:",

      "  #1 – 15 Points",

      "  #2 – 12 Points",

      "  #3 – 10 Points",

      "  #4 – 8 Points",

      "  #5 – 6 Points",

      "  #6 – 4 Points",

      "  #7 – 2 Points",

      "8. Each Kill – 1 Point",

      "9.  The total points from all 4 matches will determine the final rankings and winners.",

      "10.  Teams must join the custom room within the given time. A maximum waiting time of 5 minutes will be provided. If a team fails to join before match start, the match will continue without them and no rematch will be given.",

      "11.  WiFi will be provided by the organizers. However, players are strongly advised to keep their own mobile data as backup. No rematch will be given for network issues, lag, or disconnections.",
      "12. Use the Internet to join the matches, after joining connect to the provided wifi to avoid any joining issues.",

      "13.  All participants must take full responsibility for their personal belongings, including devices and accessories. The organizers shall not be liable for any loss, theft, or damage during the event.",

      "14.  All required maps must be downloaded before the tournament. Matches will not be delayed for map downloads.",

      "15.  Participants are requested to bring a power bank for backup, if possible, to avoid interruptions during the tournament.",

      "16.  Teams must report 30 minutes before match time for check-in and verification.",

      "17.  Any form of cheating, hacking, teaming, use of third-party tools, account sharing, or unfair practices will result in immediate disqualification.",

      "18. Any additional rules or instructions will be communicated to participants before the start of each match.",

      "19. Official observer records and organizer decisions will be final in case of any disputes.",
      "20. Please check the event schedule before registering multiple events. Participants are responsible for checking the event schedule. The MANAGEMENT is not responsible for clashes with other events, and no refund will be provided in case of overlap.The participants from Gopalan Group of Institutions should contact the respective event coordinator before registering",
      "21. Report to the coordinator 30 minutes before the event starts.",
      "22.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show)."],
    coordinators: ["Rajesh – 8073439040", "Pavan - 8073083421", "Darshan R- 7760055444"],
    registerLink: "#",
    fee: "₹600",
  },
  {
    time: "11:00 AM",
    title: "FACE PAINTING",
    location: "LAB 5, Ground Floor, GCEM Campus",
    description: "This is a Poster Designing event. It will consist of two rounds.The theme will be provided to the participants at the start of the event, and the poster must be made digitally within the set time limit using any software they wish to use.",
    category: "Art",
    prize: "₹6,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["1. Participants must be currently enrolled in their college.",
      "2.  Participants must bring a valid college ID card.",
      "3.  Participants must bring their laptops with all necessary software pre-installed",
      "4.  Computers will be provided to participants who are not able to bring their laptops(only limited computers available). ",
      "5.  Internet access will be provided at the venue.",
      "6.  The theme of the poster will be announced at the start of the competition.",
      "7.  Specific instructions will be provided before the start of the event. ",
      "8.  Please check the schedule for overlapping events before registering for multiple events.",
      "9.  If you have registered for overlapping events, MANAGEMENT is not responsible, no refund will be initiated.10. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "11. Report to the coordinator 30 minutes before the event starts.",
      "12. Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",


    ],
    coordinators: ["Nithelan Jayakumar – 8904572607", "Bushra M – 8310084375"],
    registerLink: "#",
    fee: "₹200",
  },
  {
    time: "11:30 PM",
    title: "BEAT BOXING",
    location: "LAB 3, 4th Floor,GCEM Campus",
    description: "Test your coding and problem-solving skills in this competitive programming event conducted on HackerRank. Participants will compete through elimination rounds to solve challenging problems and prove their programming expertise.",
    category: "Fun",
    prize: "₹7,500",
    minTeamSize: 1,
    maxTeamSize: 2,
    rules: ["1. This event consists of two rounds that will be conducted on HackerRank.",

      "2. Participants may use any programming language.",

      "3. Every participant must have a HackerRank account.",

      "4. The first round consists of three questions and is an elimination round.",

      "5. The second round consists of two questions. ",

      "6. Participants must be current college students. A valid college ID card is required for participation.",

      "7. All phones and smartwatches must be surrendered at the start of the event and will be returned afterward. Failure to comply will result in immediate disqualification.",

      "8. There are 2 prizes if there are more than 11 registrations; otherwise, there will be only 1 prize.",

      "9. Any form of cheating, including internet access or the use of chatbots, will lead to instant disqualification. Volunteers will monitor for compliance. ",

      "10. Event-specific rules will be explained before the start of the event. ",

      "11. Please check the schedule for overlapping events before registering for multiple events. ",

      "12. If you have registered for overlapping events, MANAGEMENT is not responsible and no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "13. Report to the coordinator 30 minutes before the event starts.",
      "14.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["M Tarun – 9663053076",
      "Bettina – 7619689937"
    ],
    registerLink: "#",
    fee: "₹350",
  },
  {
    time: "12:00 PM",
    title: "WESTERN SOLO",
    location: "Amphitheatre",
    description: "This is a solo singing competition where participants will perform a song in English, Hindi, or any other language. The song must be in the Western style, and participants will be judged on their vocal quality, stage presence, and overall performance.",
    category: "Dance",
    prize: "₹12,000",
    minTeamSize: 5,
    maxTeamSize: 8,
    rules: ["1.	Each team must have 4-8 members.",
      "2.	Performance time limit: 3–4 minutes (strict).",
      "3.	Vulgarity or inappropriate content is strictly prohibited.",
      "4.	Teams must arrive and report to the coordinator at the venue 1 hour before event start time.",
      "5.	Judges decision will be final and binding.",
      "6.	Costumes must be decent and modest.",
      "7.	Excessive skin exposure is strictly prohibited.",
      "8.	Transparent or inappropriate outfits will lead to disqualification.",
      "9. No political, religiously sensitive, or controversial representations.",
      "10. No fire, water, smoke, powder, sharp objects, or hazardous props.",
      "11. Organizing committee reserves the right to disqualify any participant violating decorum.",
      "12. Please check the schedule for overlapping events before registering for multiple events.",
      "13. If you have registered for overlapping events, management is not responsible,any such situations no refund will be initiated.",
      "14. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      ".",
      "'MUSIC RULES'",
      "1.Submit via Google Drive/email 48 hours prior.",
      "2.File name format:  CollegeName_TeamName.mp3",
      "3.No obscene lyrics.",
      "4.No explicit content.",
      "5.Only one track allowed per entry.",
      "6.Backup pen drive mandatory.",
      "",],
    coordinators: ["Shreeka K - 8861619612", "Vishaka - 8431217851", "Yeshwanth - 8884359993"],
    registerLink: "#",
    fee: "₹800",
    theme: "OPEN THEME"
  },
  {
    time: "12:00 PM",
    title: "BGMI",
    location: "1st Floor, GCEM Campus",
    description: "This is a solo singing competition where participants will perform a song in English, Hindi, or any other language. The song must be in the Western style, and participants will be judged on their vocal quality, stage presence, and overall performance.",
    category: "Gaming",
    prize: "₹12,000",
    minTeamSize: 5,
    maxTeamSize: 8,
    rules: ["1.	Each team must have 4-8 members.",
      "2.	Performance time limit: 3–4 minutes (strict).",
      "3.	Vulgarity or inappropriate content is strictly prohibited.",
      "4.	Teams must arrive and report to the coordinator at the venue 1 hour before event start time.",
      "5.	Judges decision will be final and binding.",
      "6.	Costumes must be decent and modest.",
      "7.	Excessive skin exposure is strictly prohibited.",
      "8.	Transparent or inappropriate outfits will lead to disqualification.",
      "9. No political, religiously sensitive, or controversial representations.",
      "10. No fire, water, smoke, powder, sharp objects, or hazardous props.",
      "11. Organizing committee reserves the right to disqualify any participant violating decorum.",
      "12. Please check the schedule for overlapping events before registering for multiple events.",
      "13. If you have registered for overlapping events, management is not responsible,any such situations no refund will be initiated.",
      "14. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      ".",
      "'MUSIC RULES'",
      "1.Submit via Google Drive/email 48 hours prior.",
      "2.File name format:  CollegeName_TeamName.mp3",
      "3.No obscene lyrics.",
      "4.No explicit content.",
      "5.Only one track allowed per entry.",
      "6.Backup pen drive mandatory.",
      "",],
    coordinators: ["Shreeka K - 8861619612", "Vishaka - 8431217851", "Yeshwanth - 8884359993"],
    registerLink: "#",
    fee: "₹800",
    theme: "OPEN THEME"
  },
]

export const eventsDay2 = [
  {
    time: "09:30 AM",
    title: "WESTERN GROUP",
    location: "Main stage, GCEM Campus",
    description: "TRIPLE THREAT CHALLENGE is a team-based challenge event conducted. Each team consists of four members and will compete across three exciting rounds that test teamwork, coordination, communication, and speed.",
    category: "Dance",
    prize: "₹6,000",
    minTeamSize: 4,
    maxTeamSize: 4,
    rules: ["  1. Participants must be currently enrolled in their respective colleges.",
      "2. Each team must consist of 4 members.",
      "3. All participants must carry a valid college ID card.",
      "4. Teams must report to the  coordinator and arrive at the venue 15 minutes before the event begins.",
      "5. Participants must strictly follow the instructions given by the coordinators.",
      "6. Any form of misconduct or unfair practice will lead to disqualification.",
      "7. Registration fees once paid are non-refundable and non-transferable under any circumstances.",
      "8. The decision of the judges/coordinators will be final and binding.",
      "9. Please check the schedule for overlapping events before registering multiple events",
      "10. If you have registered for overlapping events, MANAGEMENT is not responsible,any such situations no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "11.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Himashree - 8885392795", "Pratiksha – 8867114450"],
    registerLink: "#",
    fee: "₹500"
  },
  {
    time: "11:00 AM",
    title: "BATTLE OF BANDS",
    location: "Main stage, GCEM Campus",
    description: "This is an interactive and strategic word-based competition where teams participate in a simulated auction to bid for letters, words, or language-based challenges using fake currency. Teams must use their bidding strategy, vocabulary knowledge, and quick thinking to build valid words, solve linguistic puzzles, and earn points. The event encourages creativity, language skills, and decision-making while maintaining a competitive and engaging environment.",
    category: "Fun",
    prize: "₹3,500",
    minTeamSize: 1,
    maxTeamSize: 2,
    rules: ["1.	Participants must be currently enrolled students of their respective institutions.",
      "2.	Each team must consist of 1 to 2 members. Individual participation is allowed.",
      "3.	All participants must carry a valid college ID card for verification.",
      "4.	Each team will be provided with a fixed amount of fake currency at the beginning of the event for bidding purposes.",
      "5.	Letters, word fragments, or language challenges will be auctioned by the host during the event.",
      "6.	Teams must strategically bid to acquire letters or linguistic resources required to form meaningful words or solve challenges.",
      "7.	Bidding must follow the auction rules announced by the host. Once a bid is confirmed, it cannot be withdrawn.",
      "8.	Teams must construct valid words or complete linguistic tasks using the letters/resources they successfully win in the auction.",
      "9.	Only standard English dictionary words will be considered valid unless otherwise specified by the organizers.",
      "10. The judging panel will verify the validity of words and tasks completed. Their decision will be final and binding.",
      "11. Teams are not allowed to use mobile phones, smart devices, dictionaries, translation tools, or any external resources during the event.",
      "12. Any attempt to communicate answers with other teams, share resources, or engage in unfair practices will result in immediate disqualification.",
      "13. Points will be awarded based on word complexity, correctness, creativity, and task completion as defined by the event rules.",
      "14.  Please check the schedule for overlapping events before registering multiple events.",
      "15. Participants are responsible for checking the event schedule. The Management is not responsible for clashes with other events, and no refund will be provided in case of overlap. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "16. Report to the coordinator 30 minutes before the event starts.",
      "17.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Charan Kumar – 9482886761", "Vadla Chaturya - 9986070222"],
    registerLink: "#",
    fee: "₹200"
  },
  {
    time: "01:00 PM",
    title: "FASHION WALK",
    location: "Main stage, GCEM Campus",
    description: "A knockout-style technical debate competition focusing on emerging technologies like AI, Cybersecurity, Blockchain, Quantum Computing & Digital Ethics.",
    category: "Fashion",
    prize: "₹6,000",
    minTeamSize: 2,
    maxTeamSize: 3,
    rules: ["1. Participants must carry valid college ID card.",
      "2. Teams must report 45 minutes before event start.",
      "3. Topic will be given 30 minutes prior to debate.",
      "4. FOR/AGAINST position decided by draw.",
      "5. No mobile phones allowed during debate.",
      "6. Participants can use Phone or Laptop only during preparation time.",
      "7. No offensive/personal remarks.",
      "8. Time limit strictly followed.",
      "9. Judges decision will be final.",
      "10. Please check the schedule for overlapping events before registering multiple events.",
      "11. Participants are responsible for checking the event schedule. The Management is not responsible for clashes with other events, and no refund will be provided in case of overlap. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "12.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Prince Kumar – 7277402658",
      "Tarun Kumar Pathak – 8073165834"],
    registerLink: "#",
    fee: "₹300",
  },

  {
    time: "06:00 PM",
    title: "ARTIST PERFORMANCE AND DJ NIGHT",
    location: "Main stage, GCEM Campus",
    description: "Step into the spotlight and let your passion ignite the stage, where every move tells a story and every rhythm captivates the soul. Witness an electrifying showcase of talent, energy, and grace, as dancers compete to turn dreams into motion.",
    category: "Fun",
    prize: "₹300",
    minTeamSize: 2,
    maxTeamSize: 15,
    rules: ["*Duration: 6-8 minutes per team for their performance*",
      "All participants should arrive at the venue 1 hour prior to the event.",
      "1. Music",
      "• Teams must submit their music tracks in MP3 format via Google Drive/email by 07/03/2026.",
      "• File name format: College/Group Name.mp3",
      "• Backup copies of music tracks should be brought on USB drive.",
      "• Music should be appropriate and not contain any explicit content.",
      ".",
      "2. Choreography",
      "• All dance forms are allowed (Classical, Hip-hop, Semi-classical, Folk,Contemporary).",
      "• Choreography should be original or legally permissible.",
      ".",
      "3. Costumes",
      "• Costumes should be appropriate and respectful of cultural sensitivities.",
      "• Any form of obscenity will result in disqualification.",
      ".",
      "4. Props",
      "• Props are allowed but must be handled by participants themselves.",
      "• Dangerous/Problematic props (fire, sharp objects,powders etc) are prohibited.",
      ".",
      // "• There will be 2 prizes if more than 8 registrations; otherwise, only 1 prize",
      "5. Note",
      "• Please check the schedule for overlapping events before registering multiple events",
      "• If registered for overlapping events, MANAGEMENT is not responsible and no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "• Arrive at the venue and report to the coordinators 1 hour before the event starts",
      ".",
      "CODE OF CONDUCT",
      "• Participants are expected to maintain decorum and sportsmanship.",
      "• Any form of misbehavior or disrespect towards organizers, judges, or fellow will lead to disqualification.",
      "• Vulgar language, inappropriate gestures, and offensive content are strictly prohibited.",
      "• If technical issues occur, participants may be allowed to restart (subject to judges approval).",
      "• The decision of the judges is final and binding.",
      "• Performances are judged based on choreography, synchronization,expression, creativity, and overall impact.",
      ".",
      "SAFETY",
      "•Participants should ensure their performance is safe and does not pose any risk to themselves or the audience",
      "13.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",

    ],
    coordinators: ["Divyashree RM – 7019691887", "Abhishek R - 7019323085"],
    registerLink: "#",
    fee: "₹700",
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

function EventCard({ title, fee, category, onClick, isOpen, t }) {
  const theme = t || { text: "text-teal-400", hoverText: "group-hover:text-teal-400", bg: "bg-teal-500", hoverBg: "hover:bg-teal-500/10", borderL: "border-l-teal-500", bgSoft: "bg-teal-500/10" };

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className={`relative group cursor-pointer astral-glass border-l-4 p-8 h-full flex flex-col justify-between transition-all duration-500 ${theme.borderL} ${theme.hoverBg} hover:border-l-white`}
    >
      {/* Blocky Price Tag (Saarang Style) */}
      <div className={`absolute top-0 right-0 text-black px-4 py-1.5 font-black text-xs tracking-widest uppercase ${theme.bg}`}>
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

function EventModal({ event, isEventOpen, onClose, onRegister }) {
  const [activeTab, setActiveTab] = useState("about")

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
              <span className="astral-eyebrow text-teal-500 uppercase">
                {cat} SECTOR
              </span>
              <h3 className="text-4xl sm:text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter astral-heading">
                {event.title}
              </h3>
              
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase font-tech">SQUAD SIZE: {teamText}</span>
                </div>
                {event.theme && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500/30" />
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
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
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
                     <p className="saarang-serif text-white/80 text-xl leading-relaxed italic border-l-4 border-teal-500/30 pl-8">
                        "{event.description}"
                      </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-8 astral-glass-bright flex flex-col items-center text-center group">
                        <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-3 font-astral">Price</span>
                        <span className="text-2xl font-black text-white italic font-astral">{event.fee}</span>
                      </div>
                      <div className="p-8 astral-glass-bright flex flex-col items-center text-center group">
                        <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-3 font-astral">Location</span>
                        <span className="text-base font-bold text-white uppercase italic font-tech text-center">@{event.location}</span>
                      </div>
                      <div className="p-8 astral-glass-bright flex flex-col items-center text-center group">
                        <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-3 font-astral">Prizes</span>
                        <span className="text-xl font-black text-teal-400 italic font-astral">{event.prize || "Participation"}</span>
                      </div>
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
                          className="flex items-start gap-6 p-6 astral-glass-bright border-transparent hover:border-teal-500/20 transition-all group"
                        >
                          <span className="text-sm font-black text-teal-500/40 font-astral mt-1">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <p className="text-sm text-white/70 leading-relaxed font-medium font-tech">
                            {rule}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {isEventOpen && (
                      <div className="pt-8 flex flex-col items-center gap-4">
                         <div className="flex items-center gap-3 text-teal-500/50 mb-2">
                            <div className="w-12 h-[1px] bg-teal-500/30" />
                            <span className="text-[9px] font-black tracking-widest uppercase font-astral">Protocol Complete</span>
                            <div className="w-12 h-[1px] bg-teal-500/30" />
                         </div>
                         <button
                            onClick={() => onRegister(event)}
                            className="w-full max-w-md py-6 bg-teal-500 text-black text-[12px] font-black tracking-[0.4em] uppercase rounded-2xl hover:bg-white transition-all shadow-[0_0_40px_rgba(45,212,191,0.3)] font-astral"
                          >
                            PROCEED_TO_REGISTRY
                          </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "coordinators" && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {event.coordinators.map((c, i) => {
                        const [name, phone] = c.split(' – ');
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 astral-glass-bright flex items-center justify-between group"
                          >
                            <div>
                              <p className="text-white font-black tracking-widest uppercase text-xl font-astral">{name}</p>
                              <p className="text-[9px] font-black text-teal-500/50 tracking-widest uppercase font-astral mt-1">Coordinator Access</p>
                            </div>
                            <div className="text-right">
                               <p className="text-teal-400 font-bold font-tech text-lg">{phone}</p>
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
          setEventStatuses(data.data);
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

        <div className="py-20 text-center astral-glass mx-6 mt-20 border-teal-500/20">
          <p className="astral-eyebrow text-teal-400">Archive Transmission End</p>
          <h3 className="saarang-serif text-3xl mt-4 italic text-white/40">More signals to be decoded soon.</h3>
        </div>
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
