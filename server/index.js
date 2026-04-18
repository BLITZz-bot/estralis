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
        const mmToPt = 2.8346;
        const width = 180 * mmToPt;
        const height = 260 * mmToPt;

        const doc = new PDFDocument({
            size: [width, height],
            margins: { top: 0, left: 0, bottom: 0, right: 0 }
        });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Background / Branding
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

        // Header Banner
        doc.rect(0, 0, doc.page.width, 140).fill('#9333ea');

        // Robust Category Normalization (Case-insensitive)
        const rawCat = reg.category || "Tech";
        const normalizedCategory = rawCat.trim().charAt(0).toUpperCase() + rawCat.trim().slice(1).toLowerCase();

        console.log(`DEBUG: Generating PDF for ${reg.email} | Event: ${reg.event_title} | Category: [${rawCat}] -> Normalized: [${normalizedCategory}]`);

        const colors = {
            bg: '#020617',
            card: '#0f172a',
            teal: '#2dd4bf',
            aqua: '#0891b2',
            dim: '#94a3b8'
        };

        const drawTicketBase = (pageDoc) => {
            // 1. OUTER SPACE BACKGROUND
            pageDoc.rect(0, 0, width, height).fill(colors.bg);

            // 2. TECH HUD ACCENTS
            pageDoc.strokeColor(colors.teal).lineWidth(0.5);
            // Top Left
            pageDoc.moveTo(10 * mmToPt, 10 * mmToPt).lineTo(25 * mmToPt, 10 * mmToPt);
            pageDoc.moveTo(10 * mmToPt, 10 * mmToPt).lineTo(10 * mmToPt, 25 * mmToPt).stroke();
            // Top Right
            pageDoc.moveTo(155 * mmToPt, 10 * mmToPt).lineTo(170 * mmToPt, 10 * mmToPt);
            pageDoc.moveTo(170 * mmToPt, 10 * mmToPt).lineTo(170 * mmToPt, 25 * mmToPt).stroke();
            // Bottom Left
            pageDoc.moveTo(10 * mmToPt, 250 * mmToPt).lineTo(25 * mmToPt, 250 * mmToPt);
            pageDoc.moveTo(10 * mmToPt, 250 * mmToPt).lineTo(10 * mmToPt, 235 * mmToPt).stroke();
            // Bottom Right
            pageDoc.moveTo(155 * mmToPt, 250 * mmToPt).lineTo(170 * mmToPt, 250 * mmToPt);
            pageDoc.moveTo(170 * mmToPt, 250 * mmToPt).lineTo(170 * mmToPt, 235 * mmToPt).stroke();

            // 3. MAIN CARD
            pageDoc.fillColor(colors.card).roundedRect(12 * mmToPt, 12 * mmToPt, 156 * mmToPt, 236 * mmToPt, 10 * mmToPt).fill();
            pageDoc.strokeColor('rgba(45, 212, 191, 0.2)').roundedRect(12 * mmToPt, 12 * mmToPt, 156 * mmToPt, 236 * mmToPt, 10 * mmToPt).stroke();

            // 4. HEADER SECTION
            pageDoc.fillColor(colors.bg).rect(12 * mmToPt, 12 * mmToPt, 156 * mmToPt, 50 * mmToPt).fill();
            pageDoc.strokeColor(colors.teal).moveTo(12 * mmToPt, 62 * mmToPt).lineTo(168 * mmToPt, 62 * mmToPt).stroke();

            // HEADER Text (Synced with 83mm offset)
            pageDoc.font('Helvetica-Bold').fontSize(26).fillColor(colors.aqua).opacity(0.4)
                .text("ESTRALIS 2026", (83 - 90) * mmToPt, 35 * mmToPt, { align: 'center', width: width, characterSpacing: 1 });
            pageDoc.opacity(1).fillColor('#ffffff')
                .text("ESTRALIS 2026", (83 - 90) * mmToPt, 35 * mmToPt, { align: 'center', width: width, characterSpacing: 1 });

            // SLOGAN (Synced with 70mm manual adjustment)
            pageDoc.fontSize(8.5).font('Helvetica').fillColor(colors.teal)
                .text("THE INTERSTELLAR SYMPOSIUM", (70 - 90) * mmToPt, 43 * mmToPt, { align: 'center', width: width, characterSpacing: 1.5 * mmToPt });

            // SECURE ID (Synced with 89mm)
            pageDoc.fontSize(7).fillColor(colors.dim)
                .text("OFFICIAL SECTOR ADMISSION PASS // SECURE_ID: 2026-AST-R", (89 - 90) * mmToPt, 50 * mmToPt, { align: 'center', width: width });

            // FOOTER - Synced with RegistrationForm latest text
            pageDoc.fontSize(7).font('Helvetica-Oblique').fillColor(colors.dim)
                .text("PLEASE SUBMIT THE ACCESS PASS AT THE REGISTERATION DESK", 0, 243 * mmToPt, { align: 'center', width: width });
        };

        drawTicketBase(doc);
        const startY = 80 * mmToPt;
        doc.fillColor(colors.teal).font('Helvetica-Bold').fontSize(8).text("TRANSACTION_ID //", 20 * mmToPt, startY);
        doc.fillColor('#ffffff').fontSize(14).font('Courier-Bold').text((reg.utr_number || "PENDING").toUpperCase(), 20 * mmToPt, startY + 8 * mmToPt);

        // VERIFIED Badge
        doc.strokeColor(colors.teal).lineWidth(0.5).roundedRect(130 * mmToPt, startY + 2 * mmToPt, 30 * mmToPt, 10 * mmToPt, 2 * mmToPt).stroke();
        doc.fillColor(colors.teal).fontSize(9).font('Helvetica-Bold').text("VERIFIED", (145 - 90) * mmToPt, startY + 9 * mmToPt, { width: width, align: 'center' });

        // EVENT TITLE (Synced with 85mm offset)
        doc.fillColor('#ffffff').fontSize(32).font('Helvetica-Bold')
           .text(reg.event_title.toUpperCase(), (85 - 90) * mmToPt, startY + 35 * mmToPt, { align: 'center', width: width, characterSpacing: 1 * mmToPt });
        // CATEGORY TAG (Synced with 87mm box / 85mm text)
        const catTextContent = (reg.category || 'TECH').toUpperCase();
        doc.fontSize(8);
        const tagWidthValue = doc.widthOfString(catTextContent) + 10 * mmToPt;
        doc.fillColor(colors.teal).roundedRect((87 * mmToPt) - (tagWidthValue/2), startY + 40 * mmToPt, tagWidthValue, 8 * mmToPt, 4 * mmToPt).fill();
        doc.fillColor(colors.bg).text(catTextContent, (85 - 90) * mmToPt, startY + 45.5 * mmToPt, { align: 'center', width: width, characterSpacing: 2 * mmToPt });
