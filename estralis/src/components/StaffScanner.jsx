import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";

export default function StaffScanner() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState("");
    
    const [scannerActive, setScannerActive] = useState(false);
    const [scannedReg, setScannedReg] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthenticated(true);
                setLoginError("");
            } else {
                setLoginError(data.message || "Invalid Portal Key");
            }
        } catch (err) {
            setLoginError("Server Connection Error");
        }
    };

    useEffect(() => {
        let scanner = null;
        if (isAuthenticated && scannerActive && !scannedReg) {
            scanner = new Html5Qrcode("staff-reader");
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            const onScanSuccess = async (decodedText) => {
                const cleanText = String(decodedText).trim();
                if (!cleanText) return;

                setScannerActive(false);
                scanner.stop().catch(e => console.error(e));
                
                verifyId(cleanText);
            };

            scanner.start({ facingMode: "environment" }, config, onScanSuccess)
                .catch(err => {
                    console.error(err);
                    alert("Camera error. Please ensure permissions are granted.");
                });
        }

        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch(e => console.error(e));
            }
        };
    }, [isAuthenticated, scannerActive, scannedReg]);

    const verifyId = async (id) => {
        setIsProcessing(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scanner/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password })
            });
            const result = await res.json();
            if (result.success) {
                setScannedReg({ ...result.data, id });
            } else {
                setMessage({ text: result.message || "Invalid Pass", type: "error" });
                setTimeout(() => setMessage(null), 3000);
                setScannerActive(true); // Restart scanner
            }
        } catch (err) {
            alert("Network error during verification");
            setScannerActive(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchHistory = async () => {
        if (!isAuthenticated) return;
        setIsLoadingHistory(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scanner/history`, {
                headers: { 'x-staff-password': password }
            });
            const result = await res.json();
            if (result.success) {
                setHistory(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch history");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchHistory();
            const interval = setInterval(fetchHistory, 15000); // Sync every 15s
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const handleGrantEntry = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scanner/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: scannedReg.id, password })
            });
            const result = await res.json();
            if (result.success) {
                setMessage({ text: "✅ ENTRY GRANTED", type: "success" });
                setScannedReg(null);
                fetchHistory(); // Refresh immediately
                setTimeout(() => {
                    setMessage(null);
                    setScannerActive(true);
                }, 2000);
            } else {
                alert(result.message);
            }
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter text-teal-400">SCAN_PORTAL</h1>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">Official Entry Point Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ENTER_ACCESS_KEY"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center text-xl font-bold tracking-widest focus:border-teal-500/50 outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                        {loginError && <p className="text-red-400 font-bold text-xs uppercase animate-pulse">{loginError}</p>}
                        <button className="w-full bg-teal-500 py-5 rounded-2xl text-black font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-lg shadow-teal-500/20">
                            INITIALIZE_SYSTEM
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#020617] text-white font-sans p-6 overflow-y-auto">
            <div className="max-w-md mx-auto h-full flex flex-col pt-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-black text-white">STAFF_SCANNER</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-teal-500/60 uppercase tracking-widest">Live_Secure_Link</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-8">
                    {message && (
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }}
                            className={`p-6 rounded-2xl text-center font-black uppercase tracking-widest text-lg ${
                                message.type === 'success' ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    {!scannedReg ? (
                        <div className="space-y-8">
                            {!scannerActive ? (
                                <button 
                                    onClick={() => setScannerActive(true)}
                                    className="w-full aspect-square border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
                                >
                                    <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-3m0 0h-3m3 0h3m-9 3H5m0 0v3m0-3h3m0 9h-3m0 0v-3m0 3h3m11-3v3m0 0h-3m3 0h3"></path></svg>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-white">Activate_Camera</span>
                                </button>
                            ) : (
                                <div className="relative aspect-square bg-black rounded-3xl overflow-hidden border-2 border-teal-500 shadow-[0_0_50px_rgba(45,212,191,0.2)]">
                                    <div id="staff-reader" className="w-full h-full"></div>
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-teal-500/50 animate-scan pointer-events-none" />
                                    <button 
                                        onClick={() => setScannerActive(false)}
                                        className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            )}
                            <p className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] px-10 leading-relaxed">
                                Align the QR code within the frame for instant verification.
                            </p>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto text-teal-400">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">{scannedReg.full_name}</h3>
                                <p className="text-teal-400 font-bold uppercase text-xs tracking-widest">{scannedReg.event_title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-4 rounded-2xl text-left">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">College</p>
                                    <p className="font-bold text-xs truncate">{scannedReg.college}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl text-left">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Squad</p>
                                    <p className="font-bold text-xs truncate">{scannedReg.team_name || "Solo"}</p>
                                </div>
                            </div>

                            {scannedReg.status === 'visited' ? (
                                <div className="py-5 bg-amber-500/20 border border-amber-500/30 rounded-2xl text-amber-500 font-black text-sm tracking-widest uppercase">
                                    Already Checked In
                                </div>
                            ) : (
                                <button 
                                    onClick={handleGrantEntry}
                                    disabled={isProcessing}
                                    className="w-full bg-teal-500 py-6 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-lg hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? "GRANTING..." : "GRANT_ENTRY"}
                                </button>
                            )}

                            <button 
                                onClick={() => setScannedReg(null)}
                                className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white"
                            >
                                Back to Scanner
                            </button>
                        </motion.div>
                    )}

                    {/* History View (Live Entry Signals) */}
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <h3 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">Granted_Archive ({history.length})</h3>
                            </div>
                            {isLoadingHistory && <div className="w-3 h-3 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />}
                        </div>

                        <div className="space-y-3">
                            {history.length === 0 ? (
                                <p className="text-center py-10 text-gray-700 font-mono text-[9px] uppercase tracking-widest">Awaiting entry signals...</p>
                            ) : (
                                history.slice(0, 10).map((reg) => (
                                    <motion.div 
                                        key={reg.id}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black uppercase tracking-tight truncate">{reg.full_name}</p>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1 truncate">{reg.college}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest">{reg.event_title}</span>
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[7px] font-black rounded border border-emerald-500/20">GRANTED</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {history.length > 10 && (
                                <p className="text-center text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-4">Showing 10 most recent entries</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-auto py-10 opacity-20 pointer-events-none">
                    <p className="font-mono text-[8px] text-center tracking-widest uppercase">Estralis Secure Transmission // Protocol 2026.S</p>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    );
}
