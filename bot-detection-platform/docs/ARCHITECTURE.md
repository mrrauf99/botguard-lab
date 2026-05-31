# Architecture

## System Overview

```
┌─────────────────────────────────────────┐
│     Bot Detection Platform              │
├─────────────────────────────────────────┤
│  Frontend (React)                       │
│  - Authentication UI                    │
│  - Dashboard                            │
│  - Session Replay Viewer                │
├─────────────────────────────────────────┤
│  Backend (Express + Node.js)            │
│  - User Management                      │
│  - Behavior Tracking Engine             │
│  - Detection Engine                     │
│  - WebSocket Server (Socket.io)         │
├─────────────────────────────────────────┤
│  Database (MongoDB)                     │
│  - Users                                │
│  - Sessions                             │
│  - Events                               │
│  - Detection Results                    │
└─────────────────────────────────────────┘
```

## Data Models

### User
- `email` (string, unique)
- `password` (string, hashed)
- `name` (string)
- `role` (enum: admin, user)
- `createdAt` (timestamp)

### Session
- `userId` (ObjectId)
- `startTime` (timestamp)
- `endTime` (timestamp)
- `score` (number 0-100)
- `classification` (enum: HUMAN, SUSPICIOUS, BOT)
- `events` (array of event references)

### Event
- `sessionId` (ObjectId)
- `type` (enum: mouse, click, scroll, type, navigate)
- `timestamp` (timestamp)
- `data` (object with type-specific data)

## Detection Pipeline

1. **Event Collection** - Track user behavior
2. **Feature Extraction** - Analyze patterns
3. **Scoring** - Calculate risk factors
4. **Classification** - Categorize as HUMAN/SUSPICIOUS/BOT

## Real-time Updates

- Socket.io for live dashboard updates
- Event streaming to admin clients
- Real-time detection results

## Security

- JWT token authentication
- bcrypt password hashing
- CORS enabled
- Rate limiting
- Input validation
