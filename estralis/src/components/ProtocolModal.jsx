import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProtocolModal = ({ isOpen, onClose, onAccept }) => {
    const rules = [
        "Participation is open to verified students from recognized institutions.",
        "A valid college ID and registration pass are mandatory for entry.",
        "Respect the venue and follow the instructions of the staff and coordinators.",
        "Any form of misconduct, harassment, or damage to property will lead to immediate disqualification.",
        "Decisions made by the judges and organizing committee are final and binding.",
        "Registrations are non-refundable and non-transferable."
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 1.1, y: 0, opacity: 0 }}
                        className="w-full max-w-2xl astral-glass p-8 md:p-12 flex flex-col items-center text-center space-y-8"
                    >
                        <div className="space-y-2">
                            <span className="astral-eyebrow text-teal-500 uppercase">System Protocol</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter astral-heading">Guidelines</h2>
                        </div>

                        <div className="w-full space-y-4 text-left border-y border-white/5 py-8 max-h-[50vh] overflow-y-auto custom-scrollbar pr-4">
                            {rules.map((rule, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4 group"
                                >
                                    <span className="text-teal-500 font-astral text-xs mt-1">0{index + 1}</span>
                                    <p className="text-white/70 font-tech text-sm leading-relaxed group-hover:text-white transition-colors">
                                        {rule}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button
                                onClick={() => {
                                    onAccept();
                                    onClose();
                                }}
                                className="px-10 py-5 bg-teal-500 text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(45,212,191,0.2)] font-astral"
                            >
                                I ACCEPT THE PROTOCOL
                            </button>
                            <button
                                onClick={onClose}
                                className="px-10 py-5 bg-white/5 text-white/40 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all font-astral"
                            >
                                ABORT
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProtocolModal;
