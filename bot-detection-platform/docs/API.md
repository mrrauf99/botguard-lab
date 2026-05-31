# API Documentation

## Bot Detection Platform API

### Authentication Endpoints

#### Register

- **POST** `/api/auth/register`
- Body: `{ email, password, name }`
- Returns: User object with JWT token

#### Login

- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: User object with JWT token

### User Endpoints

#### Get Current User

- **GET** `/api/users/me`
- Headers: `Authorization: Bearer {token}`
- Returns: User object

#### Get All Users (Admin only)

- **GET** `/api/users`
- Headers: `Authorization: Bearer {token}`
- Returns: Array of users

### Behavior Tracking

#### Log Event

- **POST** `/api/events`
- Body: `{ eventType, timestamp, data }`
- Returns: Event object

#### Get Session

- **GET** `/api/sessions/{sessionId}`
- Returns: Session object with events

### Detection

#### Get Detection Score

- **GET** `/api/detection/score/{sessionId}`
- Returns: `{ score, classification, reasons }`

## Status Codes

- `200` OK
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Server Error

## Rate Limiting

All endpoints are rate limited to prevent abuse.

See Phase 5 for complete detection engine documentation.
