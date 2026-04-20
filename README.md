# 🚀 Estralis Fest 2026

**Estralis 2026** is the official professional techno-cultural fest platform for Gopalan College of Engineering and Management (GCEM). This full-stack repository contains a high-performance frontend for event registrations and a robust Node.js backend for secure data management, real-time slot tracking, and automated high-fidelity pass generation.

---

## 🌟 Key Features

### 🏆 Premium Event Dashboard
- **Dynamic Scheduling**: Real-time event updates and category-based filtering.
- **Interactive UI**: Motion-enhanced experience powered by Framer Motion and Tailwind CSS.
- **Differentiated Competitions**: Seamless support for multi-round events (e.g., Fitness Challenge A/B).

### 🎟️ Smart Registration & QR Access Pass
- **High-Fidelity PDF Passes**: Automated generation of premium, dark-themed access passes.
- **Secure QR Tracking**: Unique QR codes encoded with registration IDs for instant venue entry.
- **Team Registration Support**: Multi-page PDF generation for team events with leader and member details.
- **Verification System**: Professional "VERIFIED" badge and automated transaction ID (UTR) tracking.

### 🛡️ Secure Admin Infrastructure
- **Real-Time Slot Control**: Dedicated dashboard to monitor headcount and manually override event registration status (ONLINE/SOLD OUT).
- **Integrated Scanner**: Built-in camera-based QR scanner for security personnel to verify attendees at the gate.
- **Colleges Management**: Controlled list of allowed institutions to manage event eligibility.
- **Automated Reporting**: One-click Excel exports and bulk registration report emails.
- **PostgreSQL Persistence**: Robust data storage with **Zero-Touch Auto-Initialization** (tables are created automatically on first run).
- **GMail API Automation**: High-speed HTTPS-based confirmation system with PDF attachments (via REST API).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.0, Framer Motion, jsPDF, qrcode-generator
- **Backend**: Node.js, Express, PostgreSQL, Cloudinary, GMail API, PDFKit
- **Storage**: Cloudinary (Payment Screens), PostgreSQL (Core Records)

---

## 🚀 Installation & Local Development

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Git**
- **A PostgreSQL database** (e.g., Neon.tech, Supabase, or a local instance)

### 1. Clone the Project
```bash
git clone https://github.com/BLITZz-bot/estralis.git
cd estralis
```

### 2. Frontend Setup (estralis folder)
1. Navigate to the frontend directory:
   ```bash
   cd estralis
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Backend Setup (server folder)
1. Open a new terminal and navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   # Database (Auto-initializes tables on connect)
   DATABASE_URL=your_postgresql_url

   # Cloudinary (For payment screenshots)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # GMail API (REST Mode for reliability)
   SENDER_EMAIL=your_gmail@gmail.com
   GMAIL_CLIENT_ID=your_oauth_client_id
   GMAIL_CLIENT_SECRET=your_oauth_client_secret
   GMAIL_REFRESH_TOKEN=your_oauth_refresh_token

   # App Configuration
   ADMIN_RECEIVER_EMAIL=your_admin_email@gmail.com
   FRONTEND_URL=http://localhost:5173
   ```
4. Run the server:
   ```bash
   node index.js
   ```

---

## 📧 GMail API Configuration
To enable automated emails with PDF attachments, the system uses the Gmail REST API (much more reliable than standard SMTP in cloud environments):
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Gmail API**.
3. Create **OAuth 2.0 Credentials** and obtain your Client ID and Client Secret.
4. Use the GMail OAuth2 scope (`https://www.googleapis.com/auth/gmail.send`) to generate a **Refresh Token**.

---

## 🔐 Administrative Access
- **Primary Dashboard**: Accessible via the admin path with password `admin@2026`.
- **High-Security Controls**: Sensitive actions (Slot Control, Colleges, Bulk Emailer) require the secondary authorization code `bharatha2111`.

---

## 👨‍💻 Ownership & Credits

Developed and envisioned by **[Bharatha01](https://github.com/BLITZz-bot)**.
Lead Developer & System Architect.

---

## 📄 License
This project is proprietary and built specifically for **Estralis Fest 2026**.

*“Coding the rhythm of the future.”* 🎶✨

