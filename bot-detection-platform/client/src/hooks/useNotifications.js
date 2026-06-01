import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getApiUrl } from '../services/api';
import {
  deleteAllNotifications,
  deleteNotificationById,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationService';
import { playNotificationSound } from '../utils/notificationSound';
import { useAuth } from './useAuth';

const PAGE_SIZE = 20;

const getBadgeLabel = (unreadCount) => {
  const count = Number(unreadCount) || 0;
  if (count <= 0) return null;
  if (count > 99) return '99+';
  return String(count);
};

const countUnreadInList = (items) => items.filter((n) => !n.read).length;

/** Badge matches unread items in the loaded list (not global DB count). */
const getEffectiveUnreadCount = (notifications, { loading = false } = {}) => {
  const list = notifications ?? [];
  if (!loading && list.length === 0) return 0;
  return countUnreadInList(list);
};

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const skipRef = useRef(0);
  const socketRef = useRef(null);
  const seenNotificationIdsRef = useRef(new Set());

  const loadNotifications = useCallback(
    async (reset = true) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setTotal(0);
        seenNotificationIdsRef.current.clear();
        return;
      }

      setLoading(true);
      setError(null);
      const skip = reset ? 0 : skipRef.current;

      try {
        const listData = await fetchNotifications(PAGE_SIZE, skip);
        const items = listData?.notifications ?? [];
        const totalCount = listData?.total ?? items.length;

        items.forEach((n) => seenNotificationIdsRef.current.add(String(n._id)));

        if (reset) {
          setNotifications(items);
          skipRef.current = items.length;
        } else {
          setNotifications((prev) => [...prev, ...items]);
          skipRef.current += items.length;
        }

        setTotal(totalCount);
        setHasMore(skipRef.current < totalCount);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load notifications');
        setNotifications([]);
        setTotal(0);
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

  const effectiveUnread = useMemo(
    () => getEffectiveUnreadCount(notifications, { loading }),
    [notifications, loading]
  );

  const badgeLabel = useMemo(() => getBadgeLabel(effectiveUnread), [effectiveUnread]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setTotal(0);
      seenNotificationIdsRef.current.clear();
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

    const handleIncoming = (notification, { critical = false } = {}) => {
      const id = String(notification._id);
      if (seenNotificationIdsRef.current.has(id)) {
        return;
      }
      seenNotificationIdsRef.current.add(id);

      setNotifications((prev) => {
        const next = [notification, ...prev].slice(0, 100);
        return next;
      });

      if (!notification.read) {
        playNotificationSound(critical);
      }
    };

    socket.on('new-notification', (n) => handleIncoming(n));
    socket.on('user-notification', (n) => handleIncoming(n));
    socket.on('critical-alert', (n) => handleIncoming(n, { critical: true }));

    const seenIdsRef = seenNotificationIdsRef;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      seenIdsRef.current.clear();
    };
  }, [isAuthenticated, loadNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    setActionLoadingId(notificationId);
    setError(null);

    const previous = notifications;

    setNotifications((list) => list.map((n) => (n._id === notificationId ? { ...n, read: true } : n)));

    try {
      await markNotificationAsRead(notificationId);
    } catch (err) {
      setNotifications(previous);
      setError(err.response?.data?.error || err.message || 'Failed to mark as read');
    } finally {
      setActionLoadingId(null);
    }
  }, [notifications]);

  const removeNotification = useCallback(
    async (notificationId) => {
      setActionLoadingId(notificationId);
      setError(null);

      const previous = notifications;
      const previousTotal = total;

      setNotifications((list) => list.filter((n) => n._id !== notificationId));
      seenNotificationIdsRef.current.delete(String(notificationId));
      setTotal((t) => Math.max(0, t - 1));

      try {
        await deleteNotificationById(notificationId);
      } catch (err) {
        setNotifications(previous);
        setTotal(previousTotal);
        setError(err.response?.data?.error || err.message || 'Failed to delete notification');
      } finally {
        setActionLoadingId(null);
      }
    },
    [notifications, total]
  );

  const markAllRead = useCallback(async () => {
    setError(null);
    const previous = notifications;

    setNotifications((list) => list.map((n) => ({ ...n, read: true })));

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      setNotifications(previous);
      setError(err.response?.data?.error || err.message || 'Failed to mark all as read');
      await loadNotifications(true);
    }
  }, [notifications, loadNotifications]);

  const deleteAll = useCallback(async () => {
    setError(null);

    try {
      await deleteAllNotifications();
      seenNotificationIdsRef.current.clear();
      setNotifications([]);
      setTotal(0);
      setHasMore(false);
      skipRef.current = 0;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete notifications');
      await loadNotifications(true);
    }
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount: effectiveUnread,
    total,
    loading,
    error,
    actionLoadingId,
    hasMore,
    loadNotifications,
    loadMore,
    markAsRead,
    removeNotification,
    markAllRead,
    deleteAll,
    badgeLabel,
  };
}

export default useNotifications;
