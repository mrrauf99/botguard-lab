# MongoDB Schema Documentation

This document outlines the MongoDB schema used in the BotGuard detection platform. The data is managed using Mongoose. 

## Collections

### 1. `users`
Stores user accounts for the platform (admins and simulated users).
- **email** (String, Unique, Required)
- **password** (String, Required) - Bcrypt hashed
- **role** (String) - Enum: `['admin', 'user']`, Default: `'user'`
- **name** (String)
- **status** (String) - Enum: `['active', 'inactive', 'suspended']`, Default: `'active'`

### 2. `sessions`
Tracks individual user sessions, storing behavior tracking aggregations and risk scores.
- **userId** (ObjectId, Ref: `User`)
- **sessionToken** (String, Unique, Required)
- **status** (String) - Enum: `['active', 'completed', 'abandoned', 'blocked']`
- **startTime** (Date)
- **endTime** (Date)
- **duration** (Number) - milliseconds
- **pageUrl**, **userAgent**, **ipAddress**, **referer** (String)
- **Behavior Tracking Stats**:
  - `eventCount`, `mouseEvents`, `scrollEvents`, `clickEvents`, `keyEvents`, `navigationEvents` (Number)
  - `idleTime`, `maxIdlePeriod` (Number) - milliseconds
- **Risk & Detection**:
  - `riskScore` (Number) - 0 to 100
  - `classification` (String) - Enum: `['HUMAN', 'SUSPICIOUS', 'BOT']`
  - `detectionReasons` ([String])
  - `attackType` (String)
- **Flags**:
  - `hasFastNavigation`, `hasNoMouseMovement`, `hasNoScroll`, `hasUnusualClickPattern`, `hasHighRequestRate` (Boolean)

### 3. `events`
Stores fine-grained behavior tracking events tied to a session.
- **sessionId** (ObjectId, Ref: `Session`, Required)
- **userId** (ObjectId, Ref: `User`)
- **eventType** (String) - Enum: `['mousemove', 'scroll', 'click', 'keydown', 'navigation', 'form_submit', 'login_attempt']`
- **x**, **y**, **scrollX**, **scrollY** (Number)
- **targetElement** (String)
- **keyCode** (Number)
- **timestamp** (Date)
- **metadata** (Object): `userAgent`, `ipAddress`, `referer`

### 4. `loginattempts`
Tracks login attempts (success/fail) for security and attack analysis.
- **email** (String, Required)
- **ipAddress** (String, Required)
- **userAgent** (String)
- **success** (Boolean, Required)
- **timestamp** (Date)

### 5. `notifications`
Stores system notifications for admins (e.g., high-risk bot detected).
- **title** (String, Required)
- **message** (String, Required)
- **type** (String) - Enum: `['info', 'warning', 'alert']`
- **isRead** (Boolean)
- **link** (String)
- **timestamp** (Date)
- **sessionId** (ObjectId, Ref: `Session`)
