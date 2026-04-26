import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jsPDF } from "jspdf"
import JsBarcode from "jsbarcode"
import QRCode from 'qrcode'

// Searchable College Dropdown Component
function CollegeSelect({ value, onChange, colleges, placeholder, inputClassName }) {
    const [search, setSearch] = useState(value || "");
    const [isOpen, setIsOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const wrapperRef = useRef(null);
    const listRef = useRef(null);

    // Sync external value changes
    useEffect(() => {
        setSearch(value || "");
    }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
                // If the current search text doesn't match a valid college, reset
                if (!colleges.includes(search.toUpperCase())) {
                    setSearch(value || "");
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [colleges, search, value]);

    const filtered = colleges.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (college) => {
        setSearch(college);
        onChange(college);
        setIsOpen(false);
        setHighlighted(-1);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlighted >= 0 && highlighted < filtered.length) {
                handleSelect(filtered[highlighted]);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    // Scroll highlighted item into view
    useEffect(() => {
        if (listRef.current && highlighted >= 0) {
            const items = listRef.current.children;
            if (items[highlighted]) {
                items[highlighted].scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlighted]);

    const isValid = value && colleges.includes(value.toUpperCase());

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    onChange(""); // Clear selection when typing
                    setIsOpen(true);
                    setHighlighted(0);
                }}
                onFocus={() => {
                    setIsOpen(true);
                    setHighlighted(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Search College..."}
                className={inputClassName}
                autoComplete="off"
            />
            {/* Validation indicator */}
            {search && (
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${isValid ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
            )}
            {/* Dropdown List */}
            <AnimatePresence>
                {isOpen && search.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        ref={listRef}
                        className="absolute z-50 w-full mt-2 max-h-48 overflow-y-auto bg-[#0f172a] border border-teal-500/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] custom-scrollbar"
                    >
                        {filtered.length > 0 ? (
                            filtered.map((college, i) => (
                                <div
                                    key={college}
                                    onClick={() => handleSelect(college)}
                                    className={`px-5 py-3 cursor-pointer text-sm font-bold transition-all ${
                                        i === highlighted
                                            ? 'bg-teal-500/20 text-teal-300'
                                            : 'text-white/70 hover:bg-teal-500/10 hover:text-white'
                                    }`}
                                >
                                    {college}
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-4 text-center">
                                <p className="text-red-400 text-xs font-black uppercase tracking-widest">College Not Available</p>
                                <p className="text-teal-400/60 text-[10px] mt-1 font-bold tracking-widest uppercase">Contact admin to add your college</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function RegistrationForm({ event, onClose }) {
    const [step, setStep] = useState(1)
    const receiptRef = useRef(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [registrationId, setRegistrationId] = useState("")
    const [utrError, setUtrError] = useState("")
    const [teamMembers, setTeamMembers] = useState([])
    const [passType, setPassType] = useState('standard') // 'standard' or 'combo'
    const [collegeList, setCollegeList] = useState([])
    const [slotInfo, setSlotInfo] = useState(null)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        college: "",
        semester: "",
        branch: "",
        linkedinUrl: "",
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

    const isDJNight = event?.title?.toUpperCase().includes("DJ NIGHT");
    const hostCollege = "GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT";
    const getFeeForCollege = (clg) => (clg || "").trim().toUpperCase() === hostCollege ? 200 : 400;

    const leaderFee = getFeeForCollege(formData.college);
    const friendsTotalFee = teamMembers.reduce((acc, m) => acc + getFeeForCollege(m.college), 0);
    const totalDJFeeValue = leaderFee + friendsTotalFee;

    const currentSquadSize = 1 + teamMembers.length;
    const totalDJFee = isDJNight ? `₹${totalDJFeeValue}` : null;
    const displayFee = isDJNight ? totalDJFee : standardFeeString;

    const isManuallyClosed = slotInfo && slotInfo.isManualOpen === false;
    
    // Check relevant slots based on college
    const isGCEM = formData.college.trim().toUpperCase() === hostCollege;
    const relevantSlotsLeft = isGCEM ? (slotInfo?.gcemSlotsLeft ?? slotInfo?.slotsLeft) : (slotInfo?.otherSlotsLeft ?? slotInfo?.slotsLeft);
    const isSoldOut = isDJNight && slotInfo && (relevantSlotsLeft < currentSquadSize);

    // Fetch allowed colleges
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/colleges`);
                const data = await res.json();
                if (data.success) {
                    const hostCollege = "GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT";
                    let fetchedList = data.data.map(c => c.name.toUpperCase());
                    
                    // Force include GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT if not present in DB
                    if (!fetchedList.includes(hostCollege)) {
                        fetchedList.push(hostCollege);
                    }
                    
                    setCollegeList(fetchedList);
                }
            } catch (err) {
                console.error("Failed to fetch colleges", err);
            }
        };
        fetchColleges();
    }, []);

    // Slot tracking for DJ Night
    useEffect(() => {
        if (event?.title?.toUpperCase().includes("DJ NIGHT")) {
          const fetchSlots = async () => {
            try {
              const normalizedTitle = event.title.trim().toUpperCase();
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/slots-status?eventTitle=${encodeURIComponent(normalizedTitle)}`);
                    const data = await res.json();
                    if (data.success && data.isLimited) {
                        setSlotInfo(data);
                    }
                } catch (err) {
                    console.error("Slot fetch err:", err);
                }
            };
            fetchSlots();
        }
    }, [event?.title]);


    useEffect(() => {
        // Initialize with minimum required team members (excluding leader)
        if (event && minTeamSize > 1) {
            const initialCount = Math.max(0, minTeamSize - 1);
            setTeamMembers(Array.from({ length: initialCount }, () => ({ 
                fullName: "", email: "", phone: "", college: "", 
                semester: "", branch: "", linkedinUrl: "" 
            })));
        } else if (isDJNight) {
            // DJ Night starts with 0 members - single person can register alone
            setTeamMembers([]);
        } else {
            setTeamMembers([]);
        }
    }, [event, minTeamSize]);

    const addMember = () => {
        if (teamMembers.length + 1 < maxTeamSize) {
            setTeamMembers([...teamMembers, { 
                fullName: "", email: "", phone: "", college: "", 
                semester: "", branch: "", linkedinUrl: "" 
            }]);
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
        } else if (name === 'college') {
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    const nextStep = (e) => {
        e.preventDefault();

        // Slot Validation
        if (isManuallyClosed) {
            alert("REGISTRATION CLOSED: This event is currently not accepting registrations.");
            return;
        }
        if (isSoldOut) {
            const categoryName = isGCEM ? "GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT" : "OTHER COLLEGE";
            alert(`SOLD OUT: Only ${relevantSlotsLeft} seats left for ${categoryName} category, but you are trying to register ${currentSquadSize} people.`);
            return;
        }

        // Validation Suite
        if (!validateEmail(formData.email)) {
            alert("INVALID EMAIL: Please enter a proper email address.");
            return;
        }
        if (formData.phone.length !== 10) {
            alert("INVALID PHONE: Phone number must be exactly 10 digits.");
            return;
        }
        // College validation - Only enforce strict list for DJ Night
        if (isDJNight && collegeList.length > 0 && !collegeList.includes(formData.college.toUpperCase())) {
            alert("INVALID COLLEGE: Please select a valid college from the dropdown.");
            return;
        }

        // Teammate validation
        for (let i = 0; i < teamMembers.length; i++) {
            const m = teamMembers[i];
            const isOptional = (i + 2) > minTeamSize;

            // If it's a required member, or they filled something in, validate it
            if (!isOptional || m.fullName || m.email || m.phone) {
                if (!m.fullName || !m.email || !m.phone) {
                    alert(`${isDJNight ? 'FRIEND' : 'SQUAD'} ERROR: Please complete details for ${isDJNight ? 'Friend' : 'Member'} 0${i + 2}`);
                    return;
                }
                if (!validateEmail(m.email)) {
                    alert(`${isDJNight ? 'FRIEND' : 'SQUAD'} ERROR: Invalid email for ${isDJNight ? 'Friend' : 'Member'} 0${i + 2}`);
                    return;
                }
                if (m.phone.length !== 10) {
                    alert(`${isDJNight ? 'FRIEND' : 'SQUAD'} ERROR: Phone must be 10 digits for ${isDJNight ? 'Friend' : 'Member'} 0${i + 2}`);
                    return;
                }
                // College validation for team members - Only enforce strict list for DJ Night
                if (isDJNight && collegeList.length > 0 && m.college && !collegeList.includes(m.college.toUpperCase())) {
                    alert(`${isDJNight ? 'FRIEND' : 'SQUAD'} ERROR: Invalid college for ${isDJNight ? 'Friend' : 'Member'} 0${i + 2}. Please select from the dropdown.`);
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
        const amount = isDJNight ? totalDJFee : ((passType === 'combo' && comboPassDetails) ? comboPassDetails : standardFeeString);

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
                // The server returns the ID inside 'data.id' as seen in debug logs
                const finalId = result.data?.id || result.registrationId || result.id || result._id || "";
                
                if (finalId) {
                    setRegistrationId(finalId);
                    setStep(3);
                } else {
                    console.error("No ID returned from server", result);
                    // Fallback to avoid blocking the user, but log the error
                    setStep(3);
                }
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
            const amount = isDJNight ? totalDJFee : ((passType === 'combo' && comboPassDetails) ? comboPassDetails : standardFeeString);

            // Generate QR Code using standard qrcode library (same as server)
            const safeData = registrationId ? String(registrationId) : "MISSING_ID_ERROR";
            const qrDataUrl = await QRCode.toDataURL(safeData, {
                margin: 1,
                color: {
                    dark: '#2dd4bf', // Teal 400
                    light: '#0f172a' // Slate background matching HUD
                }
            });

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

            // Official Event Schedule for PDF Data
            const EVENT_SCHEDULE = {
                "INAUGURATION": { location: "Amphitheatre", time: "09:00 AM" },
                "CLASSICAL GROUP": { location: "Amphitheatre", time: "12:30 PM" },
                "REELS MAKING": { location: "1ST Floor Class Room", time: "10:30 AM" },
                "TREASURE HUNT": { location: "GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT Campus", time: "11:00 AM" },
                "FACE PAINTING": { location: "Amphitheatre", time: "11:00 AM" },
                "FITNESS CHALLENGE(A)": { location: "Open Amphitheatre", time: "11:00 AM" },
                "FITNESS CHALLENGE(B)": { location: "Open Amphitheatre", time: "12:30 PM" },
                "BEAT BOXING": { location: "Amphitheatre", time: "02:30 PM" },
                "WESTERN SOLO": { location: "Amphitheatre", time: "10:30 AM" },
                "BGMI": { location: "1ST Floor Classroom", time: "12:00 PM" },
                "WESTERN GROUP": { location: "Amphitheatre", time: "03:30 PM" },
                "BATTLE OF BANDS": { location: "Amphitheatre", time: "10:00 AM" },
                "FASHION WALK": { location: "Amphitheatre", time: "12:00 PM" },
                "PRIZE DISTRIBUTION": { location: "Amphitheatre", time: "03:00 PM" },
                "ARTIST PERFORMANCE": { location: "Main Stage", time: "06:00 PM" },
                "DJ NIGHT": { location: "Main Stage", time: "07:30 PM" }
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
                pageDoc.text("ESTRALIS 2026", 82.5, 35, { align: "center", charSpace: 1 });

                pageDoc.setTextColor(255, 255, 255);
                pageDoc.text("ESTRALIS 2026", 82.5, 35, { align: "center", charSpace: 1 });

                pageDoc.setFontSize(8);
                pageDoc.setFont("helvetica", "normal");
                pageDoc.setTextColor(...colors.teal);
                pageDoc.text("THE INTERSTELLAR SYMPOSIUM", 69.5, 43, { align: "center", charSpace: 1.5 });

                pageDoc.setFontSize(7);
                pageDoc.setTextColor(...colors.dim);
                pageDoc.text("OFFICIAL SECTOR ADMISSION PASS // SECURE_ID: 2026-AST-R", 88, 50, { align: "center" });

                // 5. FOOTER DECOR
                pageDoc.setFont("helvetica", "italic");
                pageDoc.setFontSize(6);
                pageDoc.setTextColor(...colors.dim);
                pageDoc.text("PLEASE SUBMIT THE ACCESS PASS AT THE REGISTERATION DESK", 90, 243, { align: "center" });
            };

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
            const ticketId = (formData.utrNumber || "PENDING").toUpperCase();
            doc.text(ticketId, 20, startY + 8);

            // Status Badge
            doc.setDrawColor(...colors.teal);
            doc.setLineWidth(0.5);
            doc.roundedRect(130, startY + 2, 30, 10, 2, 2, 'D');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...colors.teal);
            doc.text("VERIFIED", 145, startY + 9, { align: "center" });

            // EVENT TITLE (Dynamic Font Size & Spacing)
            const eventTitle = (event.title || "").toUpperCase();
            doc.setFont("helvetica", "bold");
            const isLongTitle = eventTitle.length > 25;
            const titleFontSize = isLongTitle ? 18 : 32;
            doc.setFontSize(titleFontSize);
            doc.setTextColor(255, 255, 255);
            doc.text(eventTitle, 85, startY + (isLongTitle ? 33 : 35), { align: "center", charSpace: isLongTitle ? 0.1 : 1 });

            // CATEGORY TAG (Refined to 86mm)
            doc.setFillColor(...colors.teal);
            const catText = (event.category || "TECH").toUpperCase();
            const tagWidth = doc.getTextWidth(catText) + 10;
            doc.roundedRect(86 - (tagWidth / 2), startY + 40, tagWidth, 8, 4, 4, 'F');
            doc.setFontSize(8);
            doc.setTextColor(...colors.bg);
            doc.text(catText, 84, startY + 45.5, { align: "center", charSpace: 2 });

            // LOGISTICS (Location & Time)
            doc.setFillColor(30, 41, 59, 40);
            doc.roundedRect(20, startY + 55, 140, 30, 5, 5, 'F');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...colors.teal);
            doc.text("LOCATION", 30, startY + 65);
            doc.text("TIME", 100, startY + 65);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            const schedule = EVENT_SCHEDULE[event.title.toUpperCase()] || { location: "TBA", time: "TBA" };
            if (event.title.toUpperCase().includes("DJ NIGHT")) {
                schedule.location = "Main stage, GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT Campus";
                schedule.time = "06:00 PM";
            }
            const venueLines = doc.splitTextToSize(schedule.location, 60);
            doc.text(venueLines, 30, startY + 72);
            doc.text(schedule.time, 100, startY + 72);

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

            if (formData.teamName) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(...colors.teal);
                doc.text(`TEAM: ${formData.teamName.toUpperCase()}`, 20, currentY);
                currentY += 9;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.text(formData.fullName.toUpperCase(), 20, currentY);
            currentY += 10;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...colors.dim);
            doc.text(`Institute: ${formData.college}`, 20, currentY);
            currentY += 6;
            doc.text(`Email: ${formData.email}`, 20, currentY);
            currentY += 6;
            doc.text(`Phone: ${formData.phone}`, 20, currentY);

            // FEE SECTION (Bottom Left)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...colors.teal);
            doc.text(passType === 'combo' ? "COMBO_PASS_FEE" : "BASE_FEE", 20, 232);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            doc.text(`Rs. ${amount.toString().replace(/₹/g, '')}`, 20, 240);

            // 6. QR CODE (Bottom Right)
            doc.setDrawColor(...colors.teal);
            doc.setLineWidth(0.5);
            doc.roundedRect(138, 218, 25, 25, 3, 3, 'D');
            doc.addImage(qrDataUrl, 'PNG', 139, 219, 23, 23);
            doc.setFontSize(5);
            doc.setTextColor(...colors.dim);
            doc.text("SCAN TO VERIFY", 150.5, 246, { align: "center" });

            if (teamMembers && teamMembers.length > 0) {
                doc.addPage("portrait", "mm", [180, 260]);
                drawTicketBase(doc);

                let teamY = 80;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(255, 255, 255);
                doc.text(formData.teamName ? `SQUAD: ${formData.teamName.toUpperCase()}` : "SQUAD MEMBERS", 90, teamY, { align: "center" });
                teamY += 10;
                doc.setDrawColor(...colors.teal);
                doc.line(40, teamY, 140, teamY);
                teamY += 15;

                teamMembers.forEach((member, index) => {
                    if (teamY > 220) {
                        doc.addPage("portrait", "mm", [180, 260]);
                        drawTicketBase(doc);
                        teamY = 80;
                    }

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    doc.setTextColor(...colors.teal);
                    doc.text(`${String(index + 2).padStart(2, '0')} //`, 25, teamY);

                    doc.setTextColor(255, 255, 255);
                    doc.text(member.fullName.toUpperCase(), 40, teamY);

                    teamY += 6;
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(...colors.dim);
                    doc.text(`${member.email} | ${member.phone}`, 40, teamY);

                    teamY += 12;
                });
            }

            doc.save(`Estralis_Pass_${formData.fullName.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to download PDF ticket. Please try again.");
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
                                {[1, 2, 3].map(i => (
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
                                        {isDJNight ? (
                                            <CollegeSelect
                                                value={formData.college}
                                                onChange={(val) => setFormData(prev => ({ ...prev, college: val }))}
                                                colleges={collegeList}
                                                placeholder="Search College..."
                                                inputClassName="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10"
                                            />
                                        ) : (
                                            <input 
                                                required 
                                                type="text" 
                                                name="college" 
                                                value={formData.college} 
                                                onChange={handleChange} 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10 uppercase" 
                                                placeholder="Your College Name" 
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">SEMESTER / YEAR</label>
                                        <input required type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="e.g. 6th Sem, 2nd Year, PUC" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">BRANCH / STREAM</label>
                                        <input required type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="e.g. CSE, BCA, PCMB" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 font-astral ml-1">LINKEDIN URL (OPTIONAL)</label>
                                        <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all font-bold placeholder:text-white/10" placeholder="https://linkedin.com/in/username" />
                                    </div>
                                </div>
                            </div>

                            {/* Team Section */}
                            {(isTeamEvent || isDJNight) && (
                                <div className="astral-glass p-8 md:p-12 space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <h3 className="text-[11px] font-black tracking-widest text-white uppercase font-astral">
                                            {isDJNight ? 'ADD FRIENDS (OPTIONAL)' : 'SQUAD DETAILS'}
                                        </h3>
                                        {teamMembers.length + 1 < maxTeamSize && (
                                            <button type="button" onClick={addMember} className="px-6 py-2 rounded-xl border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-black transition-all font-astral">
                                                + ADD {isDJNight ? 'FRIEND' : 'MEMBER'}
                                            </button>
                                        )}
                                    </div>

                                    {isDJNight && (
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-teal-400/60 font-astral">YOUR INDIVIDUAL FEE</span>
                                            <span className="text-lg font-black text-teal-400">₹{leaderFee}</span>
                                        </div>
                                    )}

                                    {!isDJNight && maxTeamSize > 1 && (
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
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 font-astral">{isDJNight ? 'FRIEND' : 'MEMBER'} 0{index + 2}</h4>
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
                                                            {isDJNight ? (
                                                                <CollegeSelect
                                                                    value={member.college}
                                                                    onChange={(val) => {
                                                                        const newMembers = [...teamMembers];
                                                                        newMembers[index].college = val;
                                                                        setTeamMembers(newMembers);
                                                                    }}
                                                                    colleges={collegeList}
                                                                    placeholder="Search College..."
                                                                    inputClassName="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold"
                                                                />
                                                            ) : (
                                                                <input 
                                                                    required 
                                                                    type="text" 
                                                                    value={member.college} 
                                                                    onChange={(e) => {
                                                                        const newMembers = [...teamMembers];
                                                                        newMembers[index].college = e.target.value.toUpperCase();
                                                                        setTeamMembers(newMembers);
                                                                    }} 
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold uppercase" 
                                                                    placeholder="Member College" 
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">SEMESTER</label>
                                                            <input required type="text" value={member.semester} onChange={(e) => {
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].semester = e.target.value;
                                                                setTeamMembers(newMembers);
                                                            }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="e.g. 6th" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">BRANCH</label>
                                                            <input required type="text" value={member.branch} onChange={(e) => {
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].branch = e.target.value;
                                                                setTeamMembers(newMembers);
                                                            }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="e.g. CSE" />
                                                        </div>
                                                        <div className="space-y-1.5 md:col-span-2">
                                                            <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">LINKEDIN (OPTIONAL)</label>
                                                            <input type="url" value={member.linkedinUrl} onChange={(e) => {
                                                                const newMembers = [...teamMembers];
                                                                newMembers[index].linkedinUrl = e.target.value;
                                                                setTeamMembers(newMembers);
                                                            }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-sm font-bold" placeholder="https://linkedin.com/in/..." />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {isDJNight && teamMembers.length > 0 && (
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-white font-astral">TOTAL FOR SQUAD ({1 + teamMembers.length} MEMBERS)</span>
                                            <span className="text-2xl font-black text-teal-400 italic glow-teal">{totalDJFee}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-6 py-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 font-astral text-center">
                                    Any issue with registration? Contact Bharath <a href="tel:7975871167" className="text-teal-400 hover:text-white transition-colors cursor-pointer">7975871167</a>
                                </p>
                                <button 
                                    type="submit" 
                                    disabled={isManuallyClosed || isSoldOut}
                                    className={`w-full max-w-md py-6 transition-all font-black text-[12px] uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-3 font-astral ${
                                        isManuallyClosed || isSoldOut 
                                        ? 'bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/30' 
                                        : 'bg-teal-500 text-black hover:bg-white hover:shadow-[0_0_50px_rgba(45,212,191,0.3)]'
                                    }`}
                                >
                                    {isManuallyClosed ? "REGISTRY CLOSED" : isSoldOut ? "SOLD OUT" : "CONTINUE TO PAYMENT"} <span className="text-lg">→</span>
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
                                {[1, 2, 3].map(i => (
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
                                        <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-tech ml-1">Payment Proof (Screenshot showing UTR Number)</label>
                                        <div className="relative">
                                            <input required type="file" name="screenshot" accept="image/*" onChange={handleChange} className="hidden" id="screenshot-upload" />
                                            <label htmlFor="screenshot-upload" className="flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 cursor-pointer hover:bg-white/10 transition-all">
                                                <span className="text-sm font-bold text-white/60 truncate max-w-[200px]">
                                                    {formData.screenshot ? formData.screenshot.name : "Choose Image < 1MB"}
                                                </span>
                                                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest border border-teal-500/30 px-3 py-1 rounded-lg">Browse</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-4">
                                        <span className="text-[12px] font-black text-white uppercase tracking-widest font-astral">TOTAL FEE</span>
                                        <span className="text-4xl md:text-5xl font-black text-teal-400 italic glow-teal">{displayFee}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 font-astral text-center">
                                        Any issue with registration? Contact <a href="tel:7975871167" className="text-teal-400 hover:text-white transition-colors cursor-pointer">Bharath 7975871167</a>
                                    </p>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || isManuallyClosed || isSoldOut}
                                        className={`w-full py-6 font-black text-[12px] uppercase tracking-[0.4em] rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-astral ${
                                            isManuallyClosed || isSoldOut 
                                            ? 'bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/30' 
                                            : 'bg-teal-500 text-black hover:bg-white hover:shadow-[0_0_50px_rgba(45,212,191,0.3)]'
                                        }`}
                                    >
                                        {isSubmitting ? "UPLOADING PROOF..." : isManuallyClosed ? "CLOSED" : isSoldOut ? "SOLD OUT" : "SUBMIT REGISTRATION"} <span className="text-lg">→</span>
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
                                <button 
                                    onClick={handleDownloadPDF} 
                                    disabled={isDownloading || !registrationId} 
                                    className={`flex-1 max-w-sm px-8 py-5 font-black text-[12px] uppercase tracking-widest rounded-2xl transition-all font-astral ${!registrationId ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-teal-500 text-black hover:bg-white hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]'}`}
                                >
                                    {isDownloading ? "GENERATING..." : !registrationId ? "SYSTEM FINALIZING..." : "DOWNLOAD PASS"}
                                </button>
                                <button onClick={onClose} className="flex-1 max-w-sm px-8 py-5 bg-white/5 text-white/50 border border-white/10 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all font-astral">
                                    CLOSE
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
