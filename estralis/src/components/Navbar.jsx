import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"

export default function Navbar({ onOpenRegistrations, onOpenAdmin, onOpenThemeReveal }) {
  const [open, setOpen] = useState(false)
  const [themeVisible, setThemeVisible] = useState(false)
  
  // Desktop pill state
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Fetch theme reveal status from server
  useEffect(() => {
    const checkTheme = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/theme/status`)
        const data = await res.json()
        if (data.success) setThemeVisible(data.revealed)
      } catch (err) {
        console.error("Theme status fetch failed", err)
      }
    }
    checkTheme()
    const interval = setInterval(checkTheme, 30000)
    return () => clearInterval(interval)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only apply desktop scroll hiding logic
    const previous = scrollY.getPrevious()
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setIsScrolled(latest > 50)
  })

  // Floating animation for the mobile hamburger menu
  const hamburgerVariants = {
    initial: { opacity: 0, x: -50, rotate: -90 },
    animate: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15 } },
    hover: { scale: 1.1, textShadow: "0px 0px 8px rgb(255 255 255 / 0.8)", transition: { yoyo: Infinity, duration: 0.3 } },
    tap: { scale: 0.9 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <>
      {/* ======================================= */}
      {/* MOBILE HAMBURGER MENU (Original Drawer) */}
      {/* ======================================= */}
      <div className="md:hidden">
        <motion.button
          onClick={() => setOpen(true)}
          variants={hamburgerVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          className="fixed top-6 left-6 z-50
                      w-14 h-14 rounded-full
                      bg-white/10 backdrop-blur-md border border-white/20
                      text-2xl text-white flex items-center justify-center
                      shadow-[0_0_15px_rgba(255,255,255,0.1)]
                      hover:bg-white/20 hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
                      transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ x: "-100%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%" }}
          animate={{ x: open ? 0 : "-100%", borderTopRightRadius: "0%", borderBottomRightRadius: "0%" }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed top-0 left-0 h-full w-80
                      bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-black/95
                      backdrop-blur-xl border-r border-purple-500/30
                      shadow-[10px_0_30px_rgba(0,0,0,0.8)]
                      z-50 p-8 flex flex-col"
        >
          <motion.button
            onClick={() => setOpen(false)}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </motion.button>

          <div
            className="mb-12 mt-4 cursor-default active:scale-95 transition-transform"
            onClick={() => { onOpenAdmin(); setOpen(false); }}
          >
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400">
              ESTRALIS
            </h2>
            <p className="text-xs text-purple-300 tracking-[0.2em] uppercase mt-1">Techno-Cultural Fest 2026</p>
          </div>

          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate={open ? "show" : "hidden"}
            className="flex flex-col flex-1 gap-4 text-lg"
          >
            {['Home', 'About', 'Events', 'Venue', 'Clubs'].map((item) => (
              <motion.a
                key={item}
                variants={itemVariants}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="group relative px-4 py-3 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </span>
              </motion.a>
            ))}

            <motion.div variants={itemVariants} className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4" />

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onOpenRegistrations(); setOpen(false); }}
              className="w-full relative px-6 py-4 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 hover:border-pink-400/60 hover:from-pink-600/30 hover:to-purple-600/30 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shine" />
              <span className="relative z-10 text-pink-300 font-semibold flex items-center justify-between">
                Access My Pass
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </motion.button>

            {themeVisible && (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onOpenThemeReveal(); setOpen(false); }}
                className="w-full relative px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-400/60 hover:from-blue-600/30 hover:to-cyan-600/30 transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shine" />
                <span className="relative z-10 text-blue-300 font-semibold flex items-center justify-between">
                  ✨ THEME
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                </span>
              </motion.button>
            )}
          </motion.nav>
        </motion.div>
      </div>

      {/* ======================================= */}
      {/* DESKTOP TOP PILL MENU (With Colors) */}
      {/* ======================================= */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[90%] max-w-5xl rounded-[2rem] 
          ${isScrolled 
            ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] px-6 py-4' 
            : 'px-2 py-4'}`}
      >
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <div 
            className="cursor-pointer"
            onClick={() => onOpenAdmin()}
          >
            <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
              ESTRALIS
            </span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Events', 'Venue'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-gray-300 hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {themeVisible && (
              <button
                onClick={() => onOpenThemeReveal()}
                className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider hover:bg-blue-500/40 transition-all"
              >
                THEME
              </button>
            )}

            <button
              onClick={() => onOpenRegistrations()}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 border border-pink-400/50 text-white text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all transform hover:scale-105 active:scale-95"
            >
              Access Pass
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
