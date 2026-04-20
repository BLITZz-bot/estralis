# 🚀 Estralis Fest 2026

**Estralis 2026** is the official professional techno-cultural fest platform for Gopalan College of Engineering and Management (GCEM). This full-stack repository contains a high-performance frontend for event registrations and a robust Node.js backend for secure data management and automated high-fidelity pass generation.

---

## 🌟 Key Features

### 🏆 Premium Event Dashboard
- **Dynamic Scheduling**: Real-time event updates and category-based filtering.
- **Interactive UI**: Motion-enhanced experience powered by Framer Motion and Tailwind CSS.
- **Prize Pool Announcements**: Integrated showcase for event rewards and competitions.

### 🎟️ Automated Registration System
- **High-Fidelity PDF Passes**: Automated generation of dark-themed, premium access passes matching the website design.
- **Team Registration Support**: Multi-page PDF generation for team events with leader and member details.
- **Verification System**: Professional "VERIFIED" badge and automated transaction ID (UTR) tracking.
- **Deep-Link Integration**: Quick access to passes via automated Gmail confirmation links.

### 🛡️ Secure Backend Infrastructure
- **PostgreSQL Integration**: Robust data storage for participants using Supabase or Neon.
- **Cloudinary Storage**: Secure, high-speed hosting for payment proof and screenshots.
- **GMail API Automation**: Reliable HTTPS-based confirmation system with PDF attachments.
- **Admin Control**: Centralized dashboard for registration management and reporting.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.0, Framer Motion, jsPDF
- **Backend**: Node.js, Express, PostgreSQL, Cloudinary, GMail API, PDFKit
- **DevOps**: Vercel (Frontend), Render/Hostinger (Backend)

---

## 🚀 Installation & Local Development

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Git**
- **A PostgreSQL database** (e.g., Neon.tech or local instance)

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
   VITE_RAZORPAY_KEY_ID=your_key_here
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
   DATABASE_URL=your_postgresql_url
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SENDER_EMAIL=your_gmail@gmail.com
   SENDER_PASSWORD=your_app_password
   GMAIL_CLIENT_ID=your_oauth_client_id
   GMAIL_CLIENT_SECRET=your_oauth_client_secret
   GMAIL_REFRESH_TOKEN=your_oauth_refresh_token
   ```
4. Run the server:
   ```bash
   node index.js
   ```

---

## 📧 GMail API Configuration
To enable automated emails, you must:
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Gmail API**.
3. Create **OAuth 2.0 Credentials** and get your Client ID and Client Secret.
4. Generate a **Refresh Token** using the OAuth2 Playground.

---

## 👨‍💻 Ownership & Credits

Developed and envisioned by **[Bharatha01](https://github.com/BLITZz-bot)**.
Lead Developer & System Architect.

---

## 📄 License
This project is proprietary and built specifically for **Estralis Fest 2026**.

*“Coding the rhythm of the future.”* 🎶✨
