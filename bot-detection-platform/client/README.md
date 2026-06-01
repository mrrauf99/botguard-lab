# Bot Detection Platform — Client

React single-page application for the BotGuard marketing site, admin dashboard, session replay, and real-time notifications.

## Stack

- **React 18** + **React Router 6**
- **Vite 5**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **Axios** (API client with JWT interceptor)
- **Socket.io client** (dashboard + notifications)

## Development

```bash
npm install
npm run dev
```

Runs at **http://localhost:3000** (see `vite.config.js`).

Set the API URL in the repo root `.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Build & preview

```bash
npm run build
npm run preview
```

## Testing & lint

```bash
npm test
npm run lint
npm run format
```

## Project layout

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Auth + notification providers, tracking init
├── index.css             # Tailwind
├── routes/               # AppRoutes, ProtectedRoute, GuestRoute
├── pages/                # Route-level components (lazy-loaded)
├── components/
│   ├── layout/           # Navbar, Footer, NotificationBell
│   ├── notifications/
│   └── ui/
├── context/              # AuthContext, NotificationContext
├── hooks/                # useAuth, useNotifications, useDashboard
├── services/             # api, authService, notificationService
└── utils/                # BehaviorTracker, DetectionClient, replay, notifications
```

## Routes

| Path | Guard | Description |
|------|-------|-------------|
| `/` | Public | Home (redirects to `/dashboard` if signed in) |
| `/login`, `/register` | Guest | Auth forms |
| `/dashboard` | Protected | Analytics dashboard |
| `/replay/:sessionId` | Protected | Session replay canvas |
| `/profile`, `/settings` | Protected | Account pages |
| `/products`, `/blog`, `/contact`, … | Public | Marketing |

Auth token is stored as `botguard_token` in `localStorage`.

## Notifications

The notification bell (navbar, when signed in) supports:

- Mark single notification as read (optimistic UI)
- Delete notification
- Mark all as read
- Click notification card → navigate to `/replay/:sessionId` when `data.sessionId` is present
- Real-time updates via Socket.io on `/dashboard`

## Behavior tracking

`BehaviorTracker` and `DetectionClient` are initialized once from `App.jsx` and attached to `window` for compatibility with existing ingestion flows.

## Demo login

**Admin:** `admin@botguard.local` / `Admin@123`

Requires the detection server and seeded database — see the [root README](../../README.md).
