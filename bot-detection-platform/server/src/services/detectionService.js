/**
 * DetectionService - Bot Detection Algorithm
 * Analyzes session behavior and computes risk scores
 */

class DetectionService {
  constructor() {
    this.thresholds = {
      humanMax: 29,
      suspiciousMin: 30,
      suspiciousMax: 59,
      botMin: 60,
      botMax: 100,
    };

    this.weights = {
      fastNavigation: 15,
      noMouseMovement: 20,
      noScroll: 18,
      highClickRate: 12,
      highKeyRate: 10,
      shortSession: 15,
      longIdle: 8,
      spamSubmissions: 12,
      sequentialClicks: 10,
    };
  }

  /**
   * Compute risk score for a session
   * @param {Object} session - Session object from MongoDB
   * @param {Array} events - Events for the session
   * @returns {Object} - { riskScore, classification, reasons }
   */
  analyzeSession(session, events) {
    const reasons = [];
    let riskScore = 0;

    // Rule 1: Fast Navigation (multiple page changes in short time)
    const fastNavRules = this.checkFastNavigation(session, events);
    if (fastNavRules.triggered) {
      riskScore += this.weights.fastNavigation;
      reasons.push(fastNavRules.reason);
    }

    // Rule 2: No Mouse Movement
    const noMouseRules = this.checkNoMouseMovement(session);
    if (noMouseRules.triggered) {
      riskScore += this.weights.noMouseMovement;
      reasons.push(noMouseRules.reason);
    }

    // Rule 3: No Scroll Activity
    const noScrollRules = this.checkNoScroll(session);
    if (noScrollRules.triggered) {
      riskScore += this.weights.noScroll;
      reasons.push(noScrollRules.reason);
    }

    // Rule 4: High Click Rate
    const highClickRules = this.checkHighClickRate(session);
    if (highClickRules.triggered) {
      riskScore += this.weights.highClickRate;
      reasons.push(highClickRules.reason);
    }

    // Rule 5: High Keyboard Input Rate
    const highKeyRules = this.checkHighKeyRate(session);
    if (highKeyRules.triggered) {
      riskScore += this.weights.highKeyRate;
      reasons.push(highKeyRules.reason);
    }

    // Rule 6: Very Short Session
    const shortSessionRules = this.checkShortSession(session);
    if (shortSessionRules.triggered) {
      riskScore += this.weights.shortSession;
      reasons.push(shortSessionRules.reason);
    }

    // Rule 7: Long Idle Periods
    const longIdleRules = this.checkLongIdle(session);
    if (longIdleRules.triggered) {
      riskScore += this.weights.longIdle;
      reasons.push(longIdleRules.reason);
    }

    // Rule 8: Spam-like Form Submissions
    const spamRules = this.checkSpamSubmissions(session, events);
    if (spamRules.triggered) {
      riskScore += this.weights.spamSubmissions;
      reasons.push(spamRules.reason);
    }

    // Rule 9: Sequential Click Patterns
    const sequentialClickRules = this.checkSequentialClicks(events);
    if (sequentialClickRules.triggered) {
      riskScore += this.weights.sequentialClicks;
      reasons.push(sequentialClickRules.reason);
    }

    // Cap score at 100
    riskScore = Math.min(riskScore, 100);

    // Classify based on risk score
    let classification = 'HUMAN';
    if (riskScore >= this.thresholds.botMin) {
      classification = 'BOT';
    } else if (riskScore >= this.thresholds.suspiciousMin) {
      classification = 'SUSPICIOUS';
    }

    return {
      riskScore: Math.round(riskScore),
      classification,
      reasons,
      confidence: this.calculateConfidence(reasons.length, riskScore),
    };
  }

