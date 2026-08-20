# ApexFit — Full-Stack Gym Membership Management System

A commercial-grade, modern **Gym Membership Management System** built with **React, Node.js, Express.js, and MongoDB**. Designed with a dark fitness aesthetic, electric green accents, and role-based portals for **Admin, Personal Trainers, and Members**.

---

## 🌟 Key Features & Functional Modules

### 1. 🔑 Security & Role-Based Authentication
- **Role-Based Portals**: Separate dashboards tailored for **Admin**, **Trainer**, and **Member**.
- **JWT Authentication & Password Hashing**: Secure token management with Bcryptjs password encryption.
- **Interactive Quick Demo Login**: One-click login presets on the sign-in page for instant testing.

### 2. ⚡ Member Portal
- **Digital QR Pass**: Instant QR code pass for gym reception check-in.
- **Class Booking & Automatic Waitlist**: Reserve seats in CrossFit, Yoga, HIIT & Strength classes. If full, queue position is automatically assigned.
- **Auto-Waitlist Promotion**: When a booking is canceled, position #1 on the waitlist is automatically promoted to booked with instant notification.
- **Custom Workout & Nutrition Plans**: Interactive weekly exercise routine cards and macro calorie target tracking assigned by personal trainers.
- **Fitness Progress Tracker**: Recharts line graphs tracking weight, BMI, body fat %, and body measurements over time.
- **Billing & Invoices**: Downloadable PDF/HTML payment receipts for purchases and renewals.

### 3. 🏋️ Personal Trainer Portal
- **Client Roster**: View assigned gym members and track their progress.
- **Interactive Workout Builder**: Design custom exercise splits with sets, reps, target weights (kg), and rest timers.
- **Macro Nutrition Builder**: Set daily calorie goals, protein/carb/fat macros, and daily meal schedules.
- **Class Schedule**: Track group fitness classes assigned to coach.

### 4. 👑 Admin Command Center
- **KPI Statistics**: Live cards for Total Members, Active Subscriptions, Expired Plans, Today's Check-ins, and Monthly Revenue.
- **Interactive Recharts Analytics**: Revenue trend growth, 7-day attendance distribution, and class category popularity.
- **Reception Scanner**: Real-time QR Code Pass verifier. Checks active membership; if expired, denies entry with a warning.
- **Prorated Refund Engine**: Transparent calculation (`Unused Days × Daily Rate`) with 1-click refund approval.
- **Multi-Branch Facility Support**: Switch between gym locations (Downtown Flagship, Westside Hub, Uptown Express).
- **Locker Management**: Interactive grid layout to assign, release, and manage locker statuses (`Available`, `Assigned`, `Maintenance`).

---

## 🔑 Quick Demo Login Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `velocitygamer9@gmail.com` | `Demo123` | Complete gym control, Analytics, Refunds, Lockers, Branches |
| **Trainer** | `sigmax1209@gmail.com` | `Demo123` | Client members, Workout Builder, Nutrition 

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti, HTML5 QR Scanner.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT, Bcryptjs, QRCode.
- **Database**: MongoDB (`mongodb://127.0.0.1:27017/gym_db`).

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Clone & Install Dependencies

```bash
# Install root, backend, and frontend packages concurrently
npm run setup
```

### 2. Seed Demo Database

```bash
npm run seed
```

### 3. Launch Development Server

```bash
npm run dev
```

- Frontend UI: `http://localhost:5173`
- Backend REST API: `http://localhost:5000`

---

## 📡 REST API Reference Summary

- `POST /api/auth/login` - User authentication
- `GET /api/admin/stats` - Admin KPI statistics & analytics
- `GET /api/members` - Member roster query
- `POST /api/classes/:id/book` - Class seat reservation & waitlist engine
- `POST /api/attendance/check-in` - QR token entry verification
- `POST /api/payments/create` - Subscription payment & auto-renewal processing
- `POST /api/payments/refund` - Prorated early cancellation refund engine
