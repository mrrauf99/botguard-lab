const MAX_ATTEMPTS = 10;

class AttackSimulator {
  constructor(apiUrl = 'http://localhost:5000', targetUrl = 'http://localhost:3000') {
    this.apiUrl = apiUrl;
    this.targetUrl = targetUrl;
  }

  async createSession() {
    const response = await fetch(`${this.apiUrl}/events/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageUrl: this.targetUrl,
        userAgent: 'Mozilla/5.0 (BotGuard Attack Simulator)',
        ipAddress: '127.0.0.1',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    return response.json();
  }

  async logBatch(sessionId, events) {
    const response = await fetch(`${this.apiUrl}/events/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, events }),
    });

    if (!response.ok) {
      throw new Error('Failed to log events');
    }

    return response.json();
  }

  async endAndAnalyze(sessionId, sessionToken) {
    await fetch(`${this.apiUrl}/events/sessions/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, sessionToken }),
    });

    const response = await fetch(`${this.apiUrl}/detection/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, sessionToken }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Detection analyze failed');
    }

    return response.json();
  }

  isStopped(detection) {
    return detection?.blocked || detection?.classification === 'BOT';
  }

  buildResult(attackType, sessionId, requestsSent, detection, stoppedReason) {
    return {
      attackType,
      sessionId,
      requestsSent,
      status: stoppedReason ? 'stopped' : 'completed',
      stoppedReason: stoppedReason || 'max_attempts',
      detection: {
        classification: detection?.classification,
        riskScore: detection?.riskScore,
        reasons: detection?.reasons,
        blocked: detection?.blocked,
      },
    };
  }

  async runLoginAttack() {
    const { sessionId, sessionToken } = await this.createSession();
    let requestsSent = 0;

    for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
      requestsSent += 1;
      await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@botguard.local',
          password: `wrong-password-${i}`,
        }),
      });
    }

    const detection = await this.endAndAnalyze(sessionId, sessionToken);
    const stoppedReason = this.isStopped(detection) ? 'bot_detected' : null;
    return this.buildResult('login-attack', sessionId, requestsSent, detection, stoppedReason);
  }

  async runSpamBot() {
    const { sessionId, sessionToken } = await this.createSession();
    const events = [];

    for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
      events.push({
        eventType: 'form_submit',
        timestamp: new Date(Date.now() + i * 200).toISOString(),
        targetElement: 'form#contact',
      });
    }

    await this.logBatch(sessionId, events);
    const detection = await this.endAndAnalyze(sessionId, sessionToken);
    const stoppedReason = this.isStopped(detection)
      ? detection.blocked
        ? 'session_blocked'
        : 'bot_detected'
      : null;

    return this.buildResult('spam-bot', sessionId, MAX_ATTEMPTS, detection, stoppedReason);
  }

  async runScraperBot() {
    const { sessionId, sessionToken } = await this.createSession();
    let requestsSent = 0;
    let stoppedReason = null;

    const events = [];
    for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
      requestsSent += 1;
      events.push({
        eventType: 'navigation',
        timestamp: new Date(Date.now() + i * 100).toISOString(),
        targetElement: `${this.targetUrl}/scrape-${i}`,
      });
    }

    await this.logBatch(sessionId, events);
    const detection = await this.endAndAnalyze(sessionId, sessionToken);
    if (this.isStopped(detection)) {
      stoppedReason = detection.blocked ? 'session_blocked' : 'bot_detected';
    }

    return this.buildResult('scraper-bot', sessionId, requestsSent, detection, stoppedReason);
  }
}

export default AttackSimulator;
