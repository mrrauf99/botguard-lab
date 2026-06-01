import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getApiUrl } from '../services/api';
import {
  deleteNotificationById,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationService';
import { useAuth } from './useAuth';

const PAGE_SIZE = 20;

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const skipRef = useRef(0);
  const socketRef = useRef(null);

  const loadNotifications = useCallback(
    async (reset = true) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setLoading(true);
      setError(null);
      const skip = reset ? 0 : skipRef.current;

      try {
        const [listData, count] = await Promise.all([
          fetchNotifications(PAGE_SIZE, skip),
          fetchUnreadCount(),
        ]);

        const items = listData?.notifications ?? [];
        setNotifications((prev) => (reset ? items : [...prev, ...items]));
        setUnreadCount(count);
        skipRef.current = reset ? items.length : skipRef.current + items.length;
        setHasMore(items.length === PAGE_SIZE);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadNotifications(false);
  }, [hasMore, loading, loadNotifications]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return undefined;
    }

    loadNotifications(true);

    const socket = io(`${getApiUrl()}/dashboard`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe-detections');
    });

    const handleIncoming = (notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id);
        if (exists) return prev;
        return [notification, ...prev].slice(0, 100);
      });
      if (!notification.read) {
        setUnreadCount((c) => c + 1);
      }
    };

    socket.on('new-notification', handleIncoming);
    socket.on('user-notification', handleIncoming);
    socket.on('critical-alert', handleIncoming);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, loadNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    setActionLoadingId(notificationId);
    setError(null);

    const previous = notifications;
    const wasUnread = previous.find((n) => n._id === notificationId && !n.read);

    setNotifications((list) =>
      list.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    if (wasUnread) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    try {
      await markNotificationAsRead(notificationId);
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      setNotifications(previous);
      if (wasUnread) {
        setUnreadCount((c) => c + 1);
      }
      setError(err.response?.data?.error || err.message || 'Failed to mark as read');
    } finally {
      setActionLoadingId(null);
    }
  }, [notifications]);

  const removeNotification = useCallback(async (notificationId) => {
    setActionLoadingId(notificationId);
    setError(null);

    const previous = notifications;
    const removed = previous.find((n) => n._id === notificationId);

    setNotifications((list) => list.filter((n) => n._id !== notificationId));

    if (removed && !removed.read) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    try {
      await deleteNotificationById(notificationId);
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      setNotifications(previous);
      if (removed && !removed.read) {
        setUnreadCount((c) => c + 1);
      }
      setError(err.response?.data?.error || err.message || 'Failed to delete notification');
    } finally {
      setActionLoadingId(null);
    }
  }, [notifications]);

  const markAllRead = useCallback(async () => {
    setError(null);
    const previous = notifications;
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      setNotifications(previous);
      setError(err.response?.data?.error || err.message || 'Failed to mark all as read');
      await loadNotifications(true);
    }
  }, [notifications, loadNotifications]);

  const clearAllLocal = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    actionLoadingId,
    hasMore,
    loadNotifications,
    loadMore,
    markAsRead,
    removeNotification,
    markAllRead,
    clearAllLocal,
  };
}

export default useNotifications;
