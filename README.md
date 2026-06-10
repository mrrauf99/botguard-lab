# BOTGUARD-LAB

AI-powered bot detection platform with behavior tracking, risk scoring, an admin dashboard, and a traffic simulator for end-to-end testing.

## Project Structure

```
botguard-lab/
├── bot-detection-platform/     # Main detection platform
│   ├── client/                 # Vite + React SPA (marketing + dashboard)
│   ├── server/                 # Express API + Socket.io
│   └── docs/                   # API & architecture docs
├── bot-traffic-simulator/      # Bot / human traffic & attack simulator
│   ├── client/                 # Simulator UI (Vite)
│   └── server/                 # Traffic generation API
└── README.md
```

Database seeding lives in `bot-detection-platform/server/src/scripts/seedUsers.js` (50 Pakistani users + 1 admin).

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, React Router 6, Vite 5, Tailwind CSS 4, Axios, Socket.io client |
| Backend | Express, Node.js (ES modules) |
| Database | MongoDB, Mongoose (See [Schema Definition](bot-detection-platform/docs/MONGODB_SCHEMA.md)) |
| Auth | JWT (`botguard_token` in localStorage), bcryptjs |
| Real-time | Socket.io (`/dashboard` namespace) |
| Quality | ESLint, Prettier, Jest |

## Client Architecture (detection platform)

The detection client is a React SPA with lazy-loaded routes and a service layer:

```
bot-detection-platform/client/src/
├── main.jsx                 # Entry (ReactDOM)
├── App.jsx                  # Providers + behavior tracking init
├── index.css                # Tailwind
├── routes/                  # AppRoutes, ProtectedRoute, GuestRoute
├── pages/                   # Home, Dashboard, Replay, Login, …
├── components/
│   ├── layout/              # Navbar, Footer, NotificationBell
│   ├── notifications/     # NotificationItem, NotificationList
│   └── ui/                  # Button, Card, Loader, …
├── context/                 # AuthContext, NotificationContext
├── hooks/                   # useAuth, useNotifications, useDashboard
├── services/                # api, authService, notificationService
└── utils/                   # BehaviorTracker, DetectionClient, replay helpers
```

## Requirements

- Node.js >= 18.0.0 (native `fetch` supported)
- npm >= 9.0.0
- MongoDB >= 5.0

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (See [Schema Doc](bot-detection-platform/docs/MONGODB_SCHEMA.md)) |
| `JWT_SECRET` | Secret for signing JWTs (change in production) |
| `PORT` | Detection API Backend port (default: `5000`) |
| `VITE_API_URL` | API URL for Detection Frontend App (default: `http://localhost:5000`) |
| `SIMULATOR_PORT` | Simulator API Backend port (default: `5001`) |
| `VITE_SIMULATOR_API_URL`| API URL for Simulator Frontend UI (default: `http://localhost:5001`) |
| `CORS_ORIGIN` | Allowed origins, comma-separated (default: `http://localhost:3000,http://localhost:3001`) |

### 3. Seed database

```bash
npm run setup:db
```

**Admin:** `admin@botguard.local` / `Admin@123`  
**Sample user:** `ahmed_1@botguard.pk` / `Password123` (after seed)

### 4. Run services

**Option A — detection platform only (root):**

```bash
npm run dev
```

Starts detection server (5000) + client (3000).

**Option B — all four services (recommended for full lab):**

| Terminal | Command | URL |
|----------|---------|-----|
| 1 | `cd bot-detection-platform/server && npm run dev` | API `http://localhost:5000` |
| 2 | `cd bot-detection-platform/client && npm run dev` | App `http://localhost:3000` |
| 3 | `cd bot-traffic-simulator/server && npm run dev` | API `http://localhost:5001` |
| 4 | `cd bot-traffic-simulator/client && npm run dev` | UI `http://localhost:3001` |

## Access Points

| Service | URL | Notes |
|---------|-----|--------|
| Main site | http://localhost:3000 | Public marketing pages |
| Login / Register | http://localhost:3000/login | Redirects to dashboard when already signed in |
| Admin dashboard | http://localhost:3000/dashboard | **Requires JWT** (admin recommended for full API data) |
| Session replay | http://localhost:3000/replay/:sessionId | Protected route |
| Profile / Settings | http://localhost:3000/profile, `/settings` | Protected routes |
| Simulator | http://localhost:3001 | Traffic + Phase 8 attacks |
| Health check | http://localhost:5000/health | Detection API |

### Client routes

| Path | Access |
|------|--------|
| `/`, `/products`, `/blog`, `/contact`, … | Public |
| `/login`, `/register` | Guest only (authenticated users → `/dashboard`) |
| `/dashboard`, `/replay/:sessionId`, `/profile`, `/settings` | Authenticated (`botguard_token` required) |

When a valid token exists, visiting `/` redirects to `/dashboard`. Unauthorized access to protected routes redirects to `/login`.

## Quick Test Flow

