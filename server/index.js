const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const dns = require('dns');
const PDFDocument = require('pdfkit');
const db = require('./db');
const Razorpay = require('razorpay');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// FORCE IPv4 Priority at the DNS level
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Configuration
// (Now handled via server/db.js using PostgreSQL pool)

// Razorpay Configuration
const razorpayKeyId = (process.env.RAZORPAY_KEY_ID || '').trim();
const razorpayKeySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
const razorpay = (razorpayKeyId && !razorpayKeyId.includes('your_'))
    ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
    : null;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage Configuration for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'payment_screenshots',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => `screenshot_${Date.now()}_${Math.round(Math.random() * 1e9)}`
    }
});

const upload = multer({ storage: storage });

// Trim config values
const SENDER_EMAIL = (process.env.SENDER_EMAIL || "").trim();
const ADMIN_RECEIVER_EMAIL = (process.env.ADMIN_RECEIVER_EMAIL || "").trim();
const ADMIN_EMAILS = ADMIN_RECEIVER_EMAIL.split(',').map(e => e.trim()).filter(e => e.length > 5);
const FRONTEND_URL = (process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");

const GMAIL_CLIENT_ID = (process.env.GMAIL_CLIENT_ID || "").trim();
const GMAIL_CLIENT_SECRET = (process.env.GMAIL_CLIENT_SECRET || "").trim();
const GMAIL_REFRESH_TOKEN = (process.env.GMAIL_REFRESH_TOKEN || "").trim();

// --- GMAIL API (HTTPS) CONFIGURATION (Port 443 - Definitive Fix for Render Timeouts) ---
// We no longer use SMTP (Port 587/465) because cloud firewalls often block them.
// High-tech solution using standard HTTPS web traffic.

const getGmailAccessToken = async () => {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: GMAIL_CLIENT_ID,
                client_secret: GMAIL_CLIENT_SECRET,
                refresh_token: GMAIL_REFRESH_TOKEN,
                grant_type: 'refresh_token'
            })
        });
        const data = await response.json();
        if (!data.access_token) throw new Error(`Token Refresh Failed: ${JSON.stringify(data)}`);
        return data.access_token;
    } catch (error) {
        console.error("❌ GMail API: Token Refresh Error:", error.message);
        throw error;
    }
};

const sendEmailViaAPI = async (mailOptions) => {
    try {
        // 1. Build the MIME message using Nodemailer (Stream approach)
        const dummyTransporter = nodemailer.createTransport({ streamTransport: true, newline: 'unix', buffer: true });
        const buildInfo = await dummyTransporter.sendMail(mailOptions);

        // 2. Base64URL Encode the raw MIME message (Gmail API requirement)
        const raw = buildInfo.message.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // 3. Obtain fresh Access Token
        const accessToken = await getGmailAccessToken();

        // 4. Send via Gmail REST API (Port 443 - NEVER BLOCKED)
        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(`Gmail API Error: ${JSON.stringify(result)}`);

        console.log(`✅ GMail API: Email Sent Successfully to ${mailOptions.to} (ID: ${result.id})`);
        return result;
    } catch (error) {
        console.error("❌ GMail API: Send Failed:", error.message);
        logEmailError(mailOptions.to, error);
        throw error;
    }
};

// Diagnostic Handshake on Startup
(async () => {
    try {
        await getGmailAccessToken();
        console.log("✅ GMail API System: Ready & Authenticated (HTTPS Mode)");
        console.log(`🔑 Refresh Token Peek: ${GMAIL_REFRESH_TOKEN.substring(0, 5)}...`);
    } catch (e) {
        console.error("❌ GMail API Startup Handshake Failed:", e.message);
    }
})();

// Helper to log errors to a physical file for remote troubleshooting
const logEmailError = (regEmail, error) => {
    const logPath = path.join(__dirname, 'email_errors.log');
    const logEntry = `[${new Date().toISOString()}] RECIPIENT: ${regEmail} | ERROR: ${error.message} | CODE: ${error.code}\n`;
    try {
        fs.appendFileSync(logPath, logEntry);
    } catch (e) {
        console.error("Failed to write to email_errors.log:", e.message);
    }
};

