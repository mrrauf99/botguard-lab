import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api, { getApiUrl } from '../services/api';
import { useAuth } from './useAuth';

export function useDashboard() {
  const { isAuthenticated, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const [statsRes, trendsRes, distRes, sessionsRes, riskRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/trends', { params: { days: 7 } }),
        api.get('/dashboard/risk-distribution'),
        api.get('/dashboard/recent-sessions', { params: { limit: 10 } }),
        api.get('/dashboard/high-risk-sessions', { params: { limit: 10, threshold: 60 } }),
      ]);

      setStats(statsRes.data);
      setTrends(trendsRes.data.trends || []);
      setDistribution(distRes.data.distribution || []);
      setSessions(sessionsRes.data.sessions || []);
      setHighRisk(riskRes.data.sessions || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
    });

    socket.on('detection-result', (data) => {
      if (data.result?.classification === 'BOT' || data.result?.riskScore > 60) {
        api
          .get('/dashboard/high-risk-sessions', { params: { limit: 10, threshold: 60 } })
          .then((res) => setHighRisk(res.data.sessions || []))
          .catch(() => {});
      }
    });

    const interval = setInterval(() => {
      if (socket.connected) loadDashboardData();
    }, 30000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token, loadDashboardData]);

  return {
    stats,
    trends,
    distribution,
    sessions,
    highRisk,
    loading,
    error,
    reload: loadDashboardData,
  };
}

export default useDashboard;
