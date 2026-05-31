# Bot Traffic Simulator Documentation

## Overview

The Bot Traffic Simulator is a separate application designed to test the bot detection platform by simulating various bot attack patterns.

## Components

### Client (React)

- Target URL configuration
- Attack type selection
- Real-time status display
- Detection result visualization

### Server (Express)

- Login attack simulation
- Spam bot simulation
- Scraper bot simulation
- Detection result parsing

## Features

### 1. Login Attack

Attempts rapid login requests to trigger detection

### 2. Spam Bot

Generates high-volume form submissions

### 3. Scraper Bot

Simulates automated page crawling

## Configuration

```env
TARGET_URL=http://localhost:3000
REQUESTS_LIMIT=10
STOP_ON_DETECTION=true
```

## Usage

```bash
cd bot-traffic-simulator
npm run dev
```

Open `http://localhost:3001`

## Testing Detection

1. Start both applications:
   - Bot Detection Platform: `http://localhost:3000`
   - Bot Traffic Simulator: `http://localhost:3001`

2. Configure target URL in simulator

3. Select attack type and start

4. Observe detection results

## Detection Criteria

- Request rate > threshold
- No mouse/scroll activity
- Repeated identical requests
- Sequential crawling patterns

See bot-detection-platform docs for complete detection engine details.
