import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
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
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [180, 260]
            });

            const colors = {
                bg: [2, 6, 23],        // Space #020617
                card: [15, 23, 42],    // Slate 900
                teal: [45, 212, 191],  // Teal 400
                aqua: [8, 145, 178],   // Aqua 700
                text: [248, 250, 252], // Starlight
                dim: [148, 163, 184]   // Slate 400
            };

            const drawTicketBase = (pageDoc) => {
                // 1. OUTER SPACE BACKGROUND
                pageDoc.setFillColor(...colors.bg);
                pageDoc.rect(0, 0, 180, 260, 'F');

                // 2. TECH HUD ACCENTS (Decorative corners)
                pageDoc.setDrawColor(...colors.teal);
                pageDoc.setLineWidth(0.5);
                // Top Left
                pageDoc.line(10, 10, 25, 10);
                pageDoc.line(10, 10, 10, 25);
                // Top Right
                pageDoc.line(155, 10, 170, 10);
                pageDoc.line(170, 10, 170, 25);
                // Bottom Left
                pageDoc.line(10, 250, 25, 250);
                pageDoc.line(10, 250, 10, 235);
                // Bottom Right
                pageDoc.line(155, 250, 170, 250);
                pageDoc.line(170, 250, 170, 235);

                // 3. MAIN CARD GLASS
                pageDoc.setFillColor(...colors.card);
                pageDoc.roundedRect(12, 12, 156, 236, 10, 10, 'F');
                pageDoc.setDrawColor(45, 212, 191, 50); // Semi-transparent teal
                pageDoc.roundedRect(12, 12, 156, 236, 10, 10, 'D');

                // 4. HEADER SECTION
                pageDoc.setFillColor(...colors.bg);
                pageDoc.rect(12, 12, 156, 50, 'F');
                pageDoc.setDrawColor(...colors.teal);
                pageDoc.line(12, 62, 168, 62);

                // Holographic Text Effect (Shifted layers)
                pageDoc.setFont("helvetica", "bold");
                pageDoc.setTextColor(8, 145, 178, 40); // Cyan glow
                pageDoc.setFontSize(26);
                pageDoc.text("ESTRALIS 2026", 83, 35, { align: "center", charSpace: 1 });

                pageDoc.setTextColor(255, 255, 255);
                pageDoc.text("ESTRALIS 2026", 83, 35, { align: "center", charSpace: 1 });

                pageDoc.setFontSize(8);
                pageDoc.setFont("helvetica", "normal");
                pageDoc.setTextColor(...colors.teal);
                pageDoc.text("THE INTERSTELLAR SYMPOSIUM", 70, 43, { align: "center", charSpace: 1.5 });

                pageDoc.setFontSize(7);
                pageDoc.setTextColor(...colors.dim);
                pageDoc.text("OFFICIAL SECTOR ADMISSION PASS // SECURE_ID: 2026-AST-R", 89, 50, { align: "center" });

                // 5. FOOTER DECOR
                pageDoc.setFont("helvetica", "italic");
                pageDoc.setFontSize(6);
                pageDoc.setTextColor(...colors.dim);
                pageDoc.text("PLEASE SUBMIT THE ACCESS PASS AT THE REGISTERATION DESK", 90, 243, { align: "center" });
            };

            // START PAGE 1
            drawTicketBase(doc);

            // TICKET CONTENT
            const startY = 80;

            // UTR / TRANSACTION ID Section
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...colors.teal);
            doc.text("TRANSACTION_ID //", 20, startY);

            doc.setFont("courier", "bold");
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            const ticketId = (registration.utr_number || registration.razorpay_payment_id || "PENDING").toUpperCase();
            doc.text(ticketId, 20, startY + 8);

            // Status Badge
            doc.setDrawColor(...colors.teal);
            doc.setLineWidth(0.5);
            doc.roundedRect(130, startY + 2, 30, 10, 2, 2, 'D');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...colors.teal);
            doc.text("VERIFIED", 145, startY + 9, { align: "center" });

            // EVENT TITLE (The Star of the Show)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(32);
            doc.setTextColor(255, 255, 255);
            doc.text(registration.event_title.toUpperCase(), 85, startY + 35, { align: "center", charSpace: 1 });

            // CATEGORY TAG
            doc.setFillColor(...colors.teal);
            const catText = (registration.category || "TECH").toUpperCase();
            const tagWidth = doc.getTextWidth(catText) + 10;
            doc.roundedRect(87 - (tagWidth / 2), startY + 40, tagWidth, 8, 4, 4, 'F');
            doc.setFontSize(8);
            doc.setTextColor(...colors.bg);
            doc.text(catText, 85, startY + 45.5, { align: "center", charSpace: 2 });

            // LOGISTICS (Location & Time)
            doc.setFillColor(30, 41, 59, 40);
            doc.roundedRect(20, startY + 55, 140, 30, 5, 5, 'F');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...colors.teal);
            doc.text("LOCATION", 30, startY + 65);
            doc.text("ARRIVAL_TIME", 100, startY + 65);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            const venueLines = doc.splitTextToSize(registration.event_location || "TBA", 60);
            doc.text(venueLines, 30, startY + 72);
            doc.text(registration.event_time || "TBA", 100, startY + 72);

            // PARTICIPANT DATA
            let currentY = startY + 90;

            doc.setDrawColor(...colors.teal);
            doc.line(20, currentY, 160, currentY);
            currentY += 10;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...colors.teal);
            doc.text("PARTICIPANT_IDENTIFIER //", 20, currentY);
            currentY += 10;

            if (registration.team_name) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(...colors.teal);
                doc.text(`TEAM: ${registration.team_name.toUpperCase()}`, 20, currentY);
                currentY += 7;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.text(registration.full_name.toUpperCase(), 20, currentY);
            currentY += 10;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...colors.dim);
            doc.text(`Institute: ${registration.college}`, 20, currentY);
            currentY += 6;
            doc.text(`Email: ${registration.email}`, 20, currentY);
            currentY += 5;
            doc.text(`Phone: ${registration.phone}`, 20, currentY);

            // FEE SECTION (Bottom Left)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...colors.teal);
            doc.text(registration.pass_type === 'Combo Pass' ? "COMBO_PASS_FEE" : "BASE_FEE", 20, 232);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            let feeText = registration.amount_paid ? registration.amount_paid.toString().replace(/₹/g, "Rs. ") : "Free";
            doc.text(feeText, 20, 240);

            // PAGE 2 (TEAM MEMBERS)
            const teamMembers = registration.team_members || [];
            if (teamMembers.length > 0) {
                doc.addPage([180, 260], 'portrait');
                drawTicketBase(doc);

                let teamY = 80;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(255, 255, 255);
                doc.text(registration.team_name ? `SQUAD: ${registration.team_name.toUpperCase()}` : "SQUAD MEMBERS", 90, teamY, { align: "center" });
                teamY += 10;
                doc.setDrawColor(...colors.teal);
                doc.line(40, teamY, 140, teamY);
                teamY += 15;

                teamMembers.forEach((m, i) => {
                    if (teamY > 220) {
                        doc.addPage([180, 260], 'portrait');
                        drawTicketBase(doc);
                        teamY = 80;
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    doc.setTextColor(...colors.teal);
                    doc.text(`${String(i + 2).padStart(2, '0')} //`, 25, teamY);

                    doc.setTextColor(255, 255, 255);
                    doc.text(m.fullName.toUpperCase(), 40, teamY);

                    teamY += 6;
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(...colors.dim);
                    doc.text(`${m.email} | ${m.phone}`, 40, teamY);

                    teamY += 12;
                });
            }

            doc.save(`Access_Pass_${safeName}.pdf`);

        } catch (err) {
            console.error("PDF Gen Error:", err);
            alert("Failed to generate PDF document.");
        }
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
