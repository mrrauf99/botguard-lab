# Phase 2: Authentication & Database

## Summary

Phase 2 implements complete authentication system with MongoDB database, JWT tokens, and bcrypt password hashing.

## What's Implemented

### Database

- ✅ MongoDB connection with Mongoose
- ✅ User schema with validation
- ✅ Email uniqueness constraint
- ✅ Password hashing with bcryptjs

### Authentication

- ✅ JWT token generation (7-day expiration)
- ✅ Token verification middleware
- ✅ Admin role-based access control
- ✅ Secure password comparison

### API Endpoints

- ✅ `POST /api/auth/register` - Create new user account
- ✅ `POST /api/auth/login` - User login
- ✅ `GET /api/auth/me` - Get current user (protected)
- ✅ `GET /api/auth/users` - Get all users (admin only)

### Security Features

- ✅ Password validation (min 6 characters)
- ✅ Email validation
- ✅ Input sanitization
- ✅ CORS protection
- ✅ Error handling

### User Management

- ✅ Admin role support
- ✅ User role support
- ✅ Role-based access middleware

### Database Seeding

- ✅ 50 Pakistani users with realistic names
- ✅ 1 Admin user (admin@botguard.local / Admin@123)
- ✅ Seed script with proper error handling

## Files Created

### Configuration

- `src/config/database.js` - MongoDB connection management

### Models

- `src/models/User.js` - Mongoose User model with bcrypt integration
- `src/models/User.schema.js` - User schema definition

### Middleware

- `src/middleware/auth.js` - JWT verification and admin checks

### Controllers

- `src/controllers/authController.js` - Auth business logic

### Routes

- `src/routes/authRoutes.js` - Express route definitions

### Utilities

- `src/utils/jwt.js` - JWT token generation and verification
- `src/utils/validation.js` - Input validation functions
- `src/utils/pakistaniUsers.js` - Pakistani name database

### Scripts

- `src/scripts/seedUsers.js` - Database seeding script

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/botguard
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
```

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows - use MongoDB Compass or command line
```

### 4. Seed Database

```bash
npm run setup:db
```

Output:

```
✓ Admin user created: admin@botguard.local
✓ Created 50 Pakistani users
Admin: admin@botguard.local / Admin@123
Sample user: ahmed_1@botguard.pk / Password123
```

### 5. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Usage

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@botguard.local",
    "password": "Admin@123"
  }'
```

Response:

```json
{
  "user": {
    "_id": "...",
    "name": "Administrator",
    "email": "admin@botguard.local",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Get All Users (Admin Only)

```bash
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: String ("user" or "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Email

- Must be valid format (user@domain.com)
- Must be unique in database
- Converted to lowercase

### Password

- Minimum 6 characters
- Hashed with bcryptjs before storage
- Never returned in API responses

### Name

- Required field
- Trimmed whitespace

## Error Handling

All errors return appropriate HTTP status codes:

- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (email already exists)
- `500` - Server error

## Testing

### Validation Tests

```bash
npm test
```

Tests cover:

- Email validation
- Password validation
- Input validation
- JWT token generation

## Security Notes

### Production Checklist

- [ ] Change JWT_SECRET to strong value
- [ ] Use HTTPS only
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB authentication
- [ ] Enable MongoDB encryption
- [ ] Rate limiting on auth endpoints
- [ ] Implement refresh tokens
- [ ] Add 2FA support

## Next Phase

Phase 3 will implement:

- Website pages (Home, Products, Blog, etc.)
- Bright modern UI design
- User-facing features

## Troubleshooting

### MongoDB Connection Failed

- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`
- Check firewall/port access

### "Email already registered"

- User already exists with that email
- Use different email or reset database

### "Invalid token"

- Token expired (7 days)
- Token malformed
- JWT_SECRET mismatch

### Tests Failing

- Ensure MongoDB is running
- Check .env configuration
- Run `npm install` to install dependencies
