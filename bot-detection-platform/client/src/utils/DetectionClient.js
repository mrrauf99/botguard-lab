/**
 * DetectionClient - Client-side detection API integration
 * Communicates with backend detection endpoints
 */

class DetectionClient {
  constructor(apiUrl = 'http://localhost:5000') {
    this.apiUrl = apiUrl;
  }

  /**
   * Analyze current session
   */
  async analyzeCurrentSession() {
    try {
      const sessionId = sessionStorage.getItem('botguard_sessionId');
      if (!sessionId) {
        console.warn('[DetectionClient] No active session');
        return null;
      }

      const response = await fetch(`${this.apiUrl}/detection/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error('Failed to analyze session');

      const data = await response.json();
      console.warn(
        `[DetectionClient] Analysis complete: ${data.classification} (Score: ${data.riskScore})`
      );

      return data;
    } catch (error) {
      console.warn('[DetectionClient] Error analyzing session:', error);
      return null;
    }
  }

  /**
   * Batch analyze multiple sessions
   */
  async analyzeSessions(sessionIds) {
    try {
      if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
        throw new Error('sessionIds must be a non-empty array');
      }

      const response = await fetch(`${this.apiUrl}/detection/analyze/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionIds }),
      });

      if (!response.ok) throw new Error('Failed to analyze sessions');

      const data = await response.json();
      console.warn(`[DetectionClient] Batch analysis complete: ${data.analyzedCount} sessions`);

      return data;
    } catch (error) {
      console.warn('[DetectionClient] Error in batch analysis:', error);
      return null;
    }
  }

  /**
   * Get detection rules reference
   */
  async getDetectionRules() {
    try {
      const response = await fetch(`${this.apiUrl}/detection/rules`);
      if (!response.ok) throw new Error('Failed to fetch rules');

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('[DetectionClient] Error fetching detection rules:', error);
      return null;
    }
  }

  /**
   * Get detection statistics
   */
  async getDetectionStats(userId = null) {
    try {
      const url = new URL(`${this.apiUrl}/detection/stats`);
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('botguard_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('[DetectionClient] Error fetching detection stats:', error);
      return null;
    }
  }

  /**
   * Get sessions by classification
   */
  async getSessionsByClassification(classification, limit = 50, skip = 0) {
    try {
      const validClassifications = ['HUMAN', 'SUSPICIOUS', 'BOT'];
      if (!validClassifications.includes(classification)) {
        throw new Error(`Invalid classification: ${classification}`);
      }

      const url = new URL(`${this.apiUrl}/detection/sessions/${classification}`);
      url.searchParams.append('limit', limit);
      url.searchParams.append('skip', skip);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('botguard_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch sessions');

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('[DetectionClient] Error fetching sessions:', error);
      return null;
    }
  }

  /**
   * Get detection result for current session
   */
  async getCurrentSessionDetectionResult() {
    try {
      const result = await this.analyzeCurrentSession();

      if (result) {
        // Store result in sessionStorage for UI access
        sessionStorage.setItem('botguard_detection_result', JSON.stringify(result));
        return result;
      }

      return null;
    } catch (error) {
      console.warn('[DetectionClient] Error getting detection result:', error);
      return null;
    }
  }

  /**
   * Check if current session is flagged as bot
   */
  async isCurrentSessionBot() {
    const result = await this.analyzeCurrentSession();
    return result && result.classification === 'BOT';
  }

  /**
   * Check if current session is suspicious
   */
  async isCurrentSessionSuspicious() {
    const result = await this.analyzeCurrentSession();
    return result && result.classification === 'SUSPICIOUS';
  }

  /**
   * Get current session detection status
   */
  getCurrentDetectionStatus() {
    const result = sessionStorage.getItem('botguard_detection_result');
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }

  /**
   * Clear cached detection result
   */
  clearDetectionResult() {
    sessionStorage.removeItem('botguard_detection_result');
  }
}

// Export for use in browser
window.DetectionClient = DetectionClient;

export default DetectionClient;