// Diagnostic Ping for Environment Check
console.log(`📡 GMail OAuth2 Config: ${GMAIL_CLIENT_ID ? "LOADED" : "MISSING"}`);



// SMTP verify block removed in favor of GMail API (HTTPS) startup handshake.

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/$/, ""))
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

console.log("✅ Allowed CORS Origins:", allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, "");

        // Allow all localhost for easier development
        if (cleanOrigin.startsWith('http://localhost:')) {
            return callback(null, true);
        }

        // Allow any Vercel subdomain or the defined FRONTEND_URL
        if (!process.env.FRONTEND_URL ||
            allowedOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS Blocked: ${origin}. Not in: ${allowedOrigins}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Persistent Storage Confirmation
console.log(`📁 Persistent screenshot storage initialized at: ${path.join(__dirname, 'uploads')}`);

// --- DIAGNOSTICS & CORE ROUTES (TOP PRIORITY) ---
app.get('/api/ping', (req, res) => res.json({ status: 'online', time: new Date().toISOString() }));

app.get('/api/admin/test-email', async (req, res) => {
    console.log("--- GMail OAuth2 Test Request ---");
    try {
        if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
            throw new Error("Missing OAuth2 Credentials in environment.");
        }
        await sendEmailViaAPI({
            from: SENDER_EMAIL,
            to: ADMIN_EMAILS[0] || SENDER_EMAIL,
            subject: "ESTRALIS GMAIL API TEST 🚀",
            text: `GMail API (HTTPS Mode) is working!\nSender: ${SENDER_EMAIL}\nTime: ${new Date().toLocaleString()}`
        });
        res.status(200).json({ success: true, message: 'API Test email sent successfully!' });
    } catch (err) {
        console.error("❌ GMail API Failure:", err);
        logEmailError("ADMIN_TEST_API", err);
        res.status(500).json({
            success: false,
            message: `API Failed: ${err.message}`,
            code: err.code
        });
    }
});

// Diagnostic Route to read error logs in production
app.get('/api/admin/debug-mail', (req, res) => {
    const password = req.headers['x-admin-password'];
    if (password !== 'estralis@admin2026') return res.status(401).json({ success: false });

    const logPath = path.join(__dirname, 'email_errors.log');
    if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        res.status(200).send(`<pre>${content}</pre>`);
    } else {
        res.status(200).send("No email errors logged yet.");
    }
});
// ----------------------------------------------

// --- RAZORPAY & REGISTRATION ROUTES ---

// 1. Create Order
app.post('/api/create-order', async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay is not configured on the server. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your server/.env file.'
            });
        }

        const { amount, currency = 'INR', receipt } = req.body;

        // Convert amount to paise (Razorpay requirement)
        const amountInPaise = Math.round(parseFloat(amount.toString().replace(/₹/g, '')) * 100);

        const options = {
            amount: amountInPaise,
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ success: false, message: 'Failed to create Razorpay order. Check your server logs.' });
    }
});

// 2. Verify Payment & Save Registration (Razorpay - Legacy)
app.post('/api/verify-payment', async (req, res) => {
    // ... (keeping for backward compatibility or removing later)
    res.status(410).json({ success: false, message: 'Razorpay integration is disabled.' });
});

