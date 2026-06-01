import { io } from 'https://cdn.socket.io/4.5.4/socket.io.esm.min.js';
import { updateStatWidgets, updateSessionsTable, addAlertItem, clearAlerts } from '../components/Widgets.js';
import { updatePieChart, updateBarChart, updateLineChart } from '../components/Charts.js';

class DashboardSocket {
  constructor(apiUrl = 'http://localhost:5000') {
    this.apiUrl = apiUrl;
    this.socket = null;
    this.dashboardSocket = null;
    this.isConnected = false;
    this.stats = null;
    this.trends = null;
    this.distribution = null;
  }

  /**
   * Connect to Socket.io server
   */
  connect() {
    try {
      this.dashboardSocket = io(`${this.apiUrl}/dashboard`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      this.dashboardSocket.on('connect', () => {
        console.warn('[DashboardSocket] Connected to Socket.io');
        this.isConnected = true;

        // Subscribe to real-time updates
        this.dashboardSocket.emit('subscribe-stats');
        this.dashboardSocket.emit('subscribe-sessions');
        this.dashboardSocket.emit('subscribe-detections');
      });

      this.dashboardSocket.on('disconnect', () => {
        console.warn('[DashboardSocket] Disconnected from Socket.io');
        this.isConnected = false;
      });

      // Listen for stats updates
      this.dashboardSocket.on('stats-update', (stats) => {
        console.warn('[DashboardSocket] Stats update received');
        this.stats = stats;
        updateStatWidgets(stats);
      });

      // Listen for new sessions
      this.dashboardSocket.on('new-session', (session) => {
        console.warn(`[DashboardSocket] New session: ${session._id}`);
      });

      // Listen for session ended
      this.dashboardSocket.on('session-ended', (data) => {
        console.warn(`[DashboardSocket] Session ended: ${data.sessionId}`);
      });

      // Listen for detection results
      this.dashboardSocket.on('detection-result', (data) => {
        console.warn(`[DashboardSocket] Detection result: ${data.sessionId}`);
        // Refresh high-risk sessions if bot detected
        if (data.result.classification === 'BOT' || data.result.riskScore > 60) {
          this.fetchHighRiskSessions();
        }
      });

      // Listen for classification updates
      this.dashboardSocket.on('classification-update', (data) => {
        console.warn(`[DashboardSocket] Classification update: ${data.sessionId} -> ${data.classification}`);
      });

      this.dashboardSocket.on('error', (error) => {
        console.warn(`[DashboardSocket] Error: ${error}`);
      });
    } catch (error) {
      console.warn(`[DashboardSocket] Connection failed: ${error.message}`);
    }
  }

  /**
   * Disconnect from Socket.io
   */
  disconnect() {
    if (this.dashboardSocket) {
      this.dashboardSocket.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Fetch dashboard statistics
   */
  async fetchStats(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${this.apiUrl}/dashboard/stats?${params}`);
      if (!response.ok) throw new Error('Failed to fetch stats');

      const stats = await response.json();
      this.stats = stats;
      updateStatWidgets(stats);
      updatePieChart(stats);
      return stats;
    } catch (error) {
      console.warn(`[DashboardSocket] Failed to fetch stats: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch detection trends
   */
  async fetchTrends(days = 7) {
    try {
      const response = await fetch(`${this.apiUrl}/dashboard/trends?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch trends');

      const data = await response.json();
      this.trends = data.trends;
      updateLineChart(data.trends);
      return data.trends;
    } catch (error) {
      console.warn(`[DashboardSocket] Failed to fetch trends: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch risk distribution
   */
  async fetchRiskDistribution() {
    try {
      const response = await fetch(`${this.apiUrl}/dashboard/risk-distribution`);
      if (!response.ok) throw new Error('Failed to fetch risk distribution');

      const data = await response.json();
      this.distribution = data.distribution;
      updateBarChart(data.distribution);
      return data.distribution;
    } catch (error) {
      console.warn(`[DashboardSocket] Failed to fetch risk distribution: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch recent sessions
   */
  async fetchRecentSessions(limit = 10) {
    try {
      // Get high-risk sessions first for sorting
      const response = await fetch(`${this.apiUrl}/dashboard/high-risk-sessions?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch recent sessions');

      const data = await response.json();
      updateSessionsTable(data.sessions);
      return data.sessions;
    } catch (error) {
      console.warn(`[DashboardSocket] Failed to fetch recent sessions: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch high-risk sessions for alerts
   */
  async fetchHighRiskSessions(limit = 10, threshold = 60) {
    try {
      const response = await fetch(
        `${this.apiUrl}/dashboard/high-risk-sessions?limit=${limit}&threshold=${threshold}`
      );
      if (!response.ok) throw new Error('Failed to fetch high-risk sessions');

      const data = await response.json();

      // Clear old alerts and add new ones
      clearAlerts();
      data.sessions.forEach(session => {
        addAlertItem(session);
      });

      return data.sessions;
    } catch (error) {
      console.warn(`[DashboardSocket] Failed to fetch high-risk sessions: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch all dashboard data (initial load)
   */
  async loadDashboardData() {
    try {
      console.warn('[DashboardSocket] Loading dashboard data...');

      const [stats, trends, distribution, sessions, highRisk] = await Promise.all([
        this.fetchStats(),
        this.fetchTrends(7),
        this.fetchRiskDistribution(),
        this.fetchRecentSessions(10),
        this.fetchHighRiskSessions(10)
      ]);

      console.warn('[DashboardSocket] Dashboard data loaded');
      return { stats, trends, distribution, sessions, highRisk };
    } catch (error) {
      console.warn(`[DashboardSocket] Failed to load dashboard data: ${error.message}`);
      return null;
    }
  }

  /**
   * Set up auto-refresh interval
   */
  setupAutoRefresh(interval = 30000) {
    setInterval(() => {
      if (this.isConnected) {
        console.warn('[DashboardSocket] Auto-refreshing dashboard data...');
        this.loadDashboardData();
      }
    }, interval);
  }
}

export default DashboardSocket;
