# BOTGUARD-LAB

AI-powered bot detection platform with behavior tracking, analysis, and a simulator for testing bot detection mechanisms.

## Project Structure

```
botguard-lab/
├── bot-detection-platform/     # Main detection platform
│   ├── client/                 # React frontend
│   ├── server/                 # Express backend
│   └── docs/                   # Documentation
├── bot-traffic-simulator/      # Bot simulation tool
│   ├── client/                 # React frontend
│   ├── server/                 # Express backend
│   └── docs/                   # Documentation
├── scripts/                    # Database seeds
└── README.md                   # This file
```

## Tech Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Express, Node.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Real-time**: Socket.io
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 5.0

## Quick Start

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `REACT_APP_API_URL`: API base URL for client

### Development

```bash
npm run dev
```

This starts both the bot detection server and client in development mode.

### Build

```bash
npm run build
```

Builds all packages for production.

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Code Quality

```bash
npm run lint          # Check lint errors
npm run lint:fix      # Fix lint errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
```

## Pre-Commit Requirements

All of the following must pass before committing:

- ✅ Linting (`npm run lint`)
- ✅ Tests (`npm test`)
- ✅ Production build (`npm run build`)

## Development Phases

### Phase 1: ✅ Monorepo Foundation

- ESLint, Prettier, Jest configuration
- Environment variables setup
- npm scripts
- .gitignore configuration

### Phase 2: Authentication & Database

- MongoDB connection
- Mongoose schemas
- User model with JWT and bcrypt
- Register/Login endpoints
- 50 Pakistani seed users + 1 admin

### Phase 3: Website Content

- Home, Products, Blog pages
- Product/Article detail pages
- Contact & Authentication pages
- Bright modern UI design

### Phase 4: Behavior Tracking Engine

- Mouse movement tracking
- Scroll & click activity
- Typing behavior
- Session management

### Phase 5: Detection Engine

- Request rate analysis
- Navigation pattern detection
- Mouse/scroll presence detection
- Bot classification (0-100 score)

### Phase 6: Admin Dashboard

- Session analytics
- Real-time charts
- Bot/Human/Suspicious statistics
- Socket.io integration

### Phase 7: Session Replay

- Mouse movement replay
- Scroll event replay
- Click recording
- Navigation timeline

### Phase 8: Bot Traffic Simulator

- Login attack simulation
- Spam bot simulator
- Scraper bot simulator
- Detection result display

### Phase 9: Analytics & Documentation

- Analytics dashboard
- History tracking
- Report export
- Full API documentation
- Setup guides

## Scripts

### Root Commands

```bash
npm run lint                   # Run ESLint
npm run lint:fix              # Fix ESLint issues
npm run format                # Format all code
npm run format:check          # Check formatting
npm test                      # Run all tests
npm run test:watch            # Watch mode
npm run test:coverage         # Coverage report
npm run dev                   # Start development servers
npm run build                 # Build all packages
npm run build:prod            # Production build
npm run setup                 # Install and seed database
npm run setup:db              # Seed database only
```

### Per-Package Commands

Navigate to specific packages and use their individual scripts:

```bash
cd bot-detection-platform/server
npm run dev                   # Start server
npm run seed                  # Seed database
```

## Database Seeding

Seed 50 Pakistani users + 1 admin:

```bash
npm run setup:db
```

Admin credentials:

- Email: `admin@botguard.local`
- Password: `Admin@123`

## API Documentation

See [bot-detection-platform/docs/API.md](bot-detection-platform/docs/API.md) for detailed API documentation.

## Architecture

See [bot-detection-platform/docs/ARCHITECTURE.md](bot-detection-platform/docs/ARCHITECTURE.md) for system architecture.

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and run quality checks:
   ```bash
   npm run lint:fix
   npm test
   npm run build
   ```
3. Commit with clear message: `git commit -m "add feature description"`
4. Push to branch: `git push origin feature/your-feature`

## Commit Message Guidelines

- Use present tense: "add feature" not "added feature"
- Use lowercase start: "update auth" not "Update auth"
- Reference phases: "phase 2: add user model"
- Keep it short and descriptive

## License

MIT
