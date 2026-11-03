# 🏛️ CivicSense / নাগৰিক দৃষ্টি
### Bilingual AI Smart Campus Issue Management System
**Problem Statement: PS-04** | *Full-Stack Multimodal Grievance Triage & Resolution Platform*

---

## 📖 Executive Summary
**CivicSense (নাগৰিক দৃষ্টি)** is an enterprise-grade AI grievance and campus infrastructure management platform designed for higher-educational institutions. It empowers students, maintenance staff, and campus administrators to report, coordinate, and resolve grievances with native support for both **Assamese (অসমীয়া)** and **English**.

---

## 👥 Three Enterprise Profiles & Permission Matrix

### 1. 🛡️ Super Administrator (`CampusAdminX1`)
* **Demo Credentials** (change these before deploying):
  * **Username**: `CampusAdminX1`
  * **Password**: `CivicSecure#2026`
* **Administrative Capabilities**:
  * **Security & Change Password**: Public "Forgot Password" is removed for Admin. Admin can update their password anytime inside the Admin Command Center (**Settings & Policies** tab).
  * **Interactive Map Geo-Placement**: Pin new campus places/buildings to the map by specifying **X/Y coordinates (%)** or by **Distance (meters) and Direction from any Department** with a live visual radar preview.
  * **Student Access Switch (ON/OFF)**: View all registered students with a one-click toggle button to activate or suspend portal access.
  * **Pre-Admission Roster Control**: Add approved student admission roll numbers and names for admission verification.
  * **Worker Credential Issuance**: Create technician accounts (Worker ID, Name, Trade Department, Phone, Password).
  * **Work Order Deletion**: Permanently delete invalid, completed, or spam grievances.
  * **Dynamic Categories & Locations**: Add, edit, or delete grievance categories and campus building zones with instant persistent database sync.
  * **AI Auto-Dispatch Policy**: Toggle between *Direct AI Auto-Dispatch to Workers* and *Admin Approval Required Before Dispatch*.
  * **Live Database Inspector**: Real-time browser that visualizes all database collections (`issues`, `users`, `studentRoster`, `categories`, `locations`, `settings`).

### 2. 🔧 Campus Maintenance Workers
* **Account Creation**: Worker profiles cannot be created publicly; they are exclusively created and managed by the Admin.
* **Pre-seeded Workers**:
  * Electrician: `WRK-ELEC01` / `worker@123` (Demo Electrician)
  * Plumber: `WRK-PLUMB01` / `worker@123` (Demo Plumber)
  * Network Tech: `WRK-NET01` / `worker@123` (Demo Network Technician)
  * Security: `WRK-SEC01` / `worker@123` (Demo Security Inspector)
* **Worker Portal Features**:
  * View active work orders dispatched to their department.
  * Inspect the complainant's **Specific Campus Address & Room No.**.
  * Change task status (`in_progress` -> `resolved`).
  * Add technical resolution notes and attach post-repair photo proof (`resolutionProof`).
* **Forgot Password Recovery**: Requires entering **Worker ID** + **Registered Phone Number**.

### 3. 🎓 Students (Verified Admission)
* **Pre-Admission Verification Sign-Up**:
  * To create an account, the student must provide their **Admission Roll No.** and **Full Name**.
  * The system matches them against the campus pre-admission roster.
  * Once matched, the student sets their personal password and phone number.
  * *Demo Available Roster Record*: `ASU2026-106` | Name: `Demo Applicant` | Phone: `0000000000`.
  * **Pre-registered Student**: `ASU2026-101` / `student@123` (Demo Student One).
* **Grievance Submission**:
  * File complaints in Assamese or English.
  * Dedicated **Specific Campus Address** field (e.g. *Hostel 4, 3rd Floor, Washroom 302*).
  * Multimodal photo evidence attachment with real-time AI pre-check.
* **Forgot Password Recovery**: Requires entering **Admission Roll No.** + **Registered Phone Number**.

---

## ⚡ How to Run in Two Separate Tabs

### 🖥️ Tab 1: Start Backend Server
```powershell
cd backend
npm start
```
*Backend runs on: `http://localhost:5001`*

### 🌐 Tab 2: Start Frontend Web Application
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🏛️ Technology Stack
* **Frontend**: React 18, Vite 6, Tailwind CSS 3.4, Lucide Icons, Canvas Confetti.
* **Backend**: Node.js, Express 4.21, Multer, CORS, Dotenv, UUID.
* **Database**: Persistent disk-backed JSON database with atomic file rename operations (`backend/data/issues.json`).
* **AI & Linguistics**: Native Assamese Unicode normalization (NFC), tokenization, Eastern Nagari digit mapping, semantic duplicate detection (94%+ correlation), and multimodal visual hazard extraction.

> Demo accounts and passwords in this repository are public examples only. Change them and configure real contact details before deployment.
