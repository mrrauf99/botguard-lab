import api from './api';

export const fetchNotifications = async (limit = 20, skip = 0) => {
  const { data } = await api.get('/notifications', { params: { limit, skip } });
  return data;
};

export const fetchUnreadCount = async () => {
  const { data } = await api.get('/notifications/unread-count');
  return data.unreadCount ?? 0;
};

export const markNotificationAsRead = async (notificationId) => {
  const { data } = await api.post('/notifications/mark-read', { notificationId });
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await api.post('/notifications/mark-all-read');
  return data;
};

export const deleteNotificationById = async (notificationId) => {
  const { data } = await api.delete(`/notifications/${notificationId}`);
  return data;
};

export const getNotificationSessionId = (notification) => {
  if (!notification) return null;
  const fromData = notification.data?.sessionId;
  if (fromData) return String(fromData);
  if (notification.sessionId) return String(notification.sessionId);
  return null;
};
