import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jsPDF } from "jspdf"
import JsBarcode from "jsbarcode"
import html2canvas from "html2canvas"

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
        teamName: "",
        utrNumber: "",
        transactionDate: new Date().toISOString().split('T')[0],
        screenshot: null,
        screenshotUrl: ""
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

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file && file.size > 500 * 1024) {
                alert("FILE SIZE EXCEEDED: Screenshot must be less than 500KB. Please compress your image or take a smaller screenshot.");
                e.target.value = ""; // Clear input
                setFormData(prev => ({ ...prev, [name]: null }));
                return;
            }
            setFormData(prev => ({ ...prev, [name]: file }));
        } else if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    const nextStep = (e) => {
        e.preventDefault();
        
        // Validation Suite
        if (!validateEmail(formData.email)) {
            alert("INVALID EMAIL: Please enter a proper email address.");
            return;
        }
        if (formData.phone.length !== 10) {
            alert("INVALID PHONE: Phone number must be exactly 10 digits.");
            return;
        }

        // Teammate validation
        for (let i = 0; i < teamMembers.length; i++) {
            const m = teamMembers[i];
            const isOptional = (i + 2) > minTeamSize;
            
            // If it's a required member, or they filled something in, validate it
            if (!isOptional || m.fullName || m.email || m.phone) {
                if (!m.fullName || !m.email || !m.phone) {
                    alert(`SQUAD ERROR: Please complete details for Member 0${i + 2}`);
                    return;
                }
                if (!validateEmail(m.email)) {
                    alert(`SQUAD ERROR: Invalid email for Member 0${i + 2}`);
                    return;
                }
                if (m.phone.length !== 10) {
                    alert(`SQUAD ERROR: Phone must be 10 digits for Member 0${i + 2}`);
                    return;
                }
            }
        }

        setStep(2);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.utrNumber || !formData.transactionDate || !formData.screenshot) {
            alert("Please provide the Transaction ID, Date, and Payment Screenshot to proceed.");
            return;
        }

        setIsSubmitting(true);
        const amount = (passType === 'combo' && comboPassDetails) ? comboPassDetails : standardFeeString;

        try {
            // 1. Upload Screenshot first
            const uploadFormData = new FormData();
            uploadFormData.append('screenshot', formData.screenshot);

            const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-screenshot`, {
                method: 'POST',
                body: uploadFormData
            });

            const uploadResult = await uploadRes.json();
            if (!uploadResult.success) {
                throw new Error(uploadResult.message || "Screenshot upload failed");
            }

            const imageUrl = uploadResult.imageUrl;

            // 2. Submit Registration
            const registerRes = await fetch(`${import.meta.env.VITE_API_URL}/api/register-manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationData: {
                        ...formData,
                        screenshotUrl: imageUrl,
                        eventTitle: event.title,
                        category: event.category || "Tech",
                        teamMembers,
                        passType: passType === 'combo' ? "Combo Pass" : "Standard Pass",
                        amountPaid: amount
                    }
                })
            });

            const result = await registerRes.json();
            if (result.success) {
                setStep(3);
            } else {
                alert("Registration failed: " + result.message);
            }

        } catch (error) {
            console.error("Registration Error:", error);
            alert(error.message || "Failed to submit registration.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const element = document.getElementById('access-pass-template');
            if (!element) throw new Error("Template not found");

            // Ensure images are loaded and the element is visible for capture
            element.style.display = 'block';
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#020617',
                logging: false
            });
            element.style.display = 'none';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', [100, 210]); // Vertical ticket format
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Estralis_Pass_${formData.fullName.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate premium pass. Please try again.");
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
            className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-3xl flex flex-col overflow-y-auto w-full min-h-screen custom-scrollbar"
        >
            {/* Header */}
            <div className="sticky top-0 p-6 md:p-8 flex items-center justify-between border-b border-teal-500/20 bg-[#020617]/50 backdrop-blur-2xl z-20">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                       <span className="text-[9px] font-black tracking-[0.4em] text-teal-500/80 uppercase font-astral">ESTRALIS_2026 // SECURE_REGISTRY</span>
                   </div>
                   <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter astral-heading">
                       {event.title}
                   </h2>
                </div>
                <button
                    onClick={onClose}
                    className="group relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-teal-500 text-black hover:bg-white transition-all font-black text-xl overflow-hidden rounded-xl shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                >
                    <span className="relative z-10 transition-transform group-hover:rotate-90">✕</span>
                    <motion.div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-12 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            onSubmit={nextStep}
                            className="w-full max-w-4xl space-y-8"
                        >
                            {/* Step Indicator */}
                            <div className="flex gap-3 justify-center">
                               {[1,2,3].map(i => (
                                   <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i <= step ? 'w-12 bg-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : 'w-4 bg-white/10'}`} />
                               ))}
                            </div>

                            {/* Basic Info */}
                            <div className="astral-glass p-8 md:p-12 space-y-10">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">FULL NAME</label>
                                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">EMAIL ADDRESS</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="your@email.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">PHONE NUMBER</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} pattern="\d{10}" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="10-digit Phone Number" title="Please enter a 10-digit phone number" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">COLLEGE / INSTITUTION</label>
                                        <input required type="text" name="college" value={formData.college} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="College Name" />
                                    </div>
                                </div>
                            </div>

                            {/* Team Section */}
                            {isTeamEvent && (
                                 <div className="astral-glass p-8 md:p-12 space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <h3 className="text-[11px] font-black tracking-widest text-white uppercase font-astral">
                                            SQUAD DETAILS
                                        </h3>
                                        {teamMembers.length + 1 < maxTeamSize && (
                                            <button type="button" onClick={addMember} className="px-6 py-2 rounded-xl border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-black transition-all font-astral">
                                                + ADD MEMBER
                                            </button>
                                        )}
                                    </div>

                                    {maxTeamSize > 1 && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">TEAM NAME</label>
                                            <input required type="text" name="teamName" value={formData.teamName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="Enter Team Name" />
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {teamMembers.map((member, index) => {
                                            const isRequired = (index + 2) <= minTeamSize;
                                            return (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.03] space-y-6 relative"
                                                >
                                                     <div className="flex justify-between items-center mb-2">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 font-astral">MEMBER 0{index + 2}</h4>
                                                        {isRequired ? (
                                                            <span className="text-teal-500/50 text-[9px] font-black uppercase tracking-widest font-astral px-2 py-1 border border-teal-500/20 rounded-lg">
                                                                REQUIRED
                                                            </span>
                                                        ) : (
                                                            <button type="button" onClick={() => removeMember(index)} className="text-red-400/50 hover:text-red-400 text-[9px] font-black uppercase tracking-widest transition-colors font-astral">
                                                                REMOVE
                                                            </button>
                                                        )}
                                                     </div>
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">NAME</label>
                                                            <input required type="text" value={member.fullName} onChange={(e) => {
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].fullName = e.target.value;
                                                                setTeamMembers(newMembers);
                                                            }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="Member Name" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">EMAIL</label>
                                                            <input required type="email" value={member.email} onChange={(e) => {
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].email = e.target.value;
                                                                setTeamMembers(newMembers);
                                                            }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="member@email.com" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">PHONE</label>
                                                            <input required type="tel" value={member.phone} onChange={(e) => {
                                                                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].phone = numericValue;
                                                                setTeamMembers(newMembers);
                                                            }} maxLength={10} pattern="\d{10}" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="10-digit Phone" title="Please enter a 10-digit phone number" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">COLLEGE</label>
                                                            <input required type="text" value={member.college} onChange={(e) => {
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].college = e.target.value;
                                                                setTeamMembers(newMembers);
                                                            }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="College Name" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                 </div>
                            )}

                            <div className="flex justify-center py-6">
                                 <button type="submit" className="w-full max-w-md py-6 bg-teal-500 text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-2xl hover:bg-white hover:shadow-[0_0_50px_rgba(45,212,191,0.3)] transition-all flex items-center justify-center gap-3 font-astral">
                                    CONTINUE TO PAYMENT <span className="text-lg">→</span>
                                 </button>
                            </div>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0 }}
                            className="w-full max-w-2xl space-y-8"
                        >
                            <div className="flex gap-3 justify-center">
                               {[1,2,3].map(i => (
                                   <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i <= step ? 'w-12 bg-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : 'w-4 bg-white/10'}`} />
                               ))}
                            </div>

                             <div className="astral-glass p-8 md:p-12 text-center space-y-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                 <div className="space-y-2">
                                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter astral-heading">Payment</h3>
                                    <p className="text-teal-400/60 text-[10px] font-black uppercase tracking-[0.3em] font-tech italic underline decoration-teal-500/30 underline-offset-4">SCAN & UPLOAD PROOF</p>
                                 </div>

                                 {/* QR Code Section */}
                                 <div className="relative group mx-auto w-48 h-48 md:w-64 md:h-64 p-4 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                                     <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors" />
                                     <img src="/qr.jpeg" alt="Payment QR" className="relative z-10 w-full h-full object-contain rounded-xl shadow-2xl" />
                                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent animate-scan" />
                                 </div>

                                 <div className="space-y-6 text-left border-y border-white/10 py-8">
                                    <div className="flex justify-between items-center text-teal-400 font-black text-[10px] tracking-widest uppercase mb-4">
                                        <span>Step 1: Scan & Pay</span>
                                        <span>Step 2: Enter Details</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">UTR / Transaction ID</label>
                                            <input required type="text" name="utrNumber" value={formData.utrNumber} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold placeholder:text-white/5" placeholder="12-digit UTR Number" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">Transaction Date</label>
                                            <input required type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">Payment Proof (Screenshot)</label>
                                        <div className="relative">
                                            <input required type="file" name="screenshot" accept="image/*" onChange={handleChange} className="hidden" id="screenshot-upload" />
                                            <label htmlFor="screenshot-upload" className="flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 cursor-pointer hover:bg-white/10 transition-all">
                                                <span className="text-sm font-bold text-white/60 truncate max-w-[200px]">
                                                    {formData.screenshot ? formData.screenshot.name : "Choose Image"}
                                                </span>
                                                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest border border-teal-500/30 px-3 py-1 rounded-lg">Browse</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-4">
                                        <span className="text-[12px] font-black text-white uppercase tracking-widest font-astral">TOTAL FEE</span>
                                        <span className="text-4xl md:text-5xl font-black text-teal-400 italic glow-teal">{standardFeeString}</span>
                                    </div>
                                 </div>

                                 <div className="space-y-6">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full py-6 bg-teal-500 text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-2xl hover:bg-white hover:shadow-[0_0_50px_rgba(45,212,191,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-astral"
                                    >
                                        {isSubmitting ? "UPLOADING PROOF..." : "SUBMIT REGISTRATION"} <span className="text-lg">→</span>
                                    </button>
                                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center justify-center gap-2 font-astral">
                                        ← EDIT DETAILS
                                    </button>
                                 </div>
                             </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-2xl text-center space-y-10"
                        >
                             <div className="astral-glass p-8 md:p-16 border-emerald-500/30">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
                                    ✓
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 astral-heading">Access Granted</h3>
                                <p className="text-white/60 text-lg md:text-xl font-medium mb-12">Your registration for <span className="text-teal-400">{event.title}</span> is complete.</p>
                                
                                <div className="space-y-4 text-left border-t border-white/10 pt-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest font-astral">STATUS</span>
                                        <span className="text-emerald-400 font-bold uppercase tracking-widest">CONFIRMED</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest font-astral">TIMESTAMP</span>
                                        <span className="text-white/60 font-mono text-xs">{new Date().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button onClick={handleDownloadPDF} disabled={isDownloading} className="flex-1 max-w-sm px-8 py-5 bg-teal-500 text-black font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-white hover:shadow-[0_0_30px_rgba(45,212,191,0.2)] transition-all font-astral">
                                    {isDownloading ? "GENERATING..." : "DOWNLOAD PASS"}
                                </button>
                                <button onClick={onClose} className="flex-1 max-w-sm px-8 py-5 bg-white/5 text-white/50 border border-white/10 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all font-astral">
                                    CLOSE
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hidden Access Pass Template for PDF Capture - Uses explicit styles to bypass oklab parsing issues */}
            <div id="access-pass-template" className="fixed -left-[9999px] top-0 w-[400px] bg-[#020617] text-white overflow-hidden" style={{ minHeight: '800px', display: 'none', backgroundColor: '#020617', color: '#ffffff', fontFamily: 'sans-serif' }}>
                <div className="p-8 m-4 rounded-[2rem] relative overflow-hidden" style={{ backgroundColor: '#0a0f1e', border: '4px solid rgba(45, 212, 191, 0.3)' }}>
                    {/* Decorative Background Elements - Simpler gradients for capture compatibility */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', filter: 'blur(40px)' }} />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)', filter: 'blur(40px)' }} />
                    
                    {/* Header */}
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

                    {/* Event Title */}
                    <div className="mb-10 text-center py-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(45, 212, 191, 0.5)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '0.5rem', display: 'block' }}>TRANSMISSION_TARGET</span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>{event.title}</h3>
                    </div>

                    {/* LEADER SECTION (Primary Details) */}
                    <div className="space-y-6 mb-12">
                         <div className="flex items-center gap-3">
                            <div className="w-1 h-8" style={{ backgroundColor: '#2dd4bf' }} />
                            <div>
                                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PRIMARY_PARTICIPANT</span>
                                <p style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{formData.fullName}</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-6 pl-4">
                            <div>
                                <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>COLLEGE_ID</span>
                                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.college}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>TRANS_ID</span>
                                <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#2dd4bf', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.utrNumber}</p>
                            </div>
                         </div>
                    </div>

                    {/* SQUAD SECTION (If applicable) */}
                    {teamMembers.length > 0 && (
                        <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <h4 style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(45, 212, 191, 0.4)' }} />
                                SQUAD_ROSTER
                            </h4>
                            {formData.teamName && (
                                <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1.25rem' }}>TEAM: {formData.teamName}</p>
                            )}
                            <div className="space-y-4 pl-5" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                {teamMembers.map((m, i) => (
                                    <div key={i} className="pb-2">
                                        <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>{m.fullName}</p>
                                        <p style={{ fontSize: '9px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.college || formData.college}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer / QR Placeholder */}
                    <div className="mt-16 pt-8 flex justify-between items-end" style={{ borderTop: '1px solid rgba(45, 212, 191, 0.2)' }}>
                        <div className="space-y-2">
                            <div style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TIMESTAMP</div>
                            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.4)' }}>{new Date().toLocaleString()}</div>
                        </div>
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                             <div style={{ fontSize: '8px', color: 'rgba(45, 212, 191, 0.4)', textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1' }}>SECURE<br/>SCAN</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
