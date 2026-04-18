import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { eventsDay1, eventsDay2 } from "./Schedule";

export default function MyRegistrations({ isOpen, onClose, initialEmail, autoDownload }) {
    const [searchEmail, setSearchEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState([]);
    const [activeDownloadReg, setActiveDownloadReg] = useState(null);

    const allEvents = [...eventsDay1, ...eventsDay2];

    useEffect(() => {
        if (isOpen) {
            window.history.pushState({ modal: "registrations" }, "");
            const handlePopState = (e) => {
                if (!e.state || e.state.modal !== "registrations") {
                    onClose();
                }
            };
            window.addEventListener("popstate", handlePopState);
            return () => {
                window.removeEventListener("popstate", handlePopState);
                if (window.history.state?.modal === "registrations") {
                    window.history.back();
                }
            };
        } else {
            setSearchEmail("");
            setResults([]);
            setError("");
            setLoading(false);
            setActiveDownloadReg(null);
        }
    }, [isOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchEmail) return;

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${encodeURIComponent(searchEmail)}`);
            const data = await res.json();

            if (res.ok && data.success) {
                setResults(data.data);
            } else {
                setError(data.message || "No registrations found.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-search logic
    useEffect(() => {
        if (isOpen && initialEmail && results.length === 0) {
            setSearchEmail(initialEmail);
            const triggerSearch = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${encodeURIComponent(initialEmail)}`);
                    const data = await res.json();
                    if (data.success) {
                        setResults(data.data);
                        if (autoDownload && data.data.length === 1) {
                            setTimeout(() => {
                                handleDownloadReceipt(data.data[0]);
                            }, 500);
                        }
                    }
                } catch (err) {
                    console.error("Auto-search failed", err);
                } finally {
                    setLoading(false);
                }
            };
            triggerSearch();
        }
    }, [isOpen, initialEmail]);

    const handleDownloadReceipt = async (registration) => {
        const event = allEvents.find(e => e.title === registration.event_title);
        if (!event) {
            alert("Could not find event details.");
            return;
        }

        // Set active registration for capture
        setActiveDownloadReg(registration);

        // Wait for React to render the template
        setTimeout(async () => {
            try {
                const front = document.getElementById('active-pass-front');
                const back = document.getElementById('active-pass-back');

                if (!front) {
                    console.error("Capture template not found in DOM");
                    return;
                }

                const pdf = new jsPDF('p', 'mm', [100, 210]);

                // PAGE 1 capture
                front.style.display = 'block';
                const canvasFront = await html2canvas(front, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: '#020617',
                    logging: false
                });
                front.style.display = 'none';

                const imgFront = canvasFront.toDataURL('image/png');
                pdf.addImage(imgFront, 'PNG', 0, 0, 100, 210);

                // PAGE 2 capture (if squad exists)
                const teamMembers = registration.team_members || [];
                if (teamMembers.length > 0 && back) {
                    back.style.display = 'block';
                    const canvasBack = await html2canvas(back, {
                        scale: 3,
                        useCORS: true,
                        backgroundColor: '#020617',
                        logging: false
                    });
                    back.style.display = 'none';

                    const imgBack = canvasBack.toDataURL('image/png');
                    pdf.addPage([100, 210], 'p');
                    pdf.addImage(imgBack, 'PNG', 0, 0, 100, 210);
                }

                pdf.save(`Estralis_Pass_2026_${registration.full_name.replace(/\s+/g, '_')}.pdf`);
            } catch (err) {
                console.error("PDF generation failed:", err);
                alert("Download failed. Please try again.");
            } finally {
                setActiveDownloadReg(null);
            }
        }, 300); // Increased delay slightly for hosted environments
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl astral-glass p-6 sm:p-10 shadow-2xl shadow-teal-900/30 overflow-y-auto max-h-[90vh] border-teal-500/20"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="astral-heading text-3xl font-bold mb-2 uppercase tracking-tight">Your Registrations</h2>
                        <p className="text-white/60 font-tech mb-8">Enter the Leader's email to access your pass.</p>

                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
                            <input
                                type="email"
                                required
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="name@college.edu"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 transition font-tech"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:bg-white transition-all font-astral"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </form>

                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">{error}</div>}

                        {results.length > 0 && (
                            <div className="space-y-4">
                                {results.map((reg) => (
                                    <motion.div key={reg.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group">
                                        <div>
                                            <h4 className="font-astral text-lg text-white mb-2 uppercase tracking-wider group-hover:text-teal-400 transition-colors uppercase">{reg.event_title}</h4>
                                            <p className="text-xs font-bold font-tech text-teal-400 mb-2 uppercase tracking-widest">{reg.full_name.toUpperCase()} <span className="text-white/30 font-normal">| {reg.pass_type || "Standard Pass"}</span></p>
                                            <p className="text-[10px] text-white/40 font-tech uppercase tracking-widest">Registered: {new Date(reg.timestamp).toLocaleDateString()}</p>
                                            <div className="flex items-center gap-2 mt-3">
                                                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                 <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] font-tech text-left">
                                                      Status: [Verified]
                                                 </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadReceipt(reg)}
                                            className="px-6 py-3 bg-white/10 hover:bg-teal-500 hover:text-black hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 m-0 sm:ml-auto font-astral"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            Download Pass
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* ACTIVE CAPTURE PORTAL (Mirroring RegistrationForm Design Precisely) */}
                        <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
                            {activeDownloadReg && (
                                <div id="active-capture-container">
                                    {/* PROFESSIONAL PAGE 1: LEADER */}
                                    <div id="active-pass-front" className="w-[400px] h-[840px] bg-[#020617] text-white overflow-hidden font-tech" style={{ display: 'none', backgroundColor: '#020617' }}>
                                        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 0%, #2dd4bf 0%, transparent 60%)' }} />
                                        <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 100%, #d946ef 0%, transparent 60%)' }} />
                                        
                                        <div className="m-4 h-[808px] rounded-[2.5rem] relative border-[0.5px] border-teal-500/30 overflow-hidden shadow-2xl" style={{ backgroundColor: 'rgba(10, 15, 30, 0.95)' }}>
                                            <div className="p-8 pb-10 border-b border-white/5 relative">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_10px_#2dd4bf]" />
                                                            <span style={{ fontSize: '7px', fontWeight: '900', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(45, 212, 191, 0.6)' }}>NETWORK_STATUS: CONNECTED // SEC_2026</span>
                                                        </div>
                                                        <h2 className="text-4xl font-extrabold italic tracking-tighter text-white uppercase font-astral">ESTRALIS</h2>
                                                        <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.4em', color: 'rgba(255, 255, 255, 0.3)', marginTop: '4px' }}>OFFICIAL_ACCESS_PASS</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] block mb-1">NODE_ID</span>
                                                        <span className="text-sm font-mono font-bold text-teal-400">#E26-{activeDownloadReg.id.toString().slice(-4)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 mx-8 p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
                                                <span className="text-[10px] font-black text-teal-500/40 uppercase tracking-[0.4em] mb-3 block text-center">TRANSMISSION_TARGET</span>
                                                <h3 className="text-3xl font-black text-white uppercase text-center tracking-tight mb-2">{activeDownloadReg.event_title}</h3>
                                                <div className="flex justify-center items-center gap-3">
                                                    <span className="w-10 h-[1px] bg-white/10" />
                                                    <span className="text-[10px] font-bold text-teal-400/80 uppercase tracking-widest">{activeDownloadReg.category || "TECH_ELITE"}</span>
                                                    <span className="w-10 h-[1px] bg-white/10" />
                                                </div>
                                            </div>

                                            <div className="mt-12 mx-8 space-y-10">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-[1.5px] h-12 bg-gradient-to-b from-teal-500 to-fuchsia-500" />
                                                    <div className="flex-1">
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '6px' }}>CORE_PARTICIPANT</span>
                                                        <p className="text-2xl font-black text-white uppercase tracking-wide leading-none">{activeDownloadReg.full_name}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-8 pl-4">
                                                    <div>
                                                        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.15)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '6px' }}>INSTITUTION_AFFILIATION</span>
                                                        <p className="text-md font-bold text-white/70 uppercase leading-snug">{activeDownloadReg.college}</p>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.15)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '6px' }}>AUTHENTICATION_ID // UTR</span>
                                                        <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
                                                            <p className="text-lg font-mono font-black text-teal-400 break-all">{activeDownloadReg.utr_number || activeDownloadReg.razorpay_payment_id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-10 left-8 right-8 flex justify-between items-end border-t border-white/5 pt-8">
                                                <div>
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block mb-2">SYSTEM_CLOCK</span>
                                                    <span className="text-[11px] font-mono text-white/50">{new Date(activeDownloadReg.timestamp).toLocaleString().toUpperCase()}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right pr-4 border-r border-white/10">
                                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block">STATUS</span>
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">VERIFIED</span>
                                                    </div>
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 p-1 flex items-center justify-center border border-white/10 relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
                                                        <div className="text-[7px] text-teal-500 font-black text-center uppercase tracking-tight leading-none z-10">GEN_TOKEN<br/>CRYPTO_SCAN</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PROFESSIONAL PAGE 2: SQUAD */}
                                    <div id="active-pass-back" className="w-[400px] h-[840px] bg-[#020617] text-white overflow-hidden font-tech" style={{ display: 'none', backgroundColor: '#020617' }}>
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2dd4bf 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                                        <div className="m-4 h-[808px] rounded-[2.5rem] relative border-[0.5px] border-fuchsia-500/30 overflow-hidden shadow-2xl" style={{ backgroundColor: 'rgba(10, 15, 30, 0.95)' }}>
                                            <div className="p-8 pb-8 border-b border-white/5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-fuchsia-500" />
                                                        <span className="w-1 h-1 rounded-full bg-fuchsia-500/50" />
                                                        <span className="w-1 h-1 rounded-full bg-fuchsia-500/20" />
                                                    </div>
                                                    <span style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(217, 70, 239, 0.6)' }}>SQUAD_ROSTER_MANIFEST</span>
                                                </div>
                                                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase font-astral">ESTRALIS</h2>
                                            </div>
                                            <div className="mt-6 mx-8">
                                                {activeDownloadReg.team_name && (
                                                    <div className="mb-10 p-5 rounded-2xl bg-fuchsia-500/5 border border-fuchsia-500/20 flex items-center justify-between">
                                                        <div>
                                                            <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>DESIGNATED_TEAM</span>
                                                            <p className="text-xl font-black text-fuchsia-400 uppercase tracking-wide">{activeDownloadReg.team_name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="space-y-6">
                                                    {(activeDownloadReg.team_members || []).map((m, i) => (
                                                        <div key={i} className="group flex items-center gap-5 p-4 rounded-2xl transition hover:bg-white/[0.02]">
                                                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-fuchsia-500 font-bold">{i + 1}</div>
                                                            <div className="flex-1">
                                                                <p className="text-md font-bold text-white uppercase truncate">{m.fullName}</p>
                                                                <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest truncate">{m.college || activeDownloadReg.college}</p>
                                                            </div>
                                                            <div className="w-2 h-2 rounded-full border border-fuchsia-500/30 group-hover:bg-fuchsia-500 shadow-sm" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-10 left-8 right-8 text-center">
                                                <div className="mb-6 flex justify-center gap-2">
                                                    {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-[1px] bg-white/10" />)}
                                                </div>
                                                <p style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.1)', textTransform: 'uppercase', letterSpacing: '0.6em' }}>PREPARE_FOR_ARRIVAL_2026</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
