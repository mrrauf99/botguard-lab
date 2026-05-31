# Bot Detection Platform - Server

Express backend for bot detection, tracking, and analysis.

## Development

```bash
npm run dev
```

Runs on `http://localhost:5000`

## Database

Requires MongoDB. Set `MONGODB_URI` in `.env`

### Seeding

Seed 50 Pakistani users + admin:

```bash
npm run seed
```

## Testing

```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/users` - Get all users (admin only)

## Features Implemented

### Phase 2: Authentication & Database ✅
- MongoDB connection and Mongoose models
- User schema with email uniqueness
- JWT authentication (7-day tokens)
- bcrypt password hashing
- Register/Login endpoints
- Role-based access (Admin, User)
- 50 Pakistani seed users
- Input validation
- Error handling

### Phase 3+
- Behavior tracking API
- Detection engine
- Real-time updates (Socket.io)
- Session management
- Analytics

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/botguard
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

## File Structure

```
src/
├── config/        # Database configuration
├── models/        # Mongoose schemas
├── controllers/   # Business logic
├── routes/        # API routes
├── middleware/    # Auth middleware
├── utils/         # Helpers (JWT, validation, seeding)
└── scripts/       # Database seed script
```

## Credentials

Admin:
- Email: `admin@botguard.local`
- Password: `Admin@123`

Sample Users:
- Email: `ahmed_1@botguard.pk` (through `ahmed_50@botguard.pk`)
- Password: `Password123`