1. Start MongoDB locally.
2. Run `npm run setup:db` if the database is empty.
3. Open http://localhost:3000/login → sign in as **admin@botguard.local**.
4. You should land on http://localhost:3000/dashboard (stats, charts, sessions).
5. Use the **notification bell** → mark read, delete, or click a card to open session replay.
6. Open http://localhost:3001 → set **Target URL** (`http://localhost:3000`) and **API URL** (`http://localhost:5000`).
7. Run **Login Attack**, **Spam Bot**, or **Scraper Bot** (max 10 requests; stops on BOT / blocked session).
8. Refresh the dashboard → see updated classifications and Socket.io events.

## Features

### Bot Detection Platform

- **Website:** Home, Products, Product details, Blog, Article details, Contact, Login, Register
- **SPA:** React Router, responsive Tailwind layout, mobile navigation
- **Auth:** JWT persisted in `localStorage` (`botguard_token`, `botguard_user`); protected routes; guest-only login/register
- **Behavior tracking:** Mouse, scroll, click, typing, navigation, session duration, idle (server-side on session end)
- **Detection engine:** Risk score 0–100 with classifications:
  - `0–29` → HUMAN
  - `30–59` → SUSPICIOUS
  - `60–100` → BOT (session may be **blocked**)
- **Signals:** Fast navigation, no mouse/scroll, high click/key rate, short session, spam submissions, sequential clicks, high event rate, repeated failed logins
- **Admin dashboard:** Stat widgets, canvas charts, recent sessions table, high-risk alerts, replay links
- **Session replay:** Canvas visualization + navigation timeline
- **Real-time:** Socket.io for detections and dashboard stat updates
- **Notifications:** Bell dropdown with mark-read, delete, optimistic UI, and navigation to `/replay/:sessionId`

### Security (current)

- Dashboard and session detail APIs require **admin JWT** for full data
- `/detection/analyze` and `/events/sessions/end` require **session token** (or JWT)
- Rate limits on auth and event ingestion
- Security headers + configurable CORS
- Passwords hashed with bcrypt; not returned in API responses
- Client clears auth on API `401` responses

### Bot Traffic Simulator

- Continuous **bot** / **human** / **combined** traffic
- Single-session bot types (fast navigation, no interaction, form spam, click spam, suspicious)
- **Phase 8 attack modes** (max 10 attempts each):
  - **Login Attack** — repeated failed logins
  - **Spam Bot** — form submission flood
  - **Scraper Bot** — rapid navigation crawl
- Configurable target URL and detection API URL
- Displays status, requests sent, stopped reason, classification, and risk score

## API Overview

Base URL: `http://localhost:5000`

| Prefix | Examples | Auth |
|--------|----------|------|
| `/auth` | `POST /register`, `POST /login`, `GET /me` | JWT for `/me` |
| `/events` | `POST /sessions`, `POST /batch`, `POST /sessions/end` | Token for end; public create/batch |
| `/detection` | `POST /analyze`, `GET /rules` | Token or JWT for analyze |
| `/dashboard` | `GET /stats`, `GET /trends`, `GET /recent-sessions` | Admin JWT |
| `/notifications` | `GET /`, `POST /mark-read`, `DELETE /:id` | JWT |

Simulator API: `http://localhost:5001/simulator/…` — see `bot-traffic-simulator/docs/README.md`.

Full reference: [bot-detection-platform/docs/API.md](bot-detection-platform/docs/API.md)

## Scripts

```bash
npm run lint              # ESLint (all workspaces)
npm run lint:fix
npm run format            # Prettier write
npm run format:check
npm test                  # Jest (all packages)
npm run test:coverage
npm run build             # Production client builds
npm run dev               # Detection server + client
npm run setup             # install + seed
npm run setup:db          # seed only
```

Per-package:

```bash
cd bot-detection-platform/server && npm run dev
cd bot-detection-platform/server && npm run seed
cd bot-detection-platform/client && npm run dev
cd bot-detection-platform/client && npm run build
```

## Pre-Commit Checklist

Before committing, ensure:

```bash
npm run lint
npm test
npm run build
```

## Development Phases

| Phase | Status | Summary |
|-------|--------|---------|
| 1 | Done | Monorepo, ESLint, Prettier, Jest, env, scripts |
| 2 | Done | MongoDB, users, JWT auth, bcrypt, seed users |
| 3 | Done | Marketing pages, bright UI, routing |
| 4 | Done | Behavior events + sessions collections |
| 5 | Done | Detection engine + scoring |
| 6 | Done | Admin dashboard + Socket.io |
| 7 | Done | Session replay viewer |
| 8 | Done | Attack simulator (login / spam / scraper) |
| 9 | Done | React SPA refactor (Router, Tailwind, notifications, auth guards) |

## Architecture

See [bot-detection-platform/docs/ARCHITECTURE.md](bot-detection-platform/docs/ARCHITECTURE.md).

Client-specific notes: [bot-detection-platform/client/README.md](bot-detection-platform/client/README.md).

## Contributing

1. Branch from `main`: `git checkout -b feature/your-feature`
2. Run lint, tests, and build (see above).
3. Commit with a short, descriptive message: e.g. `fix notification mark-read optimistic rollback`
4. Open a pull request.

## License

MIT
