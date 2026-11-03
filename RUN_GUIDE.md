# 🚀 CivicSense / নাগৰিক দৃষ্টি - Execution & Features Guide

Welcome to the updated, enterprise-grade **CivicSense** platform!

---

## ⚡ How to Run in Two Separate Tabs

### 🖥️ Terminal Tab 1: Backend API Server
```powershell
cd backend
npm start
```
*Backend runs on: **`http://localhost:5001`***  
*(API Health check: `http://localhost:5001/api/health`)*

---

### 🌐 Terminal Tab 2: Frontend Web Application
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs on: **`http://localhost:5173`***

Open your browser and visit:
👉 **`http://localhost:5173`**

---

## 👥 Three Roles & Authentication Credentials

Click the **Profile / Sign In** button in the top navbar to switch profiles or sign in:

### 1. 🛡️ Profile 1: Super Administrator
* **Demo Username / ID**: `CampusAdminX1`
* **Demo Password**: `CivicSecure#2026`
* **Administrative Powers**:
  * **Security & Change Password**: For maximum security, the public "Forgot Password" option is removed for Admin. Once logged in, Admin can change their password anytime in the **Settings & Policies** tab.
  * **Interactive Map Geo-Placement**: Pin new campus places/buildings to the map by specifying **X/Y coordinates (%)** or by **Distance (meters) and Direction from any Department** with a live visual radar preview.
  * **Student Access ON/OFF Switch**: Toggle any student's portal access ON or OFF directly in the users table.
  * **Add Pre-Admission Roll Numbers**: Pre-register new admission roll numbers and student names into the official university admission roster.
  * **Create Worker Profiles**: Issue maintenance credentials (Worker ID, Name, Department, Phone, Password) to campus technicians.
  * **Delete Work Orders**: Permanently delete any grievance or work order if deemed invalid or duplicate.
  * **Dynamic Categories & Locations**: Add, edit, or delete campus categories and campus zones with instant persistence.
  * **AI Dispatch Policy Setting**: Toggle between *Direct AI Auto-Dispatch* and *Admin Permission Required*.
  * **Live Database Viewer**: Live inspector that visualizes all database collections (`issues`, `users`, `studentRoster`, `categories`, `locations`, `settings`).

---

### 2. 🔧 Profile 2: Campus Maintenance Workers / Technicians
* **Account Creation**: Only the Admin can create Worker accounts!
* **Pre-seeded Demo Workers**:
  * Electrician: `WRK-ELEC01` / `worker@123` (Demo Electrician)
  * Plumber: `WRK-PLUMB01` / `worker@123` (Demo Plumber)
  * Network Tech: `WRK-NET01` / `worker@123` (Demo Network Technician)
  * Security Inspector: `WRK-SEC01` / `worker@123` (Demo Security Inspector)
* **Worker Portal Features**:
  * View work orders dispatched to them or their trade department.
  * See the student's **Specific Campus Address** (e.g., *Hostel 4, 3rd Floor, Room 302*).
  * Update work status (`in_progress` -> `resolved`).
  * Add technical repair notes.
  * Upload post-repair photo proof (`resolutionProof`).
* **Forgot Password**: Enter **Worker ID** + **Registered Mobile Number** (e.g. `WRK-ELEC01` + `0000000000`).

---

### 3. 🎓 Profile 3: University Students
* **Student Registration Workflow (Admission Verification)**:
  * Click **"Sign In / পঞ্জীয়ন"** -> Select **"Student"** -> Click **"Create Student ID"**.
  * Enter your **Admission Roll No.** and **Full Name**.
  * The system verifies them against the official university pre-admission roster!
  * *Demo available roster entry*:
    * Roll No: `ASU2026-106`
    * Name: `Demo Applicant`
    * Phone: `0000000000`
  * Once matched, the student sets their password and their ID is created!
* **Pre-registered Demo Student**:
  * Roll No / ID: `ASU2026-101` / `student@123` (Demo Student One)
* **Grievance Filing**:
  * Students can write their complaint in **Assamese (অসমীয়া)** or **English**.
  * Dedicated **Specific Campus Address & Room No.** field so maintenance can locate the problem immediately.
  * Multimodal photo evidence attachment.
  * Real-time AI Pre-Check preview of category, priority, and duplicate alerts.
* **Forgot Password**: Enter **Admission Roll No.** + **Registered Mobile Number** (e.g. `ASU2026-101` + `0000000000`).

---

## 🌐 Language Support
Click the language toggle in the top-right navbar to switch the entire application between **English (EN)** and **অসমীয়া (AS)** at any time!
