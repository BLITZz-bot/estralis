import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationForm from "./RegistrationForm";

const LUCKY_DRAW_EVENT = {
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
    coordinators: ["Akash - 9187645802"],
    date: "May 15",
    time: "03:00 PM",
    location: "Main Stage",
    minTeamSize: 1,
    maxTeamSize: 1
};

export default function LuckyDraw() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="fixed inset-0 bg-[#020617] text-white overflow-y-auto">
            {/* Animated background glows */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
                    style={{ background: "radial-gradient(ellipse at top, rgba(234,179,8,0.08) 0%, transparent 65%)" }} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px]"
                    style={{ background: "radial-gradient(ellipse at bottom right, rgba(234,179,8,0.05) 0%, transparent 65%)" }} />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] -translate-y-1/2"
                    style={{ background: "radial-gradient(ellipse at left, rgba(45,212,191,0.04) 0%, transparent 65%)" }} />
            </div>

            {/* Floating particles */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            background: i % 3 === 0 ? '#eab308' : '#2dd4bf',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float-particle ${4 + Math.random() * 6}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-3"
                >
                    <p className="text-[10px] font-black tracking-[0.5em] text-yellow-400/60 uppercase">
                        Estralis 2026 // Special Event
                    </p>
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                            BUMPER
                        </h1>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter"
                            style={{ background: "linear-gradient(135deg, #eab308, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            LUCKY DRAW
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm font-medium max-w-md mx-auto leading-relaxed mt-4">
                        {LUCKY_DRAW_EVENT.description}
                    </p>
                </motion.div>

                {/* Key Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-3 gap-4"
                >
                    {[
                        { label: "TICKET_FEE", value: LUCKY_DRAW_EVENT.fee, highlight: true },
                        { label: "DATE", value: LUCKY_DRAW_EVENT.date },
                        { label: "TIME", value: LUCKY_DRAW_EVENT.time },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`rounded-2xl p-5 text-center border ${item.highlight
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : 'bg-white/[0.03] border-white/10'
                            }`}
                        >
                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${item.highlight ? 'text-yellow-400/60' : 'text-gray-500'}`}>
                                {item.label}
                            </p>
                            <p className={`text-xl font-black ${item.highlight ? 'text-yellow-400' : 'text-white'}`}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Location */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4"
                >
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Location</p>
                        <p className="text-white font-bold text-sm">{LUCKY_DRAW_EVENT.location}, GCEM Campus</p>
                    </div>
                </motion.div>

                {/* Rules */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-6 rounded-full bg-yellow-400" />
                        <h2 className="text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase">
                            Rules & Guidelines
                        </h2>
                    </div>
                    <ul className="space-y-3">
                        {LUCKY_DRAW_EVENT.rules.map((rule, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-yellow-400/50 font-black text-xs mt-0.5 flex-shrink-0">
                                    {String(i + 1).padStart(2, '0')}.
                                </span>
                                <p className="text-gray-300 text-sm leading-relaxed">{rule}</p>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Coordinators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-6 rounded-full bg-teal-400" />
                        <h2 className="text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase">
                            Event Coordinators
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {LUCKY_DRAW_EVENT.coordinators.map((coord, i) => {
                            const [name, phone] = coord.split(' - ');
                            return (
                                <a
                                    key={i}
                                    href={`tel:${phone}`}
                                    className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-teal-500/30 hover:bg-teal-500/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                                        <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-sm">{name}</p>
                                        <p className="text-teal-400 text-xs font-bold tracking-wide">{phone}</p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* UPI / Payment info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 text-center space-y-2"
                >
                    <p className="text-[10px] font-black tracking-[0.3em] text-yellow-400/60 uppercase">Payment Instructions</p>
                    <p className="text-white text-sm leading-relaxed">
                        Pay <span className="text-yellow-400 font-black">₹100</span> per ticket via UPI to the coordinator. 
                        Take a screenshot of the payment, note your UTR/Transaction ID, and register below.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="text-center pb-10"
                >
                    <button
                        id="lucky-draw-register-btn"
                        onClick={() => setShowForm(true)}
                        className="relative inline-flex items-center gap-3 px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-[0.2em] text-black transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                            background: "linear-gradient(135deg, #eab308, #f59e0b)",
                            boxShadow: "0 0 40px rgba(234,179,8,0.4), 0 0 80px rgba(234,179,8,0.15)"
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        GET MY TICKET
                    </button>
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-4">
                        Only ₹100 per ticket // Draw at Closing Ceremony
                    </p>
                </motion.div>

                {/* Footer */}
                <div className="text-center opacity-30 pb-6">
                    <p className="font-mono text-[8px] tracking-widest uppercase">
                        Estralis 2026 // GCEM, Bengaluru // Official Lucky Draw Portal
                    </p>
                </div>
            </div>

            {/* Registration Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <RegistrationForm
                        event={LUCKY_DRAW_EVENT}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </AnimatePresence>

            <style>{`
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
                    33% { transform: translateY(-15px) translateX(8px); opacity: 0.4; }
                    66% { transform: translateY(8px) translateX(-5px); opacity: 0.15; }
                }
            `}</style>
        </div>
    );
}
