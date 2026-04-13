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
    const previous = scrollY.getPrevious()
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setIsScrolled(latest > 50)
  })

  const hamburgerVariants = {
    initial: { opacity: 0, x: -50, rotate: -90 },
    animate: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15 } },
    hover: { scale: 1.1, textShadow: "0px 0px 8px rgb(45 212 191 / 0.8)", transition: { yoyo: Infinity, duration: 0.3 } },
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
      {/* MOBILE HAMBURGER MENU (Astral Drawer) */}
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
                      astral-glass border-teal-500/20
                      text-2xl text-teal-400 flex items-center justify-center
                      shadow-[0_0_15px_rgba(45,212,191,0.1)]
                      hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]
                      transition-all duration-300"
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
          initial={{ x: "-100%" }}
          animate={{ x: open ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed top-0 left-0 h-full w-80
                      bg-gradient-to-br from-slate-950 via-teal-950/80 to-black
                      backdrop-blur-xl border-r border-teal-500/30
                      shadow-[10px_0_30px_rgba(0,0,0,0.8)]
                      z-50 p-8 flex flex-col"
        >
          <motion.button
            onClick={() => setOpen(false)}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 hover:text-white hover:bg-teal-500/20 hover:border-teal-500/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </motion.button>

          <div
            className="mb-12 mt-4 cursor-default active:scale-95 transition-transform"
            onClick={() => { onOpenAdmin(); setOpen(false); }}
          >
            <h2 className="astral-heading text-3xl">ESTRALIS</h2>
            <p className="text-[10px] text-teal-400 opacity-60 tracking-[0.3em] uppercase mt-1">Stellar Reunion 2026</p>
          </div>

          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate={open ? "show" : "hidden"}
            className="flex flex-col flex-1 gap-4 text-sm"
          >
            {['Home', 'About', 'Events', 'Venue'].map((item) => (
              <motion.a
                key={item}
                variants={itemVariants}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="group relative px-4 py-3 rounded-xl overflow-hidden transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 font-bold text-gray-400 group-hover:text-teal-300 transition-colors flex items-center justify-between uppercase tracking-widest">
                  {item}
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </span>
              </motion.a>
            ))}

            <motion.div variants={itemVariants} className="w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent my-4" />

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onOpenRegistrations(); setOpen(false); }}
              className="w-full relative px-6 py-4 rounded-xl bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 hover:border-teal-400/60 transition-all group overflow-hidden"
            >
              <span className="relative z-10 text-teal-300 font-bold tracking-widest uppercase flex items-center justify-between">
                Access Pass
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </motion.button>
          </motion.nav>
        </motion.div>
      </div>

      {/* ======================================= */}
      {/* DESKTOP TOP PILL MENU (Astral Edition) */}
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
            ? 'bg-gradient-to-r from-slate-950/80 via-teal-950/80 to-black/80 backdrop-blur-xl border border-teal-500/30 shadow-[0_0_30px_rgba(45,212,191,0.2)] px-8 py-4' 
            : 'px-2 py-4'}`}
      >
        <div className="flex items-center justify-between">
          
          <div 
            className="cursor-pointer group flex items-center gap-3"
            onClick={() => onOpenAdmin()}
          >
            <span className="astral-heading text-xl">
              ESTRALIS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-12">
            {['Home', 'About', 'Events', 'Venue'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="relative text-[9px] font-black text-teal-100/40 hover:text-teal-400 transition-all group py-1 uppercase tracking-[0.4em] flex items-center gap-2"
              >
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 font-mono text-teal-500">{" >>>"}</span>
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-8">
            {themeVisible && (
              <button
                onClick={() => onOpenThemeReveal()}
                className="px-4 py-2 rounded-lg bg-teal-500/5 border border-teal-500/20 text-teal-400 text-[9px] font-black tracking-[0.3em] hover:bg-teal-500/10 transition-all uppercase"
              >
                THEME_SIGNAL
              </button>
            )}
 
            <button
              onClick={() => onOpenRegistrations()}
              className="px-10 py-3 bg-teal-500 text-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition-all transform active:scale-95 border-none"
            >
              Access_Pass {" >>>"}
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