// 3. Manual Registration with Screenshot Upload
app.post('/api/register-manual', async (req, res) => {
    try {
        const { registrationData } = req.body;

        const {
            fullName, email, phone, college, teamName, teamMembers,
            eventTitle, category, amountPaid, passType,
            utrNumber, transactionDate, screenshotUrl
        } = registrationData;

        const result = await db.query(
            `INSERT INTO registrations (
                full_name, email, phone, college, team_name, team_members, 
                event_title, category, amount_paid, pass_type, 
                utr_number, transaction_date, screenshot_url, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *`,
            [
                fullName, email.trim().toLowerCase(), phone, college, teamName || null,
                JSON.stringify(teamMembers || []), eventTitle, category || 'Tech',
                amountPaid, passType, utrNumber, transactionDate, screenshotUrl, 'verified'
            ]
        );

        const newRegistration = result.rows[0];
        console.log(`✅ Manual Registration Saved (PostgreSQL) for ${eventTitle} by ${fullName}`);

        // Trigger confirmation email in background
        sendConfirmationEmail(newRegistration).catch(err => {
            console.error("Background email error:", err);
        });

        res.status(201).json({
            success: true,
            message: 'Registration submitted successfully. Pending verification.',
            data: newRegistration
        });

    } catch (error) {
        console.error("Manual Registration Error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// 4. Screenshot Upload Endpoint
app.post('/api/upload-screenshot', upload.single('screenshot'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        res.status(200).json({
            success: true,
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// Helper: Send Confirmation Email to User with Website Download Link
/**
 * Generates a professional PDF pass using pdfkit
 */
const generatePDFPass = (reg) => {
    return new Promise((resolve, reject) => {
        const mmToPt = 2.83465;
        const width = 100 * mmToPt;
        const height = 210 * mmToPt;

        const doc = new PDFDocument({
            size: [width, height],
            margins: { top: 0, left: 0, bottom: 0, right: 0 }
        });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Robust Category Normalization (Case-insensitive)
        const rawCat = reg.category || "Tech";
        const normalizedCategory = rawCat.trim().charAt(0).toUpperCase() + rawCat.trim().slice(1).toLowerCase();

        console.log(`DEBUG: Generating PDF for ${reg.email} | Event: ${reg.event_title} | Category: [${rawCat}] -> Normalized: [${normalizedCategory}]`);

        const activeColor = {
            Tech: { banner: '#0a0f1e', border: '#2dd4bf', accent: '#2dd4bf', label: '#2dd4bf' },
            Workshop: { banner: '#0a0f1e', border: '#0891b2', accent: '#0891b2', label: '#0891b2' },
            Fun: { banner: '#0a0f1e', border: '#d946ef', accent: '#d946ef', label: '#d946ef' }
        }[normalizedCategory] || { banner: '#0a0f1e', border: '#2dd4bf', accent: '#2dd4bf', label: '#2dd4bf' };

        const drawTicketLayout = (pageDoc, title = "ACCESS_PASS // 2026") => {
            // Dark Obsidian Background
            pageDoc.rect(0, 0, width, height).fill('#020617');
            
            // Background Glows (Manual Radial Emulation)
            pageDoc.save();
            pageDoc.opacity(0.15);
            pageDoc.fillColor(activeColor.border).circle(width, 0, 100 * mmToPt).fill();
            pageDoc.opacity(0.1);
            pageDoc.fillColor('#d946ef').circle(0, height, 100 * mmToPt).fill();
            pageDoc.restore();

            // Main Glassmorphic Container
            pageDoc.fillColor('#0a0f1e').roundedRect(5 * mmToPt, 5 * mmToPt, 90 * mmToPt, 200 * mmToPt, 12 * mmToPt).fill();
            pageDoc.lineWidth(0.5).strokeColor(activeColor.border + '33').roundedRect(5 * mmToPt, 5 * mmToPt, 90 * mmToPt, 200 * mmToPt, 12 * mmToPt).stroke();
            
            // Header Section
            pageDoc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text("ESTRALIS", 0, 15 * mmToPt, { align: 'center', characterSpacing: 1.5 });
            pageDoc.fillColor(activeColor.accent).fontSize(7).font('Helvetica-Bold').text(title, 0, 28 * mmToPt, { align: 'center', characterSpacing: 2 });
            
            // Tear Line (Refined)
            pageDoc.lineWidth(0.3).strokeColor('#1e293b').dash(1, { space: 3 }).moveTo(10 * mmToPt, 42 * mmToPt).lineTo(90 * mmToPt, 42 * mmToPt).stroke().undash();
        };

        // --- PAGE 1: LEADER ---
        drawTicketLayout(doc);
        let currentY = 52 * mmToPt;

        // EVENT PANEL (Professional Background)
        doc.fillColor('#ffffff08').roundedRect(12 * mmToPt, currentY, 76 * mmToPt, 25 * mmToPt, 6 * mmToPt).fill();
        doc.fillColor('#ffffff22').fontSize(6).font('Helvetica-Bold').text("TRANSMISSION_TARGET", 0, currentY + 5 * mmToPt, { align: 'center' });
        doc.fillColor('#ffffff').fontSize(15).font('Helvetica-Bold').text(reg.event_title.toUpperCase(), 15 * mmToPt, currentY + 10 * mmToPt, { width: 70 * mmToPt, align: 'center' });
        currentY += 35 * mmToPt;

        // LEADER SECTION (Telemetry Style)
        doc.fillColor(activeColor.accent).rect(15 * mmToPt, currentY, 1.5 * mmToPt, 12 * mmToPt).fill();
        doc.fillColor('#475569').fontSize(7).font('Helvetica-Bold').text("CORE_PARTICIPANT", 20 * mmToPt, currentY);
        doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text(reg.full_name.toUpperCase(), 20 * mmToPt, currentY + 5 * mmToPt);
        currentY += 25 * mmToPt;

        // INFO STACK (No Cropping)
        doc.fillColor('#475569').fontSize(7).font('Helvetica-Bold').text("INSTITUTION_AFFILIATION", 15 * mmToPt, currentY);
        currentY += 5 * mmToPt;
        doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text(reg.college.toUpperCase(), 15 * mmToPt, currentY, { width: 70 * mmToPt });
        currentY += 15 * mmToPt;

        doc.fillColor('#475569').fontSize(7).font('Helvetica-Bold').text("AUTHENTICATION_ID // UTR", 15 * mmToPt, currentY);
        currentY += 5 * mmToPt;
        doc.fillColor(activeColor.accent + '11').roundedRect(15 * mmToPt, currentY - 2*mmToPt, 70 * mmToPt, 12 * mmToPt, 3 * mmToPt).fill();
        doc.fillColor(activeColor.accent).fontSize(9).font('Helvetica-Bold').text(reg.utr_number || "VERIFIED_NODE", 18 * mmToPt, currentY + 2 * mmToPt);
        currentY += 25 * mmToPt;

        // SCAN AREA (Footer Page 1)
        doc.fillColor('#1e293b').rect(10 * mmToPt, 185 * mmToPt, 80 * mmToPt, 0.3 * mmToPt).fill();
        doc.fillColor('#475569').fontSize(6).font('Helvetica-Bold').text("TIMESTAMP", 15 * mmToPt, 190 * mmToPt);
        doc.fillColor('#64748b').fontSize(7).font('Helvetica').text(new Date().toLocaleString().toUpperCase(), 15 * mmToPt, 194 * mmToPt);
        
        doc.fillColor(activeColor.border + '11').roundedRect(72 * mmToPt, 188 * mmToPt, 13 * mmToPt, 13 * mmToPt, 4 * mmToPt).fill();
        doc.fillColor(activeColor.border).fontSize(5).font('Helvetica-Bold').text("SECURE SCAN", 72 * mmToPt, 193 * mmToPt, { width: 13 * mmToPt, align: 'center' });

        // --- PAGE 2: SQUAD (Professional Roster) ---
        if (reg.team_members && reg.team_members.length > 0) {
            doc.addPage({ size: [width, height], margins: { top: 0, left: 0, bottom: 0, right: 0 } });
            drawTicketLayout(doc, "SQUAD_ROSTER_MANIFEST // 2026");
            let squadY = 52 * mmToPt;

            if (reg.team_name) {
                doc.fillColor('#d946ef11').roundedRect(12 * mmToPt, squadY, 76 * mmToPt, 15 * mmToPt, 5 * mmToPt).fill();
                doc.fillColor('#475569').fontSize(6).font('Helvetica-Bold').text("DESIGNATED_TEAM", 16 * mmToPt, squadY + 3 * mmToPt);
                doc.fillColor('#d946ef').fontSize(11).font('Helvetica-Bold').text(reg.team_name.toUpperCase(), 16 * mmToPt, squadY + 8 * mmToPt);
                squadY += 22 * mmToPt;
            }

            reg.team_members.forEach((m, i) => {
                if (squadY > 180 * mmToPt) {
                    doc.addPage({ size: [width, height], margins: { top: 0, left: 0, bottom: 0, right: 0 } });
                    drawTicketLayout(doc, "UNIT_MANIFEST_CONT // 2026");
                    squadY = 52 * mmToPt;
                }
                doc.fillColor('#ffffff0a').rect(15 * mmToPt, squadY - 2*mmToPt, 70 * mmToPt, 10 * mmToPt).fill();
                doc.fillColor('#d946ef').fontSize(8).font('Helvetica-Bold').text(`#${i + 1}`, 18 * mmToPt, squadY + 1 * mmToPt);
                doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text(m.fullName.toUpperCase(), 25 * mmToPt, squadY + 1 * mmToPt);
                squadY += 5 * mmToPt;
                doc.fillColor('#64748b').fontSize(6).font('Helvetica').text(m.college || reg.college, 25 * mmToPt, squadY + 1 * mmToPt);
                squadY += 10 * mmToPt;
            });

            // Footer (Page 2)
            doc.fillColor('#475569').fontSize(7).font('Helvetica-Bold').text("PREPARE_FOR_ARRIVAL_2026", 0, 198 * mmToPt, { align: 'center', characterSpacing: 3 });
        }

        doc.end();
    });
};

const sendConfirmationEmail = async (reg) => {
    console.log(`📤 Attempting to send confirmation email to: ${reg.email}...`);
    try {
        // Generate PDF Buffer
        const pdfBuffer = await generatePDFPass(reg);
        // Get primary frontend URL for deep linking
        const primaryFrontend = process.env.FRONTEND_URL
            ? process.env.FRONTEND_URL.split(',')[0].trim().replace(/\/$/, "")
            : "https://estralisfest.vercel.app";

        const downloadUrl = `${primaryFrontend}/?openPass=true&email=${encodeURIComponent(reg.email)}&autoDownload=true`;

        const mailOptions = {
            from: SENDER_EMAIL,
            to: reg.email,
            subject: `Spot Secured! ${reg.event_title} is waiting for you 🚀`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; background: #ffffff; color: #1a202c;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #9333ea; margin: 0; font-size: 28px; letter-spacing: -0.025em;">ESTRALIS 2026</h1>
                        <p style="color: #718096; margin-top: 8px; font-weight: 500;">REGISTRATION SUCCESSFUL! ✅</p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${reg.full_name}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">Your spot for <strong>${reg.event_title}</strong> at ESTRALIS 2026 has been officially reserved! We are excited to see you there.</p>
                    
                    <div style="background: #f7fafc; border: 1px solid #edf2f7; padding: 25px; border-radius: 16px; margin: 30px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #718096; font-size: 14px; width: 120px;">Event Name:</td>
                                <td style="padding: 8px 0; font-weight: 700; color: #2d3748;">${reg.event_title}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #718096; font-size: 14px;">College:</td>
                                <td style="padding: 8px 0; font-weight: 700; color: #2d3748;">${reg.college}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #718096; font-size: 14px;">UTR Number:</td>
                                <td style="padding: 8px 0; font-weight: 700; color: #2d3748;">${reg.utr_number}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${downloadUrl}" 
                           style="background: #9333ea; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px 0 rgba(147, 51, 234, 0.39);">
                           DOWNLOAD OFFICIAL PDF PASS
                        </a>
                        <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
                            Access your pass anytime using <strong>TEAM LEADER GMAIL OR GMAIL USED DURING REGISTRATION</strong> on our website.
                        </p>
                    </div>

                    <div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 15px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 0; color: #6b46c1; font-size: 14px;">
                            <strong>NOTE:</strong> All participants are required to arrive at the venue (GIS Auditorium) by 9:00 AM.
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #a0aec0; text-align: center; margin-top: 40px;">
                        Estralis 2026 | Techno-Cultural Fest<br/>
                        GCEM, Bengaluru
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: `Estralis_Pass_${reg.full_name.replace(/\s+/g, '_')}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        await sendEmailViaAPI(mailOptions);
    } catch (err) {
        console.error(`❌ GMail API Error for ${reg.email}:`, err.message);
        logEmailError(reg.email, err);
    }
};


// Lookup registrations by email
app.get('/api/registrations/:email', async (req, res) => {
    try {
        const email = req.params.email.trim().toLowerCase();

        const result = await db.query(
            `SELECT * FROM registrations 
             WHERE LOWER(email) = LOWER($1) 
             OR EXISTS (
                 SELECT 1 FROM jsonb_array_elements(team_members) AS member 
                 WHERE LOWER(member->>'email') = LOWER($1)
             )
             ORDER BY timestamp DESC`,
            [email]
        );

        const data = result.rows;

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: 'No registrations found for this email address.' });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error("Lookup error:", error);
        res.status(500).json({ success: false, message: 'Server error during lookup' });
    }
});

// Admin registrations lookup
app.get('/api/admin/registrations', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const result = await db.query('SELECT * FROM registrations ORDER BY timestamp DESC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Admin registration fetch error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Delete registration
app.delete('/api/admin/registrations/:id', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { id } = req.params;
        await db.query('DELETE FROM registrations WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: 'Registration deleted' });
    } catch (error) {
        console.error("Admin delete error:", error);
        res.status(500).json({ success: false, message: 'Failed to delete registration' });
    }
});

// Admin: Update registration status
app.patch('/api/admin/registrations/:id', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { id } = req.params;
        const updates = req.body;

        // Build dynamic UPDATE query
        const keys = Object.keys(updates);
        if (keys.length === 0) return res.status(400).json({ success: false, message: 'No updates provided' });

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = [...Object.values(updates), id];

        await db.query(
            `UPDATE registrations SET ${setClause} WHERE id = $${values.length}`,
            values
        );

        res.status(200).json({ success: true, message: 'Registration updated successfully' });
    } catch (error) {
        console.error("Admin update error:", error);
        res.status(500).json({ success: false, message: 'Failed to update registration' });
    }
});

// Admin Bulk Action: Clear All Registrations
app.delete('/api/admin/registrations-all', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Wipe entire registrations table
        await db.query('TRUNCATE TABLE registrations RESTART IDENTITY');

        console.log(`🧹 Admin Bulk Wipe successful.`);
        res.status(200).json({
            success: true,
            message: `MASTER RESET SUCCESSFUL! Registrations cleared.`
        });
    } catch (error) {
        console.error("Admin Bulk Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server error during master reset' });
    }
});

// Get all event statuses (Public)
app.get('/api/events/status', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events_status');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Fetch Status Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching event statuses' });
    }
});

// Toggle event status (Admin)
app.post('/api/admin/events/toggle', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { eventTitle, isOpen } = req.body;

        const result = await db.query(
            `INSERT INTO events_status (title, is_open) 
             VALUES ($1, $2) 
             ON CONFLICT (title) DO UPDATE SET is_open = $2 
             RETURNING *`,
            [eventTitle, isOpen]
        );

        res.status(200).json({ success: true, data: result.rows[0], message: `Event ${isOpen ? 'Opened' : 'Closed'} Successfully` });
    } catch (error) {
        console.error("Toggle Error:", error);
        res.status(500).json({ success: false, message: 'Server error toggling event' });
    }
});

// Admin: Resend Confirmation Email
app.post('/api/admin/resend-confirmation/:id', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { id } = req.params;
        const result = await db.query('SELECT * FROM registrations WHERE id = $1', [id]);
        const data = result.rows[0];

        if (!data) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        console.log(`📧 Manual Resend Triggered for: ${data.email}`);

        res.status(200).json({
            success: true,
            message: `Confirmation email being resent to ${data.email}`
        });

        sendConfirmationEmail(data).catch(err => {
            console.error("Resend task error:", err);
        });
    } catch (error) {
        console.error("Single Resend Error:", error);
        res.status(500).json({ success: false, message: `Failed to resend email: ${error.message}` });
    }
});

// --- ADMIN: Resend Confirmation Emails to ALL existing registrations ---
app.post('/api/admin/resend-all-confirmations', async (req, res) => {
    console.log("--- Bulk Resend Confirmation Emails Request ---");
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const result = await db.query('SELECT * FROM registrations');
        const registrations = result.rows;

        if (!registrations || registrations.length === 0) {
            return res.status(404).json({ success: false, message: 'No registrations found.' });
        }

        // Respond immediately so the admin UI doesn't hang
        res.status(200).json({
            success: true,
            message: `Sending confirmation emails to ${registrations.length} registrations in background. This may take a few minutes.`,
            total: registrations.length
        });

        // Process emails in background with delay to avoid Gmail rate limits
        let sent = 0;
        let failed = 0;
        for (const reg of registrations) {
            try {
                await sendConfirmationEmail(reg);
                sent++;
                console.log(`📧 Bulk Resend [${sent}/${registrations.length}] - Sent to: ${reg.email}`);
            } catch (err) {
                failed++;
                console.error(`❌ Bulk Resend Failed for ${reg.email}:`, err.message);
            }
            // 3-second delay between emails to respect Gmail rate limits
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        console.log(`✅ Bulk Resend Complete! Sent: ${sent}, Failed: ${failed}, Total: ${registrations.length}`);
    } catch (error) {
        console.error("Bulk Resend Error:", error);
        // Response may already be sent, so just log
    }
});

// --- ROUTE REGISTRATION ENDS ---

app.post('/api/admin/send-report', async (req, res) => {
    console.log("--- New Email Report Request Received ---");
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const result = await db.query(
            "SELECT * FROM registrations WHERE status = 'verified' ORDER BY event_title ASC"
        );
        const registrations = result.rows;

        if (!registrations || registrations.length === 0) {
            return res.status(404).json({ success: false, message: 'No data to send' });
        }

        // 1. Create Excel Workbook
        const workbook = new ExcelJS.Workbook();
        const grouped = registrations.reduce((acc, curr) => {
            const title = curr.event_title || "Uncategorized";
            if (!acc[title]) acc[title] = [];
            acc[title].push(curr);
            return acc;
        }, {});

        Object.keys(grouped).sort().forEach(eventTitle => {
            const sheetName = eventTitle.substring(0, 31).replace(/[\\\?\*\[\]\/]/g, "");
            const worksheet = workbook.addWorksheet(sheetName);
            worksheet.columns = [
                { header: 'Registration Time', key: 'timestamp', width: 25 },
                { header: 'Team Name', key: 'teamName', width: 25 },
                { header: 'Full Name', key: 'fullName', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'College', key: 'college', width: 30 },
                { header: 'UTR Number', key: 'utrNumber', width: 25 },
                { header: 'Transaction Date', key: 'transactionDate', width: 20 },
                { header: 'Screenshot Link', key: 'screenshotUrl', width: 50 },
                { header: 'Squad Details', key: 'teamMembers', width: 60, style: { alignment: { wrapText: true, vertical: 'middle' } } },
            ];

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '9333EA' } };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            grouped[eventTitle].forEach(reg => {
                let members = [];
                try {
                    const rawMembers = reg.team_members || reg.teamMembers;
                    members = (typeof rawMembers === 'string') ? JSON.parse(rawMembers) : (rawMembers || []);
                } catch (e) {
                    console.error("Error parsing team members:", e);
                    members = [];
                }

                const teamCount = Array.isArray(members) ? members.length : 0;
                const totalParticipants = 1 + teamCount;

                // Create a comprehensive squad string for the leader row
                let squadDetails = "Solo Registration";
                if (teamCount > 0) {
                    squadDetails = `Total: ${totalParticipants} (Lead + ${teamCount})\n\n`;
                    members.forEach((m, idx) => {
                        squadDetails += `[MEMBER 0${idx + 2}]: ${m.fullName || 'N/A'}\nEmail: ${m.email || 'N/A'}\nPhone: ${m.phone || 'N/A'}\nCollege: ${m.college || reg.college}\n\n`;
                    });
                }

                // 1. Add Leader Row
                worksheet.addRow({
                    timestamp: reg.timestamp ? new Date(reg.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : "N/A",
                    teamName: reg.team_name || "N/A",
                    fullName: `[LEADER] ${reg.full_name}`,
                    email: reg.email,
                    phone: reg.phone,
                    college: reg.college,
                    utrNumber: reg.utr_number || "N/A",
                    transactionDate: reg.transaction_date || "N/A",
                    screenshotUrl: { text: reg.screenshot_url ? "View Proof" : "N/A", hyperlink: reg.screenshot_url || "" },
                    teamMembers: squadDetails
                });

            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const mailOptions = {
            from: SENDER_EMAIL,
            to: ADMIN_RECEIVER_EMAIL,
            subject: `Estralis Fest 2026 - Master Registration Report (${new Date().toLocaleDateString()})`,
            text: `Hello Admin,\n\nPlease find the attached automated registration report for Estralis Fest 2026.\n\nTotal Registrations (PostgreSQL): ${registrations.length}\nGenerated at: ${new Date().toLocaleString()}`,
            attachments: [
                {
                    filename: `Estralis_Master_Report_${Date.now()}.xlsx`,
                    content: buffer,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        };

        await sendEmailViaAPI(mailOptions);
        res.status(200).json({ success: true, message: 'Report emailed successfully!' });

    } catch (error) {
        console.error("CRITICAL Report API Error:", error);
        logEmailError("ADMIN_REPORT_API", error);
        res.status(500).json({
            success: false,
            message: `Failed to send report: ${error.message || 'Unknown error'}.`
        });
    }
});

// --- THEME REVEAL API (Supabase migration) ---
app.get('/api/theme/status', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM system_config');
        const config = result.rows.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            revealed: config['theme_revealed'] === 'true' || config['theme_revealed'] === true,
            title: config['theme_title'] || '',
            description: config['theme_description'] || ''
        });
    } catch (error) {
        console.error("Theme status error:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch theme status' });
    }
});

app.post('/api/admin/theme/update', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') return res.status(401).json({ success: false });

        const { revealed, title, description } = req.body;

        await db.query("INSERT INTO system_config (key, value) VALUES ('theme_revealed', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [revealed]);
        if (title !== undefined) await db.query("INSERT INTO system_config (key, value) VALUES ('theme_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [title]);
        if (description !== undefined) await db.query("INSERT INTO system_config (key, value) VALUES ('theme_description', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [description]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Theme update error:", error);
        res.status(500).json({ success: false });
    }
});

// Admin: Broadcast Bulk Email to all registrations
app.post('/api/admin/broadcast-email', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') return res.status(401).json({ success: false });

        const { subject, body, target, registrationId, venue } = req.body;

        const buildEventEmail = (reg) => {
            const instructionLines = body.split('\n').map(line => `<p style="margin: 10px 0;">${line}</p>`).join('');
            return `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7f6; padding: 40px; color: #1e293b;">
                        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 40px; border-top: 6px solid #9333ea;">
                            <h1 style="color: #9333ea; text-align: center; margin-bottom: 30px;">Estralis 2026 Info</h1>
                            <p>Hello <strong>${reg.full_name}</strong>,</p>
                            <div style="background: #fdf4ff; border-radius: 12px; padding: 20px; margin: 25px 0; color: #7e22ce; line-height: 1.6;">
                                ${instructionLines}
                            </div>
                            <p style="text-align: center; color: #94a3b8;">Venue: ${venue || 'GIS Auditorium'}</p>
                        </div>
                    </div>`;
        };

        if (target === 'individual' && registrationId) {
            const result = await db.query('SELECT * FROM registrations WHERE id = $1', [registrationId]);
            const reg = result.rows[0];
            if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

            await sendEmailViaAPI({ from: SENDER_EMAIL, to: reg.email, subject, html: buildEventEmail(reg) });
            return res.status(200).json({ success: true, message: `Email sent to ${reg.full_name}` });
        } else if (target === 'all') {
            const result = await db.query('SELECT * FROM registrations');
            const registrations = result.rows;
            if (!registrations.length) return res.status(404).json({ success: false, message: 'No registrations found' });

            for (const reg of registrations) {
                await sendEmailViaAPI({ from: SENDER_EMAIL, to: reg.email, subject, html: buildEventEmail(reg) });
                await new Promise(r => setTimeout(r, 500));
            }
            return res.status(200).json({ success: true, message: `Bulk emails sent successfully` });
        }
    } catch (error) {
        console.error("Event Mail error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
