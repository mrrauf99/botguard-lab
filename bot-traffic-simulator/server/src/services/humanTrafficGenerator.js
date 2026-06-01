import fetch from 'node-fetch';

class HumanTrafficGenerator {
  constructor(apiUrl = 'http://localhost:5000', simulatorUrl = 'http://localhost:3000') {
    this.apiUrl = apiUrl;
    this.simulatorUrl = simulatorUrl;
    this.isRunning = false;
    this.sessionIds = [];
    this.trafficStats = {
      totalSessions: 0,
      totalEvents: 0,
      humansGenerated: 0,
      avgSessionDuration: 0,
    };
  }

  /**
   * Generate realistic human browsing session
   */
  async generateHumanSession() {
    try {
      const sessionId = await this.createSession();
      const events = [];

      // Simulate human-like behavior
      // Browse pages with natural delays
      const pages = ['/home', '/products', '/pricing', '/blog', '/contact'];
      let timestamp = Date.now();

      // Initial page load
      events.push({
        eventType: 'navigation',
        timestamp: new Date(timestamp),
        targetElement: '/home',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });

      // Browse through pages
      for (let i = 0; i < 3; i++) {
        // Natural delay between page views (3-10 seconds)
        timestamp += 3000 + Math.random() * 7000;

        // Random mouse movements
        for (let j = 0; j < 5 + Math.random() * 10; j++) {
          events.push({
            eventType: 'mousemove',
            timestamp: new Date(timestamp + j * (100 + Math.random() * 200)),
            x: Math.floor(Math.random() * 1200),
            y: Math.floor(Math.random() * 800),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          });
        }

        // Scroll events
        for (let j = 0; j < 3; j++) {
          events.push({
            eventType: 'scroll',
            timestamp: new Date(timestamp + 1000 + j * 500),
            scrollX: 0,
            scrollY: Math.floor(Math.random() * 2000),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          });
        }

        // Random clicks (2-5 per page)
        for (let j = 0; j < 2 + Math.floor(Math.random() * 4); j++) {
          events.push({
            eventType: 'click',
            timestamp: new Date(timestamp + 2000 + j * 800),
            x: Math.floor(Math.random() * 1200),
            y: Math.floor(Math.random() * 800),
            targetElement: ['a', 'button', '.product', '.card'][Math.floor(Math.random() * 4)],
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          });
        }

        // Navigate to next page
        timestamp += 5000 + Math.random() * 5000;
        events.push({
          eventType: 'navigation',
          timestamp: new Date(timestamp),
          targetElement: pages[i % pages.length],
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        });
      }

      // Contact form submission (sometimes)
      if (Math.random() > 0.5) {
        timestamp += 2000 + Math.random() * 3000;
        events.push({
          eventType: 'form_submit',
          timestamp: new Date(timestamp),
          targetElement: 'form#contact',
          metadata: {
            formData: {
              name: `Human User ${Math.floor(Math.random() * 10000)}`,
              email: `user${Math.floor(Math.random() * 100000)}@example.com`,
              message: 'Great product!',
            },
          },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        });
      }

      // Session duration: 20-60 seconds
      const sessionDuration = 20000 + Math.random() * 40000;
      await new Promise((resolve) => setTimeout(resolve, sessionDuration));

      await this.logEventsBatch(sessionId, events);
      await this.endSession(sessionId);

      this.trafficStats.humansGenerated += 1;
      this.trafficStats.avgSessionDuration =
        (this.trafficStats.avgSessionDuration * (this.trafficStats.humansGenerated - 1) +
          sessionDuration) /
        this.trafficStats.humansGenerated;

      return sessionId;
    } catch (error) {
      console.warn(`[HumanTrafficGenerator] Generate human session error: ${error.message}`);
    }
  }

