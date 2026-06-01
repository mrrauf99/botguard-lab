class SimulatorClient {
  constructor(apiUrl = 'http://localhost:5001') {
    this.apiUrl = apiUrl;
    this.statusInterval = null;
  }

  /**
   * Start bot traffic
   */
  async startBotTraffic(config = {}) {
    try {
      const { duration = 60000, botsPerInterval = 2, interval = 5000 } = config;

      const response = await fetch(`${this.apiUrl}/simulator/traffic/bot/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          botsPerInterval,
          interval,
        }),
      });

      if (!response.ok) throw new Error('Failed to start bot traffic');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Start bot traffic error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start human traffic
   */
  async startHumanTraffic(config = {}) {
    try {
      const { duration = 60000, sessionsPerMinute = 3 } = config;

      const response = await fetch(`${this.apiUrl}/simulator/traffic/human/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          sessionsPerMinute,
        }),
      });

      if (!response.ok) throw new Error('Failed to start human traffic');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Start human traffic error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start combined traffic
   */
  async startCombinedTraffic(config = {}) {
    try {
      const {
        duration = 120000,
        botBotsPerInterval = 2,
        botInterval = 5000,
        humanSessionsPerMinute = 3,
      } = config;

      const response = await fetch(`${this.apiUrl}/simulator/traffic/combined/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          botBotsPerInterval,
          botInterval,
          humanSessionsPerMinute,
        }),
      });

      if (!response.ok) throw new Error('Failed to start combined traffic');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Start combined traffic error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stop bot traffic
   */
  async stopBotTraffic() {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/traffic/bot/stop`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to stop bot traffic');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Stop bot traffic error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stop human traffic
   */
  async stopHumanTraffic() {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/traffic/human/stop`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to stop human traffic');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Stop human traffic error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stop all traffic
   */
  async stopAllTraffic() {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/traffic/stop-all`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to stop all traffic');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Stop all traffic error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get traffic status and statistics
   */
  async getTrafficStatus() {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/traffic/status`);

      if (!response.ok) throw new Error('Failed to get traffic status');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Get traffic status error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reset statistics
   */
  async resetStats() {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/stats/reset`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reset stats');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Reset stats error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate single bot
   */
  async generateSingleBot(type = 'fast-navigation') {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/generate/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error('Failed to generate bot');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Generate bot error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate single human
   */
  async generateSingleHuman(type = 'normal') {
    try {
      const response = await fetch(`${this.apiUrl}/simulator/generate/human`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error('Failed to generate human');

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Generate human error: ${error.message}`);
      throw error;
    }
  }

  async runAttack(type, config = {}) {
    try {
      const {
        targetUrl = 'http://localhost:3000',
        apiUrl = 'http://localhost:5000',
      } = config;

      const response = await fetch(`${this.apiUrl}/simulator/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, targetUrl, apiUrl }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Attack failed');
      }

      return await response.json();
    } catch (error) {
      console.warn(`[SimulatorClient] Attack error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start auto-refresh of status
   */
  startStatusRefresh(callback, intervalMs = 2000) {
    this.statusInterval = setInterval(async () => {
      try {
        const status = await this.getTrafficStatus();
        if (callback) callback(status);
      } catch (error) {
        console.warn(`[SimulatorClient] Status refresh error: ${error.message}`);
      }
    }, intervalMs);
  }

  /**
   * Stop auto-refresh
   */
  stopStatusRefresh() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  }
}

export default SimulatorClient;
