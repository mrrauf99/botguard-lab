class BotTrafficGenerator {
  constructor(apiUrl = 'http://localhost:5000', simulatorUrl = 'http://localhost:3000') {
    this.apiUrl = apiUrl;
    this.simulatorUrl = simulatorUrl;
    this.isRunning = false;
    this.sessionIds = [];
    this.sessionTokens = new Map();
    this.trafficStats = {
      totalSessions: 0,
      totalEvents: 0,
      botsGenerated: 0,
      avgRiskScore: 0,
    };
  }

  /**
   * Generate fast navigation bot behavior
   */
  async generateFastNavigationBot() {
    try {
      const sessionId = await this.createSession();
      const events = [];

      // Simulate rapid page navigation
      for (let i = 0; i < 15; i++) {
        events.push({
          eventType: 'navigation',
          timestamp: new Date(Date.now() + i * 100),
          targetElement: `/page-${i}`,
          userAgent: 'Mozilla/5.0 (Bot)',
        });
      }

      await this.logEventsBatch(sessionId, events);
      await this.endSession(sessionId);
      this.trafficStats.botsGenerated += 1;
      return sessionId;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] Fast navigation bot error: ${error.message}`);
    }
  }

  /**
   * Generate no-interaction bot behavior
   */
  async generateNoInteractionBot() {
    try {
      const sessionId = await this.createSession();

      // Bot just sits on page with no interaction
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await this.endSession(sessionId);
      this.trafficStats.botsGenerated += 1;
      return sessionId;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] No-interaction bot error: ${error.message}`);
    }
  }

  /**
   * Generate form spam bot behavior
   */
  async generateFormSpamBot() {
    try {
      const sessionId = await this.createSession();
      const events = [];

      // Simulate rapid form submissions
      for (let i = 0; i < 10; i++) {
        events.push({
          eventType: 'form_submit',
          timestamp: new Date(Date.now() + i * 200),
          targetElement: 'form#contact',
          metadata: { formData: { name: `Bot${i}`, email: `bot${i}@spam.com` } },
          userAgent: 'Mozilla/5.0 (Bot)',
        });
      }

      await this.logEventsBatch(sessionId, events);
      await this.endSession(sessionId);
      this.trafficStats.botsGenerated += 1;
      return sessionId;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] Form spam bot error: ${error.message}`);
    }
  }

  /**
   * Generate high-frequency click bot behavior
   */
  async generateClickSpamBot() {
    try {
      const sessionId = await this.createSession();
      const events = [];

      // Simulate rapid clicking
      for (let i = 0; i < 50; i++) {
        events.push({
          eventType: 'click',
          timestamp: new Date(Date.now() + i * 50),
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 800),
          targetElement: '.button',
          userAgent: 'Mozilla/5.0 (Bot)',
        });
      }

      await this.logEventsBatch(sessionId, events);
      await this.endSession(sessionId);
      this.trafficStats.botsGenerated += 1;
      return sessionId;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] Click spam bot error: ${error.message}`);
    }
  }

  /**
   * Generate suspicious pattern bot behavior
   */
  async generateSuspiciousBot() {
    try {
      const sessionId = await this.createSession();
      const events = [];

      // Mix of suspicious behaviors
      const behaviors = [
        { type: 'click', count: 20 },
        { type: 'navigation', count: 10 },
        { type: 'form_submit', count: 5 },
      ];

      let timestamp = Date.now();
      behaviors.forEach((behavior) => {
        for (let i = 0; i < behavior.count; i++) {
          events.push({
            eventType: behavior.type,
            timestamp: new Date(timestamp),
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 800),
            targetElement: '.element',
            userAgent: 'Mozilla/5.0 (Bot)',
          });
          timestamp += 100;
        }
      });

      await this.logEventsBatch(sessionId, events);
      await this.endSession(sessionId);
      this.trafficStats.botsGenerated += 1;
      return sessionId;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] Suspicious bot error: ${error.message}`);
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
          userAgent: 'Mozilla/5.0 (Bot)',
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      const data = await response.json();
      this.sessionIds.push(data.sessionId);
      this.sessionTokens.set(data.sessionId, data.sessionToken);
      this.trafficStats.totalSessions += 1;
      return data.sessionId;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] Create session error: ${error.message}`);
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
            timestamp: e.timestamp,
            targetElement: e.targetElement,
            keyCode: e.keyCode,
            metadata: {
              userAgent: e.userAgent || 'Mozilla/5.0',
              ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            },
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to log events');

      this.trafficStats.totalEvents += events.length;
      return await response.json();
    } catch (error) {
      console.warn(`[BotTrafficGenerator] Log events error: ${error.message}`);
    }
  }

  /**
   * End session and trigger detection
   */
  async endSession(sessionId) {
    try {
      const sessionToken = this.sessionTokens.get(sessionId);

      await fetch(`${this.apiUrl}/events/sessions/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, sessionToken }),
      });

      await fetch(`${this.apiUrl}/detection/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, sessionToken }),
      });

      return true;
    } catch (error) {
      console.warn(`[BotTrafficGenerator] End session error: ${error.message}`);
    }
  }

  /**
   * Start continuous bot traffic generation
   */
  async startContinuousTraffic(durationMs = 60000, botTypesPerInterval = 2, intervalMs = 5000) {
    this.isRunning = true;
    console.warn(
      `[BotTrafficGenerator] Starting continuous traffic for ${durationMs}ms (${botTypesPerInterval} bots every ${intervalMs}ms)`
    );

    const startTime = Date.now();
    const botTypes = [
      () => this.generateFastNavigationBot(),
      () => this.generateNoInteractionBot(),
      () => this.generateFormSpamBot(),
      () => this.generateClickSpamBot(),
      () => this.generateSuspiciousBot(),
    ];

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        if (Date.now() - startTime > durationMs || !this.isRunning) {
          clearInterval(interval);
          console.warn('[BotTrafficGenerator] Continuous traffic completed');
          resolve(this.trafficStats);
          return;
        }

        // Generate multiple bot types in parallel
        for (let i = 0; i < botTypesPerInterval; i++) {
          const botType = botTypes[Math.floor(Math.random() * botTypes.length)];
          botType().catch((err) => console.warn(`[BotTrafficGenerator] Error: ${err.message}`));
        }
      }, intervalMs);
    });
  }

  /**
   * Stop traffic generation
   */
  stopTraffic() {
    this.isRunning = false;
    console.warn('[BotTrafficGenerator] Traffic generation stopped');
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
      botsGenerated: 0,
      avgRiskScore: 0,
    };
    this.sessionIds = [];
  }
}

export default BotTrafficGenerator;
