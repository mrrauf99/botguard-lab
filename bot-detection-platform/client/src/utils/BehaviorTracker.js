/**
 * BehaviorTracker - Client-side event tracking for bot detection
 * Captures user interactions and sends them to the server for analysis
 */

class BehaviorTracker {
  constructor(apiUrl = 'http://localhost:5000') {
    this.apiUrl = apiUrl;
    this.sessionId = null;
    this.sessionToken = null;
    this.eventBuffer = [];
    this.bufferSize = 20; // Batch send after 20 events
    this.isTracking = false;
    this.lastActivityTime = Date.now();
    this.idleThreshold = 30000; // 30 seconds
  }

  /**
   * Initialize tracking for a new session
   */
  async initSession() {
    try {
      const response = await fetch(`${this.apiUrl}/events/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          referer: document.referrer,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      const data = await response.json();
      this.sessionId = data.sessionId;
      this.sessionToken = data.sessionToken;

      console.warn(`[BehaviorTracker] Session initialized: ${this.sessionToken}`);

      // Store in sessionStorage for access across tabs
      sessionStorage.setItem('botguard_sessionId', this.sessionId);
      sessionStorage.setItem('botguard_sessionToken', this.sessionToken);

      return data;
    } catch (error) {
      console.warn(`[BehaviorTracker] Error initializing session:`, error);
    }
  }

  /**
   * Restore session from sessionStorage if exists
   */
  restoreSession() {
    const sessionId = sessionStorage.getItem('botguard_sessionId');
    const sessionToken = sessionStorage.getItem('botguard_sessionToken');

    if (sessionId && sessionToken) {
      this.sessionId = sessionId;
      this.sessionToken = sessionToken;
      console.warn(`[BehaviorTracker] Session restored: ${this.sessionToken}`);
      return true;
    }
    return false;
  }

  /**
   * Start tracking user behavior
   */
  startTracking() {
    if (this.isTracking) return;

    // Restore session or create new one
    if (!this.restoreSession()) {
      this.initSession();
    }

    this.isTracking = true;

    // Set up event listeners
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
    document.addEventListener('scroll', (e) => this.handleScroll(e), { passive: true });
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    window.addEventListener('beforeunload', () => this.endSession());

    // Track navigation
    window.addEventListener('hashchange', () => this.handleNavigation());
    window.addEventListener('popstate', () => this.handleNavigation());

    console.warn('[BehaviorTracker] Behavior tracking started');

    // Periodically check for idle time
    this.idleCheckInterval = setInterval(() => this.checkIdleTime(), 5000);
  }

  /**
   * Stop tracking
   */
  stopTracking() {
    if (!this.isTracking) return;

    this.isTracking = false;
    clearInterval(this.idleCheckInterval);

    console.warn('[BehaviorTracker] Behavior tracking stopped');
  }

  /**
   * Handle mouse movement
   */
  handleMouseMove(event) {
    if (!this.sessionId) return;

    this.lastActivityTime = Date.now();

    this.addEvent({
      eventType: 'mousemove',
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    if (!this.sessionId) return;

    this.lastActivityTime = Date.now();

    this.addEvent({
      eventType: 'scroll',
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    if (!this.sessionId) return;

    this.lastActivityTime = Date.now();

    const target = event.target;
    this.addEvent({
      eventType: 'click',
      x: event.clientX,
      y: event.clientY,
      targetElement: target.tagName,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle keyboard events
   */
  handleKeydown(event) {
    if (!this.sessionId) return;

    this.lastActivityTime = Date.now();

    this.addEvent({
      eventType: 'keydown',
      keyCode: event.keyCode,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle page navigation
   */
  handleNavigation() {
    if (!this.sessionId) return;

    this.addEvent({
      eventType: 'navigation',
      timestamp: Date.now(),
    });
  }

  /**
   * Check for idle time
   */
  checkIdleTime() {
    const timeSinceLastActivity = Date.now() - this.lastActivityTime;

    if (timeSinceLastActivity > this.idleThreshold) {
      console.warn(`[BehaviorTracker] User idle for ${(timeSinceLastActivity / 1000).toFixed(1)}s`);
    }
  }

  /**
   * Add event to buffer
   */
  addEvent(event) {
    this.eventBuffer.push(event);

    // Send batch when buffer reaches size limit
    if (this.eventBuffer.length >= this.bufferSize) {
      this.flushEventBuffer();
    }
  }

  /**
   * Send buffered events to server
   */
  async flushEventBuffer() {
    if (!this.sessionId || this.eventBuffer.length === 0) return;

    const events = this.eventBuffer.splice(0, this.bufferSize);

    try {
      const response = await fetch(`${this.apiUrl}/events/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events,
        }),
      });

      if (!response.ok) throw new Error('Failed to send events');

      const data = await response.json();
      console.warn(`[BehaviorTracker] Sent ${data.eventsLogged} events`);
    } catch (error) {
      console.warn('[BehaviorTracker] Error sending events:', error);
      // Put events back in buffer for retry
      this.eventBuffer.unshift(...events);
    }
  }

  /**
   * End session
   */
  async endSession() {
    if (!this.sessionId) return;

    // Flush remaining events
    if (this.eventBuffer.length > 0) {
      await this.flushEventBuffer();
    }

    try {
      const response = await fetch(`${this.apiUrl}/events/sessions/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId }),
      });

      if (!response.ok) throw new Error('Failed to end session');

      console.warn(`[BehaviorTracker] Session ended: ${this.sessionToken}`);

      // Trigger detection analysis
      this.triggerDetection();

      // Clear session storage
      sessionStorage.removeItem('botguard_sessionId');
      sessionStorage.removeItem('botguard_sessionToken');
    } catch (error) {
      console.warn('[BehaviorTracker] Error ending session:', error);
    }
  }

  /**
   * Trigger detection analysis for session
   */
  async triggerDetection() {
    if (!this.sessionId) return;

    try {
      // Check if detection client is available
      if (typeof window === 'undefined' || !window.botguardDetection) {
        console.warn('[BehaviorTracker] Detection client not available');
        return;
      }

      const result = await window.botguardDetection.analyzeCurrentSession();

      if (result) {
        console.warn(
          `[BehaviorTracker] Detection result: ${result.classification} (Score: ${result.riskScore})`
        );

        // Store for access
        sessionStorage.setItem('botguard_detection_result', JSON.stringify(result));

        // Dispatch custom event for UI integration
        const event = new CustomEvent('botguard-detection-complete', { detail: result });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.warn('[BehaviorTracker] Error triggering detection:', error);
    }
  }

  /**
   * Get session stats
   */
  getStats() {
    return {
      sessionId: this.sessionId,
      sessionToken: this.sessionToken,
      isTracking: this.isTracking,
      bufferedEvents: this.eventBuffer.length,
    };
  }
}

// Export for use in browser
window.BehaviorTracker = BehaviorTracker;

export default BehaviorTracker;
