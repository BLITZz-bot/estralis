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

    // Auto-search if initialEmail is provided (deep link)
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
                        // Auto-download IF we have exactly one result and flag is set
                        if (autoDownload && data.data.length === 1) {
                            setTimeout(() => {
                                handleDownloadReceipt(data.data[0]);
                            }, 500); // Small delay to ensure allEvents is ready
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

    const handleDownloadReceipt = (registration) => {
        // Find the full event details to rebuild the receipt
        const event = allEvents.find(e => e.title === registration.event_title);

        if (!event) {
            alert("Could not find event details for this registration.");
            return;
        }

        try {
            const safeName = registration.full_name ? registration.full_name.replace(/\s+/g, '_') : 'Attendee';
        try {
            const front = document.getElementById('pass-page-front');
            const back = document.getElementById('pass-page-back');
            if (!front) throw new Error("Front template not found");

            const pdf = new jsPDF('p', 'mm', [100, 210]); // Vertical ticket format

            // Page 1: Leader
            front.style.display = 'block';
            html2canvas(front, { scale: 2, useCORS: true, backgroundColor: '#020617' }).then(canvasFront => {
                front.style.display = 'none';
                const imgFront = canvasFront.toDataURL('image/png');
                pdf.addImage(imgFront, 'PNG', 0, 0, 100, 210);

                // Page 2: Squad (If exists)
                const teamMembers = registration.team_members || [];
                if (teamMembers.length > 0 && back) {
                    back.style.display = 'block';
                    html2canvas(back, { scale: 2, useCORS: true, backgroundColor: '#020617' }).then(canvasBack => {
                        back.style.display = 'none';
                        const imgBack = canvasBack.toDataURL('image/png');
                        pdf.addPage([100, 210], 'p');
                        pdf.addImage(imgBack, 'PNG', 0, 0, 100, 210);
                        pdf.save(`Estralis_Pass_${registration.full_name.replace(/\s+/g, '_')}.pdf`);
                    });
                } else {
                    pdf.save(`Estralis_Pass_${registration.full_name.replace(/\s+/g, '_')}.pdf`);
                }
            });
        } catch (err) {
            console.error("PDF Gen Error:", err);
            alert("Failed to generate PDF document.");
        }
    };

    // Prepare data for the hidden capture templates
    const teamMembers = results.length > 0 ? (results.find(r => r.id === results[0].id)?.team_members || []) : [];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* MODAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl astral-glass p-6 sm:p-10 shadow-2xl shadow-teal-900/30 overflow-y-auto max-h-[90vh] border-teal-500/20"
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="astral-heading text-3xl font-bold mb-2 uppercase tracking-tight">
                            Your Registrations
                        </h2>
                        <p className="text-white/60 font-tech mb-8">
                            Enter the Leader's email address used during registration to find your access pass.
                        </p>

                        {/* SEARCH FORM */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
                            <input
                                type="email"
                                required
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="name@college.edu"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition font-tech"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all font-astral disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </form>

                        {/* ERROR MSG */}
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">
                                {error}
                            </motion.div>
                        )}

                        {/* RESULTS */}
                        {results.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white/90 mb-4 border-b border-white/10 pb-2">
                                    Found {results.length} Registration{results.length > 1 ? 's' : ''}
                                </h3>

                                {results.map((reg) => (
                                    <motion.div
                                        key={reg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group"
                                    >
                                        <div>
                                            <h4 className="font-astral text-lg text-white mb-2 tracking-wider group-hover:text-teal-400 transition-colors uppercase">{reg.event_title}</h4>
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

                        {/* Hidden Access Pass Templates for Multi-Page Capture */}
                        <div id="pass-templates-container" style={{ position: 'fixed', left: '-9999px', top: 0 }}>
                            {results.map((reg) => {
                                const event = allEvents.find(e => e.title === reg.event_title) || {};
                                const teamMembers = reg.team_members || [];
                                
                                return (
                                    <div key={`templates-${reg.id}`}>
                                        {/* PAGE 1: LEADER */}
                                        <div id="pass-page-front" className="w-[400px] bg-[#020617] text-white overflow-hidden" style={{ minHeight: '800px', display: 'none', backgroundColor: '#020617', color: '#ffffff', fontFamily: 'sans-serif' }}>
                                            <div className="p-8 m-4 rounded-[2rem] relative overflow-hidden h-[760px]" style={{ backgroundColor: '#0a0f1e', border: '4px solid rgba(45, 212, 191, 0.3)' }}>
                                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', filter: 'blur(40px)' }} />
                                                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)', filter: 'blur(40px)' }} />
                                                
                                                <div className="flex justify-between items-start mb-10 pb-6" style={{ borderBottom: '1px solid rgba(45, 212, 191, 0.2)' }}>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2dd4bf' }} />
                                                            <span style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(45, 212, 191, 0.8)' }}>ACCESS_PASS // 2026</span>
                                                        </div>
                                                        <h2 style={{ fontSize: '1.875rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.025em', color: '#ffffff', textTransform: 'uppercase' }}>ESTRALIS</h2>
                                                    </div>
                                                    <div className="text-right">
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>SECTOR</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{event.category || "TECH"}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-10 text-center py-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(45, 212, 191, 0.5)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '0.5rem', display: 'block' }}>TRANSMISSION_TARGET</span>
                                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>{event.title}</h3>
                                                </div>

                                                <div className="space-y-10 mb-12">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1 h-8" style={{ backgroundColor: '#2dd4bf' }} />
                                                        <div>
                                                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PRIMARY_PARTICIPANT</span>
                                                            <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{reg.full_name}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-6 pl-4">
                                                        <div>
                                                            <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>COLLEGE_ID</span>
                                                            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>{reg.college}</p>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>TRANS_ID // UTR</span>
                                                            <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#2dd4bf', fontWeight: '700' }}>{reg.utr_number || reg.razorpay_payment_id}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-8 flex justify-between items-end absolute bottom-12 left-8 right-8" style={{ borderTop: '1px solid rgba(45, 212, 191, 0.2)' }}>
                                                    <div className="space-y-2">
                                                        <div style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TIMESTAMP</div>
                                                        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.4)' }}>{new Date(reg.timestamp).toLocaleString()}</div>
                                                    </div>
                                                    <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                        <div style={{ fontSize: '8px', color: 'rgba(45, 212, 191, 0.4)', textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1' }}>SECURE<br/>SCAN</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PAGE 2: SQUAD */}
                                        <div id="pass-page-back" className="w-[400px] bg-[#020617] text-white overflow-hidden" style={{ minHeight: '800px', display: 'none', backgroundColor: '#020617', color: '#ffffff', fontFamily: 'sans-serif' }}>
                                            <div className="p-8 m-4 rounded-[2rem] relative overflow-hidden h-[760px]" style={{ backgroundColor: '#0a0f1e', border: '4px solid rgba(45, 212, 191, 0.3)' }}>
                                                <div className="flex justify-between items-start mb-10 pb-6" style={{ borderBottom: '1px solid rgba(45, 212, 191, 0.2)' }}>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2dd4bf' }} />
                                                            <span style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(45, 212, 191, 0.8)' }}>SQUAD_ROSTER // 2026</span>
                                                        </div>
                                                        <h2 style={{ fontSize: '1.875rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.025em', color: '#ffffff', textTransform: 'uppercase' }}>ESTRALIS</h2>
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    {reg.team_name && (
                                                        <div className="mb-8 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                                                            <span style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>OFFICIAL_TEAM</span>
                                                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2dd4bf', textTransform: 'uppercase' }}>{reg.team_name}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-6">
                                                        {teamMembers.map((m, i) => (
                                                            <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                                                                <div className="flex items-baseline gap-3 mb-1">
                                                                    <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: '900' }}>#{i + 1}</span>
                                                                    <p style={{ fontSize: '0.9rem', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>{m.fullName}</p>
                                                                </div>
                                                                <p style={{ fontSize: '9px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '1.5rem' }}>{m.college || reg.college}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-auto absolute bottom-12 left-8 right-8 text-center">
                                                    <span style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.1)', textTransform: 'uppercase', letterSpacing: '0.5em' }}>THANKS_FOR_REGISTERING</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
