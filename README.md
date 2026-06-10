<div align="center">
  <h1>🛡️ BOTGUARD-LAB</h1>
  <p><strong>A full-stack bot detection platform with behavior tracking, risk scoring, an admin dashboard, and a traffic simulator for end-to-end testing.</strong></p>
  
  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
    <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg" alt="Node version" />
    <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React 18" />
    <img src="https://img.shields.io/badge/MongoDB-%3E%3D5.0-brightgreen.svg" alt="MongoDB" />
  </p>
</div>

---

## ⚡ Quick Start

### 1. Requirements & Installation
Ensure you have **Node.js >= 18.0.0**, **npm >= 9.0.0**, and **MongoDB >= 5.0**.

```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` to `.env` in the root folder.
```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (See [MongoDB Schemas](#mongodb-schemas)) |
| `JWT_SECRET` | Secret for signing JWTs (change in production) |
| `PORT` | Detection API Backend port (default: `5000`) |
| `VITE_API_URL` | API URL for Detection Frontend App (default: `http://localhost:5000`) |
| `SIMULATOR_PORT` | Simulator API Backend port (default: `5001`) |
| `VITE_SIMULATOR_API_URL`| API URL for Simulator Frontend UI (default: `http://localhost:5001`) |
| `CORS_ORIGIN` | Allowed origins, comma-separated (default: `http://localhost:3000,http://localhost:3001`) |

### 3. Seed Database
```bash
npm run setup:db
```
* **Admin:** `admin@botguard.local` / `Admin@123`  
* **Sample User:** `ahmed_1@botguard.pk` / `Password123`

### 4. Run Services

**Option A:** Detection platform only (Server `5000` + App `3000`)
```bash
npm run dev
```

**Option B:** Full Lab (Recommended)
Open 4 separate terminals to run all interconnected services:
| Service | Command | URL |
|----------|---------|-----|
| **Detection API** | `cd bot-detection-platform/server && npm run dev` | `http://localhost:5000` |
| **Detection App** | `cd bot-detection-platform/client && npm run dev` | `http://localhost:3000` |
| **Simulator API** | `cd bot-traffic-simulator/server && npm run dev` | `http://localhost:5001` |
| **Simulator UI** | `cd bot-traffic-simulator/client && npm run dev` | `http://localhost:3001` |

---

## 📂 Project Structure

```text
botguard-lab/
├── bot-detection-platform/     # Main detection platform
│   ├── client/                 # Vite + React SPA (marketing + dashboard)
│   └── server/                 # Express API + Socket.io
├── bot-traffic-simulator/      # Bot / human traffic & attack simulator
│   ├── client/                 # Simulator UI (Vite)
│   └── server/                 # Traffic generation API
├── LICENSE                     # MIT License
└── README.md                   # You are here
```

<details>
<summary><strong>Client Architecture (Detection Platform)</strong></summary>

```text
bot-detection-platform/client/src/
├── main.jsx                 # Entry (ReactDOM)
├── App.jsx                  # Providers + behavior tracking init
├── index.css                # Tailwind
├── routes/                  # AppRoutes, ProtectedRoute, GuestRoute
├── pages/                   # Home, Dashboard, Replay, Login, …
├── components/
│   ├── layout/              # Navbar, Footer, NotificationBell
│   ├── notifications/       # NotificationItem, NotificationList
│   └── ui/                  # Button, Card, Loader, …
├── context/                 # AuthContext, NotificationContext
├── hooks/                   # useAuth, useNotifications, useDashboard
├── services/                # api, authService, notificationService
└── utils/                   # BehaviorTracker, DetectionClient, replay helpers
```
</details>

---

## 💻 Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, React Router 6, Vite 5, Tailwind CSS 4, Axios, Socket.io client |
| **Backend** | Express, Node.js (ES modules) |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (`botguard_token` in localStorage), bcryptjs |
| **Real-time** | Socket.io (`/dashboard` namespace) |
| **Quality** | ESLint, Prettier, Jest |

---

## ✨ Features

