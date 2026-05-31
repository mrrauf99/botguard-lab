# Setup Guide

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 5.0+

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd botguard-lab
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/botguard
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database Setup

Ensure MongoDB is running, then seed initial data:

```bash
npm run setup:db
```

This creates:

- 50 Pakistani users
- 1 admin user (admin@botguard.local / Admin@123)

### 5. Start Development

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Verification

### Lint

```bash
npm run lint
```

### Tests

```bash
npm test
```

### Build

```bash
npm run build
```

All should pass before committing.

## Database

### MongoDB Local Setup

```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux with apt
sudo apt-get install -y mongodb

# Windows - Download from mongodb.com
```

### Connection Test

```bash
mongo
> db.adminCommand('ping')
```

## Troubleshooting

### Port Already in Use

- Frontend: Change in `bot-detection-platform/client/vite.config.js`
- Backend: Set `PORT` env variable

### MongoDB Connection Failed

- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`
- Check firewall settings

### Dependencies Issue

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

See [PHASE_2.md](PHASE_2.md) for authentication implementation details.
