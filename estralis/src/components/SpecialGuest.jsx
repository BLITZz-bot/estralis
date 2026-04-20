import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import { EventModal } from "./Schedule";

export const DJ_EVENT_DATA = {
    time: "06:00 PM",
    title: "ARTIST PERFORMANCE AND DJ NIGHT",
    location: "Main stage, GCEM Campus",
    description: "Step into the spotlight and let your passion ignite the stage, where every move tells a story and every rhythm captivates the soul. Witness an electrifying showcase of talent, energy, and grace, as dancers compete to turn dreams into motion.",
    category: "Fun",
    minTeamSize: 1,
    maxTeamSize: 20,
    rules: ["ID CARD IS MANDATORY"],
    coordinators: ["STAR IS REVEALED SOON – "],
    registerLink: "#",
    fee: "₹400",
};

const SpecialGuest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);

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
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* LEFT COLUMN: TEXT SECTION */}
                        <div className="flex flex-col space-y-10 order-2 lg:order-1">

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

                            {/* Stats Row */}
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

                            {/* Action + Barcode Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex items-center gap-12 pt-8"
                            >
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-teal-500 text-black px-10 py-5 font-black uppercase text-xs tracking-[0.2em] transform transition hover:scale-105 active:scale-95 shadow-[0_0_30px_#2dd4bf55]"
                                >
                                    Register Now
                                </button>

                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: IMAGE SECTION */}
                        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end items-start pt-4 lg:pt-0">

                            {/* Year Badge */}
                            <div className="absolute top-4 right-3 lg:right-0 z-20 bg-black text-white px-5 py-2 font-black text-[10px] tracking-[0.3em] border-l-4 border-teal-500 shadow-xl">
                                2026
                            </div>

                            {/* Main Image Container */}
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 4.5, ease: [0.22, 1, 0.36, 1] }}
                                className="relative group w-full max-w-[400px]"
                            >
                                {/* Artist Name Reveal */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -top-16 left-0 z-20"
                                >
                                    <span
                                        className="block text-teal-400 text-xl md:text-2xl mb-[-8px] ml-1"
                                        style={{ fontFamily: "'Playball', cursive" }}
                                    >
                                        Featuring
                                    </span>
                                    <h4
                                        className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none"
                                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                                    >
                                        CHANDAN <span className="text-teal-400">SHETTY</span>
                                    </h4>
                                </motion.div>

                                <div className="relative aspect-[3/4] lg:h-[65vh] overflow-hidden bg-[#0a0a0a] shadow-2xl">
                                    {/* Secondary Glow background */}
                                    <div className="absolute inset-0 bg-teal-500/5 mix-blend-color" />

                                    <img
                                        src="/art.png"
                                        alt="Face of Estralis"
                                        className="w-full h-full object-cover object-top transition-transform duration-[2s] group-hover:scale-105"
                                    />

                                </div>
                            </motion.div>
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