### Bot Detection Platform
- **SPA & Website:** Built with React Router and responsive Tailwind layout.
- **Auth & Security:** JWT-based protection with guest/auth guards, rate limiting, and bcrypt hashing.
- **Behavior Tracking:** Mouse, scroll, click, typing, navigation, session duration, idle metrics.
- **Detection Engine:** Risk score 0–100 mapping to `HUMAN` (0-29), `SUSPICIOUS` (30-59), and `BOT` (60-100).
- **Admin Dashboard:** Real-time analytics, widget dashboards, session replay viewers with interactive canvas playback.
- **Real-time Eventing:** Socket.io-driven detection alerts and UI optimisations.

### Bot Traffic Simulator
- **Multi-modal Traffic:** Simulate single-session attacks, benign human traffic, or concurrent bot assaults.
- **Simulated Attacks:** 
  - **Login Attack** — Repeated failed logins.
  - **Spam Bot** — Form submission floods.
  - **Scraper Bot** — Rapid cross-page crawling.
- **Interactive Console:** View status, classification, blocked states, and risk scores in real time.

---

## 🗄️ MongoDB Schemas

<details>
<summary><strong>View Schema Definitions</strong></summary>

Below is an overview of the core MongoDB schemas used by the bot detection engine.

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, min 6 chars)
- `role` (String, enum: user/admin, default: user)

### Session
- `userId` (ObjectId, ref: User)
- `sessionToken` (String, unique, required)
- `status` (String, active/completed/abandoned/blocked)
- `startTime` / `endTime` / `duration`
- `ipAddress`, `userAgent`, `pageUrl`, `referer`
- **Behavior tracking:** `eventCount`, `mouseEvents`, `scrollEvents`, `clickEvents`, `keyEvents`, `navigationEvents`, `idleTime`, `maxIdlePeriod`
- **Scores:** `riskScore` (0-100), `classification` (HUMAN/SUSPICIOUS/BOT)
- **Metadata flags:** `hasFastNavigation`, `hasNoMouseMovement`, `hasNoScroll`, etc.

### Event
- `sessionId` (ObjectId, ref: Session, required)
- `userId` (ObjectId, ref: User)
- `eventType` (String, enum: mousemove, scroll, click, keydown, navigation, form_submit, login_attempt)
- `x`, `y`, `scrollX`, `scrollY`, `targetElement`, `keyCode`
- `timestamp` (Date)
- `metadata` (userAgent, ipAddress, referer)

### Notification
- `userId` (ObjectId, ref: User)
- `type` (String, enum: bot-detected, session-ended, high-risk, anomaly, system)
- `severity` (String, enum: info, warning, critical)
- `title`, `message` (String)
- `data` (contains sessionId, riskScore, classification, etc.)

### LoginAttempt
- `email`, `ipAddress` (String)
- `success` (Boolean)
- `userAgent` (String)

</details>

---

## 🛠️ Scripts & Tooling

```bash
npm run lint              # ESLint (all workspaces)
npm run lint:fix          # Fix linting issues
npm run format            # Prettier write
npm run format:check      # Check formatting
npm test                  # Jest (all packages)
npm run test:coverage     # Test coverage report
npm run build             # Production client builds
npm run dev               # Detection server + client
npm run setup             # Install dependencies + Seed
npm run setup:db          # Seed only
```

**Pre-Commit Checklist:** Ensure you run `npm run lint`, `npm test`, and `npm run build` prior to committing.

---

## 🛤️ Access Points & Routing

| Service | URL | Notes |
|---------|-----|--------|
| **Main Site** | `http://localhost:3000` | Public marketing pages |
| **Login/Register** | `http://localhost:3000/login` | Redirects to dashboard when already signed in |
| **Admin Dashboard** | `http://localhost:3000/dashboard` | **Requires JWT** (admin recommended for full API data) |
| **Session Replay** | `http://localhost:3000/replay/:sessionId` | Protected route |
| **Simulator** | `http://localhost:3001` | Traffic + Simulated attacks |

> **Note:** Visiting `/` with a valid token auto-redirects to `/dashboard`. Unauthorized access to protected routes redirects to `/login`.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
