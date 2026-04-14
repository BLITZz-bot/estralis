import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jsPDF } from "jspdf"
import JsBarcode from "jsbarcode"

export default function RegistrationForm({ event, onClose }) {
    const [step, setStep] = useState(1)
    const receiptRef = useRef(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [utrError, setUtrError] = useState("")
    const [teamMembers, setTeamMembers] = useState([])
    const [passType, setPassType] = useState('standard') // 'standard' or 'combo'
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        college: "",
        teamName: ""
    })

    const cat = event?.category || "Tech"
    
    const comboPassDetails = event?.comboPass || event?.ComboPass;
    const standardFeeString = event?.fee || event?.fees || (event?.prize === "Participation" ? "Free" : "₹150");

    const minTeamSize = event?.minTeamSize || 1;
    const maxTeamSize = event?.maxTeamSize || 1;
    const isTeamEvent = maxTeamSize > 1;

    useEffect(() => {
        // Initialize with minimum required team members (excluding leader)
        if (event && minTeamSize > 1) {
            const initialCount = Math.max(0, minTeamSize - 1);
            setTeamMembers(Array.from({ length: initialCount }, () => ({ fullName: "", email: "", phone: "", college: "" })));
        } else {
            setTeamMembers([]);
        }
    }, [event, minTeamSize]);

    const addMember = () => {
        if (teamMembers.length + 1 < maxTeamSize) {
            setTeamMembers([...teamMembers, { fullName: "", email: "", phone: "", college: "" }]);
        } else {
            alert(`Maximum squad size of ${maxTeamSize} reached.`);
        }
    };

    const removeMember = (index) => {
        if (teamMembers.length + 1 > minTeamSize) {
            const newMembers = [...teamMembers];
            newMembers.splice(index, 1);
            setTeamMembers(newMembers);
        } else {
            alert(`Minimum squad size of ${minTeamSize} required for this sector.`);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const amount = (passType === 'combo' && comboPassDetails) ? comboPassDetails : standardFeeString;
        
        try {
            const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, receipt: `reg_${Date.now()}` })
            });
            const { order } = await orderRes.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "ESTRALIS 2026",
                description: `Registration for ${event.title}`,
                image: "/logo.png", 
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                registrationData: {
                                    ...formData,
                                    eventTitle: event.title,
                                    category: event.category || "Tech",
                                    teamMembers,
                                    passType: passType === 'combo' ? "Combo Pass" : "Standard Pass",
                                    amountPaid: amount
                                }
                            })
                        });
                        
                        const result = await verifyRes.json();
                        if (result.success) {
                            setStep(3);
                        } else {
                            alert("Payment verification failed: " + result.message);
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        alert("Verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#14b8a6"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Order Error:", error);
            alert("Failed to initiate payment.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDownloadPDF = () => {
        setIsDownloading(true);
        // Simplified PDF generation logic for stability
        try {
            const doc = new jsPDF();
            doc.text(`ESTRALIS 2026 - ${event.title}`, 10, 10);
            doc.text(`Name: ${formData.fullName}`, 10, 20);
            doc.text(`Email: ${formData.email}`, 10, 30);
            doc.text(`Transaction ID: Verified via Razorpay`, 10, 40);
            doc.save(`Estralis_Pass_${formData.fullName}.pdf`);
        } finally {
            setIsDownloading(false);
        }
    }

    if (!event) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020617] flex flex-col overflow-y-auto w-full min-h-screen custom-scrollbar"
        >
            {/* Header */}
            <div className="relative p-8 flex items-center justify-between border-b border-teal-500/20 bg-black/40 backdrop-blur-xl z-20">
                <div>
                   <span className="text-[10px] font-black tracking-[0.4em] text-teal-500 uppercase block mb-1">Sector_Access_Protocol</span>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                       {event.title} <span className="text-teal-500">_Registry</span>
                   </h2>
                </div>
                <button
                    onClick={onClose}
                    className="w-12 h-12 flex items-center justify-center bg-teal-500 text-black hover:bg-white transition-all font-black text-xl"
                >
                    ✕
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-start p-8 md:p-16">
                {step === 1 && (
                    <motion.form
                        key="step1"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onSubmit={(e) => { e.preventDefault(); setStep(2); }}
                        className="w-full max-w-4xl space-y-12"
                    >
                        {/* Step Indicator */}
                        <div className="flex gap-4">
                           <div className="flex-1 h-1 bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                           <div className="flex-1 h-1 bg-white/10"></div>
                           <div className="flex-1 h-1 bg-white/10"></div>
                        </div>

                        {/* Basic Info */}
                        <div className="saarang-block bg-black p-8 md:p-12 space-y-12 border-4 border-white/5 hover:border-teal-500/30 transition-all">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Lead_Operator (Name)</label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-transparent border-b-2 border-white/10 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors uppercase font-bold text-xl" placeholder="Full Name" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Signal_Freq (Email)</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b-2 border-white/10 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors uppercase font-bold text-xl" placeholder="Email Address" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Comm_Link (Phone)</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-b-2 border-white/10 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors uppercase font-bold text-xl" placeholder="Phone Number" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Origin_Node (College)</label>
                                    <input required type="text" name="college" value={formData.college} onChange={handleChange} className="w-full bg-transparent border-b-2 border-white/10 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors uppercase font-bold text-xl" placeholder="College Name" />
                                </div>
                            </div>
                        </div>

                        {/* Team Section */}
                        {isTeamEvent && (
                             <div className="saarang-block bg-black p-8 md:p-12 space-y-12 border-4 border-white/5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black tracking-[0.4em] text-teal-500 uppercase flex items-center gap-4">
                                        <div className="w-6 h-[1px] bg-teal-500"></div> Squad_Encryption
                                    </h3>
                                    {teamMembers.length + 1 < maxTeamSize && (
                                        <button type="button" onClick={addMember} className="px-4 py-2 border border-teal-500 text-teal-400 text-[9px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-black transition-all">
                                            + Add_Operative
                                        </button>
                                    )}
                                </div>

                                {maxTeamSize > 1 && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Squad_ID (Team Name)</label>
                                        <input required type="text" name="teamName" value={formData.teamName} onChange={handleChange} className="w-full bg-transparent border-b-2 border-white/10 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors uppercase font-bold text-xl" placeholder="Team Name" />
                                    </div>
                                )}
                                
                                <div className="space-y-10">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="p-8 border border-white/10 bg-white/[0.02] relative group">
                                             <div className="flex justify-between items-center mb-8">
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-teal-400/60">Operative_{index + 2}</h4>
                                                <button type="button" onClick={() => removeMember(index)} className="text-red-500/40 hover:text-red-500 text-[9px] font-black uppercase tracking-widest">
                                                    [ Remove ]
                                                </button>
                                             </div>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Identify</label>
                                                    <input required type="text" value={member.fullName} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].fullName = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-teal-500 text-sm font-bold uppercase tracking-widest" placeholder="NAME" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Signal</label>
                                                    <input required type="email" value={member.email} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].email = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-teal-500 text-sm font-bold uppercase tracking-widest" placeholder="EMAIL" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Comm_Link</label>
                                                    <input required type="tel" value={member.phone} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].phone = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-teal-500 text-sm font-bold uppercase tracking-widest" placeholder="PHONE" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Origin_Node</label>
                                                    <input required type="text" value={member.college} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].college = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-teal-500 text-sm font-bold uppercase tracking-widest" placeholder="COLLEGE" />
                                                </div>
                                             </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}

                        <div className="flex flex-col items-center py-10">
                             <button type="submit" className="w-full max-w-md py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] hover:bg-teal-500 hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-all">
                                CONTINUE_REGISTRY {" >>>"}
                             </button>
                        </div>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full max-w-2xl space-y-12"
                    >
                        {/* Step Indicator */}
                        <div className="flex gap-4">
                           <div className="flex-1 h-1 bg-teal-500"></div>
                           <div className="flex-1 h-1 bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                           <div className="flex-1 h-1 bg-white/10"></div>
                        </div>

                        <div className="saarang-block bg-black p-12 text-center space-y-12 border-4 border-teal-500">
                             <div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Secure_Payment</h3>
                                <p className="text-teal-400/40 text-[10px] font-black uppercase tracking-[0.4em]">Razorpay // Total_Encryption</p>
                             </div>

                             <div className="space-y-4 text-left border-y border-white/10 py-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-white/40 uppercase">Sector</span>
                                    <span className="text-lg font-black text-white uppercase italic">{event.title}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-white/40 uppercase">Lead_Operator</span>
                                    <span className="text-lg font-black text-white uppercase italic">{formData.fullName}</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-white/5">
                                    <span className="text-[11px] font-black text-teal-400 uppercase tracking-widest">Access_Fee</span>
                                    <span className="text-4xl font-black text-teal-500 italic">{standardFeeString}</span>
                                </div>
                             </div>

                             <div className="space-y-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.5em] hover:bg-white transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? "PROCESSING..." : "AUTHORIZE_AND_SECURE " + ">>>"}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-teal-400 transition-colors">
                                    ← Modify_Parameters
                                </button>
                             </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-2xl text-center space-y-12"
                    >
                         <div className="saarang-block bg-black p-16 border-4 border-emerald-500">
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">ACCESS_GRANTED</h3>
                            <p className="saarang-serif text-emerald-400 text-2xl italic mb-12">Your sector has been secured.</p>
                            <div className="space-y-6 text-left border-t border-white/10 pt-10">
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-white/40 uppercase">Status</span>
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">S E C U R E D</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-white/40 uppercase">Sector</span>
                                    <span className="text-sm font-black text-white uppercase">{event.title}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button onClick={handleDownloadPDF} disabled={isDownloading} className="px-12 py-6 bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-all">
                                {isDownloading ? "DOWNLOADING..." : "DOWNLOAD_PASS_PDF"}
                            </button>
                            <button onClick={onClose} className="px-12 py-6 bg-white/[0.05] text-white/40 border-2 border-white/10 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all">
                                RETURN_TO_ORBIT
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
