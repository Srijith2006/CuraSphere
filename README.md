# CuraSphere | Smart Clinic Appointment System

**CuraSphere** is a professional full-stack healthcare ecosystem designed to bridge the gap between patients and specialized medical care. By streamlining the appointment lifecycle, CuraSphere eliminates traditional scheduling hurdles through an intuitive, role-based digital interface inspired by modern, clean aesthetic principles.

---

## Overview
CuraSphere provides a seamless experience for both healthcare seekers and providers. It features a modern, responsive design built with a focus on clinical efficiency, utilizing a dual-dashboard system to manage the flow of medical consultations from initial request to finalized record.

---

## Key Features

### User Experience (Patients)
* **Specialist Discovery:** Browse doctors by department (Cardiology, Neurology, etc.) with verified professional bios and experience details.
* **Real-time Booking:** A robust engine that allows patients to select available dates and time slots with instant validation.
* **Appointment Tracking:** A dedicated "My Appointments" section to monitor the status of requests (Pending, Confirmed, or Cancelled).
* **Modern Identity:** A sleek, "Sora" font-driven interface with a professional navy and teal aesthetic, featuring glassmorphic elements.

### Administrative Capabilities (Doctors)
* **Professional Dashboard:** A centralized overview of total patient volume, daily workload, and pending actions.
* **Slot Management:** An integrated tool for doctors to set and manage their availability slots with one-click updates.
* **Decision-Based Workflow:** Explicit control to **Confirm** or **Cancel** requests, providing immediate clarity to the patient.
* **Consultation Finalization:** A secure environment to add and save professional consultation notes for every patient visit.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, Axios, CSS3 (Custom Properties & Animations) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens) & React Context API |
| **Versioning** | Git & GitHub |

---

## ⚙️ Installation & Setup

---

## 1. Clone the Repository
```bash
git clone https://github.com/Srijith2006/CuraSphere.git
cd CuraSphere
```
## 2. Install Dependencies
#### Backend
```Bash
cd backend
npm install
```
#### Frontend
```Bash
cd ../frontend
npm install
```

## 3. Environment Configuration
#### Create a .env file in the backend directory and configure the following:
```Code snippet
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_private_key
```

## 4. Run the Application
#### Start Backend Server
```Bash
cd backend
npm start
```
#### Start Frontend 
```Bash
cd ../frontend
npm run dev
```

## 📂 Project Structure
```Plaintext
CuraSphere/
│
├── backend/          # Express server, MongoDB Models & API routes
├── frontend/         # React application (Components, Context, Pages)
├── README.md         # Project documentation
└── .gitignore        # Files to ignore in Git (node_modules, .env)
```

## 🔮 Future Enhancements
Telemedicine Integration: In-app video consultation support.

Automated Reminders: Email and SMS notifications for upcoming visits.

Medical History Uploads: Secure file storage for patient reports and prescriptions.

AI Symptom Checker: Initial screening tool to suggest relevant specialists.

Multi-Clinic Support: Scalability for hospital chains and multi-location practices.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Srijith S | Computer Science & Engineering Student | Amrita University Feel free to connect on GitHub and provide feedback!
