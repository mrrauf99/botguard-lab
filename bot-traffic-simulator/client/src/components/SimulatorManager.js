import SimulatorClient from '../utils/SimulatorClient.js';

const SimulatorManager = () => {
  let simulatorClient = null;

  /**
   * Initialize the simulator manager
   */
  const initialize = () => {
    simulatorClient = new SimulatorClient('http://localhost:5001');

    // Bot Traffic Controls
    document.getElementById('btn-start-bot')?.addEventListener('click', startBotTraffic);
    document.getElementById('btn-stop-bot')?.addEventListener('click', stopBotTraffic);

    // Human Traffic Controls
    document.getElementById('btn-start-human')?.addEventListener('click', startHumanTraffic);
    document.getElementById('btn-stop-human')?.addEventListener('click', stopHumanTraffic);

    // Combined Traffic Controls
    document.getElementById('btn-start-combined')?.addEventListener('click', startCombinedTraffic);
    document.getElementById('btn-stop-combined')?.addEventListener('click', stopCombinedTraffic);

    // Bot Type Buttons
    document.querySelectorAll('.btn-bot-type').forEach((btn) => {
      btn.addEventListener('click', () => generateSingleBot(btn.dataset.type));
    });

    // Human Type Buttons
    document.querySelectorAll('.btn-human-type').forEach((btn) => {
      btn.addEventListener('click', () => generateSingleHuman(btn.dataset.type));
    });

    // Action Buttons
    document.getElementById('btn-reset-stats')?.addEventListener('click', resetStats);
    document.getElementById('btn-refresh-status')?.addEventListener('click', refreshStatus);

    // Start auto-refresh
    simulatorClient.startStatusRefresh(updateStatus);

    // Initial status
    refreshStatus();

    addLog('Simulator initialized', 'info');
  };

  /**
   * Start bot traffic
   */
  const startBotTraffic = async () => {
    try {
      const duration = parseInt(document.getElementById('bot-duration')?.value || 60) * 1000;
      const botsPerInterval = parseInt(document.getElementById('bot-rate')?.value || 2);
      const interval = parseInt(document.getElementById('bot-interval')?.value || 5000);

      await simulatorClient.startBotTraffic({
        duration,
        botsPerInterval,
        interval,
      });

      document.getElementById('btn-start-bot').disabled = true;
      document.getElementById('btn-stop-bot').disabled = false;
      document.getElementById('bot-status').textContent = 'Running';
      document.getElementById('bot-indicator').classList.add('active');

      addLog(`Bot traffic started: ${botsPerInterval} bots every ${interval}ms`, 'success');
    } catch (error) {
      addLog(`Error starting bot traffic: ${error.message}`, 'error');
    }
  };

  /**
   * Stop bot traffic
   */
  const stopBotTraffic = async () => {
    try {
      const stats = (await simulatorClient.stopBotTraffic()).stats;

      document.getElementById('btn-start-bot').disabled = false;
      document.getElementById('btn-stop-bot').disabled = true;
      document.getElementById('bot-status').textContent = 'Stopped';
      document.getElementById('bot-indicator').classList.remove('active');

      updateStats(stats);
      addLog('Bot traffic stopped', 'info');
    } catch (error) {
      addLog(`Error stopping bot traffic: ${error.message}`, 'error');
    }
  };

  /**
   * Start human traffic
   */
  const startHumanTraffic = async () => {
    try {
      const duration = parseInt(document.getElementById('human-duration')?.value || 60) * 1000;
      const sessionsPerMinute = parseInt(document.getElementById('human-rate')?.value || 3);

      await simulatorClient.startHumanTraffic({
        duration,
        sessionsPerMinute,
      });

      document.getElementById('btn-start-human').disabled = true;
      document.getElementById('btn-stop-human').disabled = false;
      document.getElementById('human-status').textContent = 'Running';
      document.getElementById('human-indicator').classList.add('active');

      addLog(`Human traffic started: ${sessionsPerMinute} sessions/min`, 'success');
    } catch (error) {
      addLog(`Error starting human traffic: ${error.message}`, 'error');
    }
  };

  /**
   * Stop human traffic
   */
  const stopHumanTraffic = async () => {
    try {
      const stats = (await simulatorClient.stopHumanTraffic()).stats;

      document.getElementById('btn-start-human').disabled = false;
      document.getElementById('btn-stop-human').disabled = true;
      document.getElementById('human-status').textContent = 'Stopped';
      document.getElementById('human-indicator').classList.remove('active');

      updateStats(stats);
      addLog('Human traffic stopped', 'info');
    } catch (error) {
      addLog(`Error stopping human traffic: ${error.message}`, 'error');
    }
  };

  /**
   * Start combined traffic
   */
  const startCombinedTraffic = async () => {
    try {
      const duration = parseInt(document.getElementById('combined-duration')?.value || 120) * 1000;

      await simulatorClient.startCombinedTraffic({
        duration,
      });

      document.getElementById('btn-start-bot').disabled = true;
      document.getElementById('btn-start-human').disabled = true;
      document.getElementById('btn-start-combined').disabled = true;
      document.getElementById('btn-stop-combined').disabled = false;

      document.getElementById('bot-status').textContent = 'Running';
      document.getElementById('human-status').textContent = 'Running';
      document.getElementById('bot-indicator').classList.add('active');
      document.getElementById('human-indicator').classList.add('active');

      addLog('Combined traffic started', 'success');
    } catch (error) {
      addLog(`Error starting combined traffic: ${error.message}`, 'error');
    }
  };

  /**
   * Stop combined traffic
   */
  const stopCombinedTraffic = async () => {
    try {
      const response = await simulatorClient.stopAllTraffic();

      document.getElementById('btn-start-bot').disabled = false;
      document.getElementById('btn-start-human').disabled = false;
      document.getElementById('btn-start-combined').disabled = false;
      document.getElementById('btn-stop-combined').disabled = true;

      document.getElementById('bot-status').textContent = 'Stopped';
      document.getElementById('human-status').textContent = 'Stopped';
      document.getElementById('bot-indicator').classList.remove('active');
      document.getElementById('human-indicator').classList.remove('active');

      updateStats(response.botStats, response.humanStats);
      addLog('Combined traffic stopped', 'info');
    } catch (error) {
      addLog(`Error stopping combined traffic: ${error.message}`, 'error');
    }
  };

  /**
   * Generate single bot
   */
  const generateSingleBot = async (type) => {
    try {
      const result = await simulatorClient.generateSingleBot(type);
      updateStats(result.stats);
      addLog(`Generated ${type} bot (Session: ${result.sessionId})`, 'success');
    } catch (error) {
      addLog(`Error generating ${type} bot: ${error.message}`, 'error');
    }
  };

  /**
   * Generate single human
   */
  const generateSingleHuman = async (type) => {
    try {
      const result = await simulatorClient.generateSingleHuman(type);
      updateStats(result.stats);
      addLog(`Generated ${type} human session (Session: ${result.sessionId})`, 'success');
    } catch (error) {
      addLog(`Error generating ${type} human: ${error.message}`, 'error');
    }
  };

  /**
   * Reset statistics
   */
  const resetStats = async () => {
    try {
      await simulatorClient.resetStats();
      addLog('Statistics reset', 'info');
      refreshStatus();
    } catch (error) {
      addLog(`Error resetting stats: ${error.message}`, 'error');
    }
  };

  /**
   * Refresh status
   */
  const refreshStatus = async () => {
    try {
      const status = await simulatorClient.getTrafficStatus();
      updateStatus(status);
    } catch (error) {
      console.warn(`[SimulatorManager] Error refreshing status: ${error.message}`);
    }
  };

  /**
   * Update status display
   */
  const updateStatus = (status) => {
    if (!status) return;

    // Update traffic status
    if (status.active) {
      document.getElementById('bot-status').textContent = status.active.bot ? 'Running' : 'Stopped';
      document.getElementById('human-status').textContent = status.active.human
        ? 'Running'
        : 'Stopped';

      document.getElementById('bot-indicator').classList.toggle('active', status.active.bot);
      document.getElementById('human-indicator').classList.toggle('active', status.active.human);
    }

    // Update stats
    if (status.stats) {
      updateStats(status.stats.bot, status.stats.human);
    }
  };

  /**
   * Update statistics display
   */
  const updateStats = (botStats, humanStats) => {
    if (botStats) {
      document.getElementById('stat-bot-sessions').textContent = botStats.totalSessions || 0;
      document.getElementById('stat-bot-events').textContent = botStats.totalEvents || 0;
    }

    if (humanStats) {
      document.getElementById('stat-human-sessions').textContent = humanStats.totalSessions || 0;
      document.getElementById('stat-human-events').textContent = humanStats.totalEvents || 0;
    }

    // Update combined stats
    const totalSessions = (botStats?.totalSessions || 0) + (humanStats?.totalSessions || 0);
    const totalEvents = (botStats?.totalEvents || 0) + (humanStats?.totalEvents || 0);

    document.getElementById('stat-total-sessions').textContent = totalSessions;
    document.getElementById('stat-total-events').textContent = totalEvents;
  };

  /**
   * Add log entry
   */
  const addLog = (message, type = 'info') => {
    const logDiv = document.getElementById('activity-log');
    if (!logDiv) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timeStr}] ${message}`;

    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;

    // Keep only last 100 entries
    const entries = logDiv.querySelectorAll('.log-entry');
    if (entries.length > 100) {
      entries[0].remove();
    }
  };

  return {
    initialize,
  };
};

export default SimulatorManager;
