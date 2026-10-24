<div align="center">

# 💓 VitalSense — Real-Time Health Monitoring Platform

**A full-stack health monitoring dashboard with real-time vitals tracking, trend analysis, and doctor-patient collaboration.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Queue-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

</div>

---

## ✨ Features

### 🏥 For Patients
- **Real-time Vitals Dashboard** — Track heart rate, blood pressure, oxygen saturation, and body temperature with live updates
- **Interactive Charts** — Visualize health trends with beautiful area and line charts using Recharts
- **Smart Alerts** — Automatic status indicators (Normal / Warning / Critical) based on medical thresholds
- **Doctor Assignment** — Browse and assign available doctors from within the app
- **Profile Management** — Upload profile picture, add medical notes, and manage personal info

### 👨‍⚕️ For Doctors
- **Patient Overview** — View all assigned patients with their latest vitals at a glance
- **Abnormality Detection** — Instant visual alerts for patients with abnormal readings
- **Health History** — Drill into any patient's full health history with color-coded vital signs
- **Professional Profile** — Manage specialization, license, bio, and years of experience

### 🏗️ Technical Highlights
- **Real-time Communication** — Socket.io for instant vitals broadcast across connected clients
- **Message Queue** — RabbitMQ for critical vitals alert processing (decoupled worker architecture)
- **Caching Layer** — Redis for fast latest-reading lookups with graceful degradation
- **Search & Analytics** — Elasticsearch integration for health data indexing (optional)
- **JWT Authentication** — Secure token-based auth with role-based access control
- **Monitoring** — Prometheus metrics endpoint and Docker Compose observability stack

---

## 🏛️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│   ┌──────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  │
│   │  Login   │  │ Dashboard │  │  Doctor   │  │ Profiles │  │
│   │  Page    │  │  (Charts) │  │ Dashboard │  │  (CRUD)  │  │
│   └──────────┘  └───────────┘  └───────────┘  └──────────┘  │
│              ↕ REST API + Socket.io (WebSocket)              │
├──────────────────────────────────────────────────────────────┤
│                   Express.js Backend (Node)                  │
│   ┌──────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  │
│   │   Auth   │  │  Health   │  │  Doctor   │  │ Profile  │  │
│   │  Routes  │  │  Routes   │  │  Routes   │  │  Routes  │  │
│   └──────────┘  └───────────┘  └───────────┘  └──────────┘  │
│              ↕            ↕            ↕                     │
│   ┌──────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  │
│   │ MongoDB  │  │   Redis   │  │ RabbitMQ  │  │  Elastic │  │
│   │ (Store)  │  │  (Cache)  │  │  (Queue)  │  │ (Search) │  │
│   └──────────┘  └───────────┘  └───────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Recharts, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express 5, Socket.io, JWT |
| **Database** | MongoDB (Mongoose ODM) |
| **Caching** | Redis |
| **Message Queue** | RabbitMQ (amqplib) |
| **Search** | Elasticsearch (optional) |
| **Monitoring** | Prometheus (prom-client), Docker Compose |
| **Logging** | Winston + Logstash |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Redis** (optional — app works without it)
- **RabbitMQ** (optional — alerts disabled without it)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/vitalsense-health-monitoring.git
cd vitalsense-health-monitoring
```

### 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configure Environment

```bash
# Copy the example env file
cp backend/.env.example backend/.env

# Edit with your values
# MONGO_URI, JWT_SECRET, etc.
```

### 4. Start the Application

```bash
# Terminal 1 — Backend
cd backend
npm start

# Terminal 2 — Frontend
npm run dev
```

### 5. Open in Browser

```
Frontend: http://localhost:5173
Backend:  http://localhost:5001
```

---

## 🐳 Docker (Optional)

If you have Docker and Docker Compose installed, you can spin up the full stack including MongoDB, Redis, RabbitMQ, Elasticsearch, and Prometheus:

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
├── src/                      # React Frontend
│   ├── components/
│   │   ├── Layout.jsx        # App shell with header & navigation
│   │   └── InputForm.jsx     # Vitals recording modal
│   ├── context/
│   │   └── HealthContext.jsx  # Global state & API calls
│   ├── pages/
│   │   ├── Login.jsx         # Auth (login + register)
│   │   ├── Dashboard.jsx     # Patient vitals dashboard
│   │   ├── DoctorDashboard.jsx # Doctor patient overview
│   │   ├── DoctorProfile.jsx # Doctor profile editor
│   │   └── PatientProfile.jsx # Patient profile + doctor assignment
│   ├── index.css             # Design system & animations
│   ├── App.jsx               # Root component with routing
│   └── main.jsx              # Entry point
│
├── backend/                  # Express.js Backend
│   ├── config/
│   │   ├── db.js             # MongoDB + Redis connections
│   │   └── rabbitmq.js       # RabbitMQ setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── healthController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js           # User schema (patient + doctor)
│   │   └── HealthData.js     # Vitals schema
│   ├── routes/               # Express route definitions
│   ├── workers/
│   │   └── alertWorker.js    # RabbitMQ consumer for alerts
│   └── server.js             # App entry point
│
├── docker-compose.yml        # Full stack orchestration
├── prometheus.yml            # Metrics config
└── package.json
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login | ❌ |
| `GET` | `/api/health` | Get health history | ✅ |
| `POST` | `/api/health` | Add new vitals reading | ✅ |
| `GET` | `/api/profile` | Get user profile | ✅ |
| `PUT` | `/api/profile` | Update profile | ✅ |
| `GET` | `/api/doctor/patients` | Get assigned patients | ✅ 👨‍⚕️ |
| `GET` | `/api/doctor/patient/:id` | Get patient history | ✅ 👨‍⚕️ |
| `GET` | `/api/patient/doctors` | List available doctors | ✅ |
| `PUT` | `/api/patient/assign-doctor` | Assign a doctor | ✅ |

---

## 🎨 Design

The UI features a **premium dark theme** with:
- 🌌 Animated gradient orb backgrounds
- 🔮 Glassmorphism cards with backdrop blur
- ✨ Glow effects that respond to vital status
- 🎭 Staggered mount animations
- 📱 Fully responsive mobile layout
- 🔤 Custom typography (Inter + Outfit from Google Fonts)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React, Node.js, and MongoDB**

</div>
