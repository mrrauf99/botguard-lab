import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api, { getApiUrl } from '../services/api';
import { useAuth } from './useAuth';

const CLASSIFICATION_DAYS = { hour: 2, day: 7, week: 28 };

function mapSecurityEventFromSocket(notification) {
  const data = notification.data || {};
  const attackLabel = data.attackType;
  const classification = data.classification;
  let eventType = notification.title || 'Security Event';

  if (attackLabel && classification === 'BOT') {
    eventType = `${attackLabel} Blocked`;
  } else if (attackLabel && notification.type === 'bot-detected') {
    eventType = `${attackLabel} Detected`;
  } else if (attackLabel) {
    eventType = `${attackLabel} — High Risk`;
  } else if (classification === 'BOT') {
    eventType = 'Session Classified BOT';
  }

  return {
    id: String(notification._id),
    time: notification.createdAt || new Date().toISOString(),
    eventType,
    severity: notification.severity || 'info',
    sessionId: data.sessionId ? String(data.sessionId) : null,
    riskScore: data.riskScore ?? null,
    classification: classification || null,
  };
}

export function useDashboard() {
  const { isAuthenticated, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [classificationSeries, setClassificationSeries] = useState([]);
  const [classificationGranularity, setClassificationGranularity] = useState('day');
  const [riskHeatmap, setRiskHeatmap] = useState({ buckets: [], total: 0 });
  const [detectionFunnel, setDetectionFunnel] = useState({ stages: [] });
  const [topReasons, setTopReasons] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const granularityRef = useRef(classificationGranularity);

  useEffect(() => {
    granularityRef.current = classificationGranularity;
  }, [classificationGranularity]);

  const loadAnalytics = useCallback(async (granularity = granularityRef.current) => {
    const days = CLASSIFICATION_DAYS[granularity] || 7;

    const [classificationRes, heatmapRes, funnelRes, reasonsRes, eventsRes] =
      await Promise.all([
        api.get('/dashboard/classification-over-time', { params: { days, granularity } }),
        api.get('/dashboard/risk-heatmap'),
        api.get('/dashboard/detection-funnel'),
        api.get('/dashboard/top-reasons', { params: { limit: 8 } }),
        api.get('/dashboard/security-events', { params: { limit: 20 } }),
      ]);

    setClassificationSeries(classificationRes.data.series || []);
    setRiskHeatmap({
      buckets: heatmapRes.data.buckets || [],
      total: heatmapRes.data.total || 0,
    });
    setDetectionFunnel({ stages: funnelRes.data.stages || [] });
    setSecurityEvents(eventsRes.data.events || []);

    const reasons = reasonsRes.data.reasons || [];
    if (reasons.length) {
      const max = Math.max(...reasons.map((r) => r.count), 1);
      setTopReasons(
        reasons.map((r) => ({
          ...r,
          barWidth: Math.round((r.count / max) * 100),
        }))
      );
    } else {
      setTopReasons([]);
    }
  }, []);

  const loadSecurityEvents = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/security-events', { params: { limit: 20 } });
      setSecurityEvents(res.data.events || []);
    } catch {
      /* keep last feed */
    }
  }, []);

  const loadDashboardData = useCallback(
    async (options = {}) => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      const { analyticsOnly = false } = options;
      if (!analyticsOnly) {
        setError(null);
      }

      try {
        if (!analyticsOnly) {
          const [statsRes, sessionsRes, riskRes] = await Promise.all([
            api.get('/dashboard/stats'),
            api.get('/dashboard/recent-sessions', { params: { limit: 10 } }),
            api.get('/dashboard/high-risk-sessions', { params: { limit: 10, threshold: 60 } }),
          ]);

          setStats(statsRes.data);
          setSessions(sessionsRes.data.sessions || []);
          setHighRisk(riskRes.data.sessions || []);
        }

        await loadAnalytics(granularityRef.current);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loadAnalytics]
  );

  const setGranularity = useCallback(async (granularity) => {
    setClassificationGranularity(granularity);
    granularityRef.current = granularity;
    try {
      const days = CLASSIFICATION_DAYS[granularity] || 7;
      const res = await api.get('/dashboard/classification-over-time', {
        params: { days, granularity },
      });
      setClassificationSeries(res.data.series || []);
    } catch {
      /* ignore */
    }
  }, []);

  const prependSecurityEvent = useCallback((notification) => {
    if (!['bot-detected', 'high-risk', 'anomaly'].includes(notification.type)) {
      return;
    }
    const mapped = mapSecurityEventFromSocket(notification);
    setSecurityEvents((prev) => {
      const filtered = prev.filter((e) => e.id !== mapped.id);
      return [mapped, ...filtered].slice(0, 20);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return undefined;
    }

    loadDashboardData();

    const socket = io(`${getApiUrl()}/dashboard`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe-stats');
      socket.emit('subscribe-sessions');
      socket.emit('subscribe-detections');
    });

    socket.on('stats-update', (newStats) => {
      setStats(newStats);
      loadAnalytics(granularityRef.current);
    });

    socket.on('detection-result', () => {
      loadDashboardData({ analyticsOnly: true });
      api
        .get('/dashboard/high-risk-sessions', { params: { limit: 10, threshold: 60 } })
        .then((res) => setHighRisk(res.data.sessions || []))
        .catch(() => {});
    });

    socket.on('new-notification', prependSecurityEvent);
    socket.on('critical-alert', prependSecurityEvent);

    const fullInterval = setInterval(() => {
      if (socket.connected) loadDashboardData({ analyticsOnly: true });
    }, 30000);

    const eventsInterval = setInterval(loadSecurityEvents, 15000);

    return () => {
      clearInterval(fullInterval);
      clearInterval(eventsInterval);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    isAuthenticated,
    token,
    loadDashboardData,
    loadAnalytics,
    loadSecurityEvents,
    prependSecurityEvent,
  ]);

  return {
    stats,
    sessions,
    highRisk,
    classificationSeries,
    classificationGranularity,
    setClassificationGranularity: setGranularity,
    riskHeatmap,
    detectionFunnel,
    topReasons,
    securityEvents,
    loading,
    error,
    reload: loadDashboardData,
  };
}

export default useDashboard;
