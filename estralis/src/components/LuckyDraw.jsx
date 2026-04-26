import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationForm from "./RegistrationForm";
import StarBackground from "./StarBackground";
import CursorGlow from "./CursorGlow";

export default function LuckyDraw() {
    const [showRegistration, setShowRegistration] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/status?t=${Date.now()}`);
                const data = await res.json();
                if (data.success) {
                    const status = data.data.find(s => s.title === "BUMPER LUCKY DRAW");
                    if (status) {
                        setIsOpen(status.is_open);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch lucky draw status", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const luckyDrawEvent = {
        title: "BUMPER LUCKY DRAW",
        category: "SPECIAL",
        fee: "₹100",
        description: "Stand a chance to win massive prizes in the Estralis 2026 Bumper Lucky Draw. One ticket, multiple possibilities. Don't miss out on the grandest opportunity of the festival!",
        rules: [
            "Each ticket is valid for a single entry into the lucky draw.",
            "Multiple tickets can be purchased using different email addresses.",
            "The draw will be conducted live on the main stage during the closing ceremony.",
            "Winners must be present at the venue or reachable via the provided phone number to claim the prize.",
            "The decision of the organizing committee will be final and binding.",
            "Tickets are non-refundable and non-transferable."
        ],
        coordinators: ["Vinay - 9380661129", "Dheeraj - 9686508926"],
        date: "May 15",
        time: "03:00 PM",
        location: "Main Stage",
        minTeamSize: 1,
        maxTeamSize: 1
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
            <div className="noise-overlay fixed inset-0 pointer-events-none z-50 opacity-20" />
            <StarBackground />
            <CursorGlow />

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none -z-10"
                style={{ background: "radial-gradient(ellipse at top left, rgba(245,158,11,0.05) 0%, transparent 65%)" }} />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] pointer-events-none -z-10"
                style={{ background: "radial-gradient(ellipse at bottom right, rgba(245,158,11,0.05) 0%, transparent 65%)" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-[1px] w-12 bg-amber-500" />
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase text-amber-500 font-astral">
                            ESTRALIS_2026 // BUMPER_OFFER
                        </span>
                        <div className="h-[1px] w-12 bg-amber-500" />
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none mb-6 uppercase" 
                        style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                        LUCKY <span className="text-amber-500">DRAW</span>
                    </h1>
                    
                    <p className="saarang-serif text-xl md:text-2xl text-white/40 italic max-w-2xl mx-auto">
                        "Your destiny is just one transmission away. Decode the jackpot."
                    </p>
                </motion.div>

                {/* Main Content Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                    {/* Rules & Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="astral-glass p-8 md:p-12 border-l-4 border-l-amber-500 space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl saarang-serif italic text-white mb-8">Event Protocol</h2>
                            <div className="space-y-6">
                                {luckyDrawEvent.rules.map((rule, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <span className="text-xl saarang-serif text-amber-500/60 italic font-bold">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        <p className="text-white/70 leading-relaxed tracking-wide pt-1">
                                            {rule}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mb-3">Registration Fee</p>
                                <p className="text-4xl font-black text-amber-500">{luckyDrawEvent.fee}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mb-3">Support Concierge</p>
                                <div className="space-y-1">
                                    {luckyDrawEvent.coordinators.map((c, i) => (
                                        <p key={i} className="text-sm font-bold text-white/80">{c}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual / CTA */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative flex flex-col items-center justify-center gap-12"
                    >
                        {/* Interactive Ticket Visual */}
                        <div className="relative group w-full max-w-md aspect-[1.6/1] astral-glass border-amber-500/20 overflow-hidden rounded-[2rem] flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="text-center relative z-10">
                                <div className="text-[10vw] font-black text-amber-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                                    JACKPOT
                                </div>
                                <h3 className="text-4xl font-black tracking-tighter text-white mb-2">BUMPER_TICKET</h3>
                                <p className="text-amber-500 font-bold tracking-[0.3em] text-xs">SECURE_ID: 2026-LD-XXX</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsOpen && setShowRegistration(true)}
                            disabled={!isOpen || isLoading}
                            className={`w-full py-8 text-black text-xl font-black tracking-[0.3em] uppercase rounded-3xl transition-all duration-500 active:scale-95 shadow-[0_0_50px_rgba(245,158,11,0.3)] ${
                                !isOpen 
                                ? 'bg-red-600/20 text-red-500 border border-red-500/30 cursor-not-allowed shadow-none' 
                                : 'bg-amber-500 hover:bg-white hover:scale-[1.02]'
                            }`}
                        >
                            {isLoading ? "TRANSMITTING..." : isOpen ? "Confirm Registry_" : "REGISTRATION CLOSED"}
                        </button>

                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] text-center max-w-xs">
                            Secure your position in the draw. Multiple transmissions allowed for higher probability.
                        </p>
                    </motion.div>
                </div>

                {/* Footer Transmission */}
                <div className="mt-20 opacity-20 text-center">
                    <p className="font-mono text-[10px] tracking-[0.5em] uppercase">
                        Estralis Secure Transmission // Lucky Draw Protocol 2026.LD
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {showRegistration && (
                    <RegistrationForm 
                        event={luckyDrawEvent}
                        onClose={() => setShowRegistration(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