  /**
   * Rule 1: Detect fast navigation (multiple page changes)
   */
  checkFastNavigation(session) {
    const navigationCount = session.navigationEvents || 0;
    const duration = session.duration || 1;
    const navigationRate = navigationCount / (duration / 1000 / 60); // events per minute

    if (navigationRate > 5) {
      return {
        triggered: true,
        reason: `Fast navigation detected: ${navigationRate.toFixed(1)} page changes/min`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 2: No mouse movement
   */
  checkNoMouseMovement(session) {
    const mouseEvents = session.mouseEvents || 0;

    if (mouseEvents === 0) {
      return {
        triggered: true,
        reason: 'No mouse movement detected',
      };
    }

    // Also flag if very few mouse events relative to total events
    const eventRatio = mouseEvents / Math.max(session.eventCount, 1);
    if (eventRatio < 0.05 && session.eventCount > 50) {
      return {
        triggered: true,
        reason: `Extremely low mouse movement: ${(eventRatio * 100).toFixed(1)}% of events`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 3: No scroll activity
   */
  checkNoScroll(session) {
    const scrollEvents = session.scrollEvents || 0;

    if (scrollEvents === 0) {
      return {
        triggered: true,
        reason: 'No scroll activity detected',
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 4: High click rate
   */
  checkHighClickRate(session) {
    const clickEvents = session.clickEvents || 0;
    const duration = session.duration || 1;
    const clickRate = clickEvents / (duration / 1000); // clicks per second

    if (clickRate > 5) {
      return {
        triggered: true,
        reason: `Abnormally high click rate: ${clickRate.toFixed(1)} clicks/sec`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 5: High keyboard input rate
   */
  checkHighKeyRate(session) {
    const keyEvents = session.keyEvents || 0;
    const duration = session.duration || 1;
    const keyRate = keyEvents / (duration / 1000); // keys per second

    if (keyRate > 10) {
      return {
        triggered: true,
        reason: `Abnormally high keystroke rate: ${keyRate.toFixed(1)} keys/sec`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 6: Very short session (less than 5 seconds)
   */
  checkShortSession(session) {
    const duration = session.duration || 0;

    if (duration < 5000) {
      return {
        triggered: true,
        reason: `Very short session: ${(duration / 1000).toFixed(1)} seconds`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 7: Long idle periods
   */
  checkLongIdle(session) {
    const maxIdle = session.maxIdlePeriod || 0;

    // If user was idle for more than 2 minutes continuously, might be bot
    if (maxIdle > 120000) {
      return {
        triggered: true,
        reason: `Long idle period detected: ${(maxIdle / 1000).toFixed(1)} seconds`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 8: Spam-like form submissions
   */
  checkSpamSubmissions(session, events) {
    const formSubmits = events.filter((e) => e.eventType === 'form_submit').length;
    const duration = session.duration || 1;
    const submitRate = formSubmits / (duration / 1000 / 60); // submissions per minute

    if (submitRate > 2) {
      return {
        triggered: true,
        reason: `Suspicious form submission rate: ${submitRate.toFixed(2)} submissions/min`,
      };
    }

    return { triggered: false };
  }

  /**
   * Rule 9: Sequential click patterns (same element repeatedly)
   */
  checkSequentialClicks(events) {
    const clickEvents = events.filter((e) => e.eventType === 'click');

    if (clickEvents.length < 5) return { triggered: false };

    // Count clicks on same element consecutively
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let lastElement = null;

    for (const event of clickEvents) {
      if (event.targetElement === lastElement) {
        currentConsecutive += 1;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 1;
        lastElement = event.targetElement;
      }
    }

    if (maxConsecutive > 5) {
      return {
        triggered: true,
        reason: `Repetitive clicking pattern: ${maxConsecutive} consecutive clicks on same element`,
      };
    }

    return { triggered: false };
  }

  /**
   * Calculate detection confidence (0-100)
   */
  calculateConfidence(reasonCount, riskScore) {
    // More reasons = higher confidence
    const confidenceFromReasons = Math.min(reasonCount * 15, 100);

    // Higher score = higher confidence
    const confidenceFromScore = (Math.abs(riskScore - 50) / 50) * 100;

    return Math.round((confidenceFromReasons + confidenceFromScore) / 2);
  }

  /**
   * Batch analyze multiple sessions
   */
  async batchAnalyzeSessions(sessions, events) {
    const results = [];

    for (const session of sessions) {
      const sessionEvents = events.filter(
        (e) => e.sessionId?.toString() === session._id?.toString()
      );
      const analysis = this.analyzeSession(session, sessionEvents);

      results.push({
        sessionId: session._id,
        ...analysis,
      });
    }

    return results;
  }
}

export default DetectionService;