  /**
   * Generate quick visitor (bouncer)
   */
  async generateBouncerSession() {
    try {
      const sessionId = await this.createSession();
      const events = [];

      // Quick visit: land on page, look around, leave
      const timestamp = Date.now();

      // Initial page load
      events.push({
        eventType: 'navigation',
        timestamp: new Date(timestamp),
        targetElement: '/home',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });

      // Few mouse movements
      for (let i = 0; i < 3; i++) {
        events.push({
          eventType: 'mousemove',
          timestamp: new Date(timestamp + i * 500),
          x: Math.floor(Math.random() * 1200),
          y: Math.floor(Math.random() * 800),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        });
      }

      // One or two clicks
      for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        events.push({
          eventType: 'click',
          timestamp: new Date(timestamp + 2000 + i * 1000),
          x: Math.floor(Math.random() * 1200),
          y: Math.floor(Math.random() * 800),
          targetElement: 'a',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        });
      }

      // Quick session: 5-15 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000 + Math.random() * 10000));

      await this.logEventsBatch(sessionId, events);
      await this.endSession(sessionId);

      this.trafficStats.humansGenerated += 1;

      return sessionId;
    } catch (error) {
      console.warn(`[HumanTrafficGenerator] Generate bouncer session error: ${error.message}`);
    }
  }

  /**
   * Create a session
   */
  async createSession() {
    try {
      const response = await fetch(`${this.apiUrl}/events/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: `${this.simulatorUrl}/`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          ipAddress: `203.0.113.${Math.floor(Math.random() * 255)}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      const data = await response.json();
      this.sessionIds.push(data.sessionId);
      this.trafficStats.totalSessions += 1;
      return data.sessionId;
    } catch (error) {
      console.warn(`[HumanTrafficGenerator] Create session error: ${error.message}`);
    }
  }

  /**
   * Log events in batch
   */
  async logEventsBatch(sessionId, events) {
    try {
      const response = await fetch(`${this.apiUrl}/events/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          events: events.map((e) => ({
            sessionId,
            eventType: e.eventType,
            x: e.x || 0,
            y: e.y || 0,
            scrollX: e.scrollX || 0,
            scrollY: e.scrollY || 0,
            timestamp: e.timestamp,
            targetElement: e.targetElement,
            keyCode: e.keyCode,
            metadata: {
              userAgent: e.userAgent || 'Mozilla/5.0',
              ipAddress: `203.0.113.${Math.floor(Math.random() * 255)}`,
            },
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to log events');

      this.trafficStats.totalEvents += events.length;
      return await response.json();
    } catch (error) {
      console.warn(`[HumanTrafficGenerator] Log events error: ${error.message}`);
    }
  }

  /**
   * End session and trigger detection
   */
  async endSession(sessionId) {
    try {
      // End session
      await fetch(`${this.apiUrl}/events/sessions/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      // Trigger detection analysis
      await fetch(`${this.apiUrl}/detection/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      return true;
    } catch (error) {
      console.warn(`[HumanTrafficGenerator] End session error: ${error.message}`);
    }
  }

  /**
   * Start continuous human traffic generation
   */
  async startContinuousTraffic(durationMs = 60000, sessionsPerMinute = 3) {
    this.isRunning = true;
    const intervalMs = (60000 / sessionsPerMinute) * 1000;
    console.warn(
      `[HumanTrafficGenerator] Starting continuous traffic for ${durationMs}ms (${sessionsPerMinute} sessions/min)`
    );

    const startTime = Date.now();
    const sessionTypes = [() => this.generateHumanSession(), () => this.generateBouncerSession()];

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        if (Date.now() - startTime > durationMs || !this.isRunning) {
          clearInterval(interval);
          console.warn('[HumanTrafficGenerator] Continuous traffic completed');
          resolve(this.trafficStats);
          return;
        }

        // Generate random session type
        const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
        sessionType().catch((err) => console.warn(`[HumanTrafficGenerator] Error: ${err.message}`));
      }, intervalMs);
    });
  }

  /**
   * Stop traffic generation
   */
  stopTraffic() {
    this.isRunning = false;
    console.warn('[HumanTrafficGenerator] Traffic generation stopped');
  }

  /**
   * Get traffic statistics
   */
  getStats() {
    return {
      ...this.trafficStats,
      isRunning: this.isRunning,
      activeSessions: this.sessionIds.length,
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.trafficStats = {
      totalSessions: 0,
      totalEvents: 0,
      humansGenerated: 0,
      avgSessionDuration: 0,
    };
    this.sessionIds = [];
  }
}

export default HumanTrafficGenerator;