Line 432: 
Line 433:         // LOGISTICS
Line 434:         doc.fillColor('rgba(30, 41, 59, 0.4)').roundedRect(20 * mmToPt, startY + 55 * mmToPt, 140 * mmToPt, 30 * mmToPt, 5 * mmToPt).fill();
Line 435:         doc.fillColor(colors.teal).fontSize(9).font('Helvetica-Bold').text("LOCATION", 30 * mmToPt, startY + 65 * mmToPt);
Line 436:         doc.text("ARRIVAL_TIME", 100 * mmToPt, startY + 65 * mmToPt);
Line 437:         doc.fillColor('#ffffff').fontSize(10).font('Helvetica').text(reg.event_location || "TBA", 30 * mmToPt, startY + 72 * mmToPt, { width: 60 * mmToPt });
Line 438:         doc.text(reg.event_time || "TBA", 100 * mmToPt, startY + 72 * mmToPt);

        // PARTICIPANT DATA
        let currentYPos = (startY + 90 * mmToPt);
        doc.strokeColor(colors.teal).lineWidth(0.5).moveTo(20 * mmToPt, currentYPos).lineTo(160 * mmToPt, currentYPos).stroke();
        currentYPos += 10 * mmToPt;
        doc.fillColor(colors.teal).fontSize(8).font('Helvetica-Bold').text("PARTICIPANT_IDENTIFIER //", 20 * mmToPt, currentYPos);
        currentYPos += 10 * mmToPt;
        if (reg.team_name) {
            doc.fillColor(colors.teal).fontSize(11).font('Helvetica-Bold').text(`TEAM: ${reg.team_name.toUpperCase()}`, 20 * mmToPt, currentYPos);
            currentYPos += 9 * mmToPt;
        }
        doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text(reg.full_name.toUpperCase(), 20 * mmToPt, currentYPos);
        currentYPos += 10 * mmToPt;
        doc.fillColor(colors.dim).fontSize(10).font('Helvetica').text(`Institute: ${reg.college}`, 20 * mmToPt, currentYPos);
        currentYPos += 6 * mmToPt;
        doc.text(`Email: ${reg.email}`, 20 * mmToPt, currentYPos);
        currentYPos += 6 * mmToPt;
        doc.text(`Phone: ${reg.phone}`, 20 * mmToPt, currentYPos);

        // FEE SECTION
        doc.fillColor(colors.teal).fontSize(8).font('Helvetica-Bold').text(reg.pass_type === 'Combo Pass' ? "COMBO_PASS_FEE" : "BASE_FEE", 20 * mmToPt, 232 * mmToPt);
        doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(`Rs. ${reg.amount_paid}`, 20 * mmToPt, 240 * mmToPt);

        if (reg.team_members && reg.team_members.length > 2) {
            doc.addPage({ size: [width, height], margins: { top: 0, left: 0, bottom: 0, right: 0 } });
            drawTicketBase(doc);
            let teamY = 80 * mmToPt;
            doc.fillColor(colors.teal).fontSize(10).font('Helvetica-Bold').text("TEAM MEMBERS //", 20 * mmToPt, teamY);
            teamY += 15 * mmToPt;
            
            const members = typeof reg.team_members === 'string' ? JSON.parse(reg.team_members) : reg.team_members;
            members.forEach((m, i) => {
                if (teamY > 210 * mmToPt) { doc.addPage({ size: [width, height], margins: { top: 0, left: 0, bottom: 0, right: 0 } }); drawTicketBase(doc); teamY = 80 * mmToPt; }
                doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text(m.fullName.toUpperCase(), 30 * mmToPt, teamY);
                teamY += 6 * mmToPt;
                doc.fillColor(colors.dim).fontSize(9).font('Helvetica').text(`${m.email} | ${m.phone}`, 30 * mmToPt, teamY);
                teamY += 12 * mmToPt;
            });
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
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #020617; color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(45, 212, 191, 0.2); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                    <!-- Header Mirror -->
                    <div style="background: #0f172a; padding: 40px 20px; text-align: center; border-bottom: 1px solid #2dd4bf;">
                        <p style="color: #2dd4bf; font-size: 10px; font-weight: 900; letter-spacing: 0.5em; margin: 0 0 10px 0; text-transform: uppercase;">ESTRALIS 2026 // SECURE_REGISTRY</p>
                        <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: -0.05em; text-transform: uppercase; font-weight: 900;">${reg.event_title}</h1>
                    </div>
                    
                    <div style="padding: 40px; background: linear-gradient(180deg, #0f172a 0%, #020617 100%);">
                        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 24px;">Hello <strong style="color: #2dd4bf;">${reg.full_name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.7); margin-bottom: 30px;">Your coordinates are locked! Your spot for <strong style="color: #ffffff;">${reg.event_title}</strong> at ESTRALIS 2026 has been officially verified and reserved.</p>
                        
                        <!-- Mini Card Mirror -->
                        <div style="background: rgba(45, 212, 191, 0.05); border: 1px solid rgba(45, 212, 191, 0.2); padding: 25px; border-radius: 16px; margin: 30px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; color: rgba(45, 212, 191, 0.6); font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; width: 140px;">Sector:</td>
                                    <td style="padding: 10px 0; font-weight: 700; color: #ffffff; font-size: 15px;">${reg.category || 'Tech'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: rgba(45, 212, 191, 0.6); font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">Institute:</td>
                                    <td style="padding: 10px 0; font-weight: 700; color: #ffffff; font-size: 15px;">${reg.college}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: rgba(45, 212, 191, 0.6); font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">Transaction_ID:</td>
                                    <td style="padding: 10px 0; font-weight: 700; color: #2dd4bf; font-family: monospace; font-size: 16px;">${reg.utr_number}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin-bottom: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Official Invitation Attached Below</p>
                            <a href="${downloadUrl}" 
                               style="background: #2dd4bf; color: #020617; padding: 20px 40px; border-radius: 12px; font-weight: 900; text-decoration: none; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; box-shadow: 0 0 30px rgba(45, 212, 191, 0.3);">
                               Download Pass Mirror
                            </a>
                        </div>

                        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; margin-top: 30px; text-align: center;">
                            <p style="margin: 0; color: #2dd4bf; font-size: 13px; font-weight: 800; letter-spacing: 0.05em;">
                                REPORT TO VENUE: 9:00 AM SHARP
                            </p>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 500;">
                                Estralis 2026 | GCEM, Bengaluru
                            </p>
                        </div>
                    </div>
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

// Admin Delete Single Registration
app.delete('/api/admin/registrations/:id', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { id } = req.params;
        await db.query('DELETE FROM registrations WHERE id = $1', [id]);

        console.log(`🗑 Admin Deleted Registration: ${id}`);
        res.status(200).json({
            success: true,
            message: `Registration deleted successfully.`
        });
    } catch (error) {
        console.error("Admin Single Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration deletion' });
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
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { title, description, revealed } = req.body;
        const updates = [];

        if (title !== undefined) updates.push({ key: 'theme_title', value: title });
        if (description !== undefined) updates.push({ key: 'theme_description', value: description });
        if (revealed !== undefined) updates.push({ key: 'theme_revealed', value: revealed });

        if (updates.length > 0) {
            for (const update of updates) {
                await db.query(
                    'INSERT INTO system_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
                    [update.key, update.value.toString()]
                );
            }
        }

        console.log(`🎬 Theme Config Updated — Revealed: ${revealed}`);
        res.status(200).json({ success: true, message: 'Theme config updated' });
    } catch (error) {
        console.error("Theme update error:", error);
        res.status(500).json({ success: false, message: 'Failed to update theme config' });
    }
});

// --- THEME VERIFY EMAIL ---
app.post('/api/theme/verify', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const ALLOWED_EVENTS = ['HIGHLIGHT REEL', 'SHOT CUT'];
        const result = await db.query(
            "SELECT * FROM registrations WHERE LOWER(email) = LOWER($1) AND event_title ANY($2)",
            [email.trim(), ALLOWED_EVENTS]
        );
        const data = result.rows[0];

        if (!data) {
            return res.status(200).json({ success: false, verified: false, message: 'This reveal is exclusively for Highlight Reel & Shot Cut leaders.' });
        }

        res.status(200).json({ success: true, verified: true, name: data.full_name });
    } catch (error) {
        console.error("Theme verify error:", error);
        res.status(500).json({ success: false, message: 'Server error during verification' });
    }
});

// --- ADMIN: Send Custom Event Day Email ---
app.post('/api/admin/send-event-mail', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'estralis@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { target, registrationId, subject, body, arrivalTime, venue, contactName, contactPhone } = req.body;

        if (!subject || !body) {
            return res.status(400).json({ success: false, message: 'Subject and body are required' });
        }

        const buildEventEmail = (reg) => {
            const instructionLines = body.split('\n').filter(l => l.trim()).map(line =>
                `<tr><td style="padding: 8px 0; padding-left: 20px; color: #e2e8f0; font-size: 15px; line-height: 1.7; border-left: 3px solid #7c3aed;">${line.trim()}</td></tr>`
            ).join('');

            return `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #0f111a; color: #e2e8f0; border-radius: 24px; overflow: hidden; border: 1px solid #1e1e3a;">
                        <div style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 900;">ESTRALIS 2026</h1>
                        </div>
                        <div style="padding: 35px 30px;">
                            <p style="font-size: 17px; color: #f1f5f9; margin-bottom: 5px;">Hello <strong>${reg.full_name}</strong>,</p>
                            <div style="background: #1a1c2e; border: 1px solid #2d2f4a; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
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

