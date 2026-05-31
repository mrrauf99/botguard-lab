# Bot Detection Platform - Server

Express backend for bot detection, tracking, and analysis.

## Development

```bash
npm run dev
```

Runs on `http://localhost:5000`

## Database

Requires MongoDB. Set `MONGODB_URI` in `.env`

## Seeding

Seed 50 Pakistani users + admin:

```bash
npm run seed
```

## Testing

```bash
npm test
```

## Features (Phase 2+)

- User authentication (Register, Login)
- MongoDB user persistence
- JWT token management
- Role-based access (Admin, User)
- Behavior tracking API
- Detection engine
- Session management
