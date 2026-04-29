import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import RegistrationForm from "./RegistrationForm";
import { EventModal } from "./Schedule";

import { DJ_EVENT_DATA } from "../data/djEventData";

const SpecialGuest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [slotInfo, setSlotInfo] = useState(null);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const title = DJ_EVENT_DATA.title.trim().toUpperCase();
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/slots-status?eventTitle=${encodeURIComponent(title)}`);
                const data = await res.json();
                if (data.success && data.isLimited) {
                    setSlotInfo(data);
                }
            } catch (err) {
                console.error("Special Guest slot fetch err:", err);
            }
        };
        fetchSlots();
        const interval = setInterval(fetchSlots, 60000); // 60s auto-refresh (reduced from 30s for mobile)
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <section
                id="special-guest"
                className="relative min-h-screen py-20 flex flex-col items-center justify-center overflow-hidden bg-[#020617]"
            >
                {/* Background Texture/Aura */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-[500px] bg-teal-500/10 blur-[150px] -translate-y-1/2" />
                </div>

                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    {/* 2-Column Grid Layout - Increased Gap to push image right */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-center">

                        {/* LEFT COLUMN: TEXT SECTION */}
                        <div className="flex flex-col space-y-6 order-1 lg:order-1">

                            {/* Heading Group */}
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                                className="relative"
                            >
                                <span
                                    className="block text-teal-400 text-4xl md:text-5xl lg:text-4xl mb-[-10px] ml-1"
                                    style={{ fontFamily: "'Playball', cursive" }}
                                >
                                    Artist Performance &
                                </span>
                                <h2
                                    className="text-white text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none"
                                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                                >
                                    DJ NIGHT
                                </h2>
                                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-32 bg-teal-500 shadow-[0_0_15px_#2dd4bf]" />
                            </motion.div>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="max-w-md text-white/50 text-sm md:text-base leading-relaxed tracking-wide font-medium border-l border-white/10 pl-6"
                            >
                                Prepare for the most electrifying night of the festival. Join thousands of fans as the galaxy's finest artist takes the main stage for a journey through rhythm and light.
                            </motion.p>

                            {/* Desktop Stats & Action (Original Position) */}
                            <div className="hidden lg:flex flex-row items-center gap-12">
                                {/* Price */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="flex flex-wrap gap-12 pt-8"
                                >
                                    <div className="flex flex-col gap-1 border-r border-white/10 pr-12">
                                        <span className="text-[10px] uppercase tracking-widest text-white/30 font-black">Reg Fees</span>
                                        <span className="text-4xl font-black text-teal-400 tracking-tighter">₹400</span>
                                    </div>
                                </motion.div>

                                {/* Action Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="flex items-center gap-12 pt-8"
                                >
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={`${slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0) ? 'bg-red-600' : 'bg-teal-500'} text-black px-10 py-5 font-black uppercase text-xs tracking-[0.2em] transform transition hover:scale-105 active:scale-95 shadow-[0_0_30px_#2dd4bf55]`}
                                    >
                                        {slotInfo && slotInfo.isManualOpen === false ? 'SOLD OUT' : (slotInfo && slotInfo.slotsLeft <= 0 ? 'SOLD OUT' : 'BUY TICKETS NOW')}
                                    </button>
                                </motion.div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: IMAGE SECTION */}
                        <div className="relative order-2 lg:order-2 flex flex-col items-center lg:items-end pt-4 lg:pt-0">

                            {/* Year Badge */}
                            <div className="absolute top-4 right-3 lg:right-0 z-20 bg-black text-white px-5 py-2 font-black text-[10px] tracking-[0.3em] border-l-4 border-teal-500 shadow-xl">
                                2026
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-16 sm:gap-8 w-full justify-center lg:justify-end mt-20 sm:mt-16">
                                {/* Main Image Container */}
                                <motion.div
                                    initial={{ opacity: 0, x: 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 1.0 : 4.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative group w-full sm:w-1/2 max-w-[280px] sm:max-w-[320px]"
                                >
                                    {/* Artist Name Reveal */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute -top-12 left-0 z-20 w-full px-1"
                                    >
                                        <span
                                            className="block text-teal-400 text-sm md:text-lg mb-[-4px]"
                                            style={{ fontFamily: "'Playball', cursive" }}
                                        >
                                            Featuring
                                        </span>
                                        <h4
                                            className="text-white text-lg md:text-2xl font-black uppercase tracking-tighter leading-tight"
                                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                                        >
                                            CHANDAN <span className="text-teal-400">SHETTY</span>
                                        </h4>
                                    </motion.div>

                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] shadow-2xl">
                                        {/* Secondary Glow background */}
                                        <div className="absolute inset-0 bg-teal-500/5 mix-blend-color" />

                                        <img
                                            src="/art.webp"
                                            alt="Face of Estralis"
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover object-top"
                                        />

                                    </div>
                                </motion.div>

                                {/* Naman Image Section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 1.0 : 4.5, ease: [0.22, 1, 0.36, 1], delay: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.2 : 0.5 }}
                                    className="relative group w-full sm:w-1/2 max-w-[280px] sm:max-w-[320px]"
                                >
                                    {/* Artist Name Reveal */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute -top-12 left-0 z-20 w-full px-1"
                                    >
                                        <span
                                            className="block text-teal-400 text-sm md:text-lg mb-[-4px]"
                                            style={{ fontFamily: "'Playball', cursive" }}
                                        >
                                            DJ BY
                                        </span>
                                        <h4
                                            className="text-white text-lg md:text-2xl font-black uppercase tracking-tighter leading-tight"
                                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                                        >
                                            NAUMAN <span className="text-teal-400"></span>
                                        </h4>
                                    </motion.div>

                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] shadow-2xl">
                                        <div className="absolute inset-0 bg-teal-500/5 mix-blend-color" />
                                        <img
                                            src="/nama.webp"
                                            alt="Naman"
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover object-top"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Mobile Stats Row & Action (Visible only on Mobile) */}
                            <div className="flex lg:hidden flex-row items-center justify-between w-full max-w-[280px] sm:max-w-[400px] gap-6 pt-8 border-t border-white/5 mt-4">
                                {/* Price */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="flex flex-col gap-1"
                                >
                                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-black">Reg Fees</span>
                                    <span className="text-4xl font-black text-teal-400 tracking-tighter">₹400</span>
                                </motion.div>

                                {/* Action Button */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="flex-1"
                                >
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={`w-full ${slotInfo && (slotInfo.isManualOpen === false || slotInfo.slotsLeft <= 0) ? 'bg-red-600' : 'bg-teal-500'} text-black px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em] transform transition hover:scale-105 active:scale-95 shadow-[0_0_30px_#2dd4bf55]`}
                                    >
                                        {slotInfo && slotInfo.isManualOpen === false ? 'SOLD OUT' : (slotInfo && slotInfo.slotsLeft <= 0 ? 'SOLD OUT' : 'BUY TICKETS NOW')}
                                    </button>
                                </motion.div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <AnimatePresence>
                {showRegistration ? (
                    <RegistrationForm
                        key="special-registration"
                        event={DJ_EVENT_DATA}
                        onClose={() => setShowRegistration(false)}
                    />
                ) : isModalOpen ? (
                    <EventModal
                        key="special-modal"
                        event={DJ_EVENT_DATA}
                        isEventOpen={true} // Standalone is always open by default
                        onClose={() => setIsModalOpen(false)}
                        onRegister={() => {
                            setIsModalOpen(false);
                            setShowRegistration(true);
                        }}
                        overrideTheme={{
                            text: "text-teal-400",
                            hoverText: "group-hover:text-teal-400",
                            borderB: "border-b-teal-500/10",
                            bg: "bg-teal-500",
                            hoverBg: "hover:bg-teal-500/10",
                            borderL: "border-l-teal-500",
                            bgSoft: "bg-teal-500/10",
                            accent: "teal-500"
                        }}
                    />
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default SpecialGuest;
;
