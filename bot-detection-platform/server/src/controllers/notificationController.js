import Notification from '../models/Notification.js';
import NotificationService from '../services/notificationService.js';

const notificationService = new NotificationService();

/**
 * Get user notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { notifications, total } = await notificationService.getUserNotifications(
      userId,
      parseInt(limit),
      parseInt(skip)
    );

    res.json({
      notifications,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      message: 'Notifications retrieved',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get notifications: ${error.message}`);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const count = await notificationService.getUnreadCount(userId);

    res.json({
      unreadCount: count,
      message: 'Unread count retrieved',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get unread count: ${error.message}`);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!notificationId) {
      return res.status(400).json({ error: 'notificationId is required' });
    }

    // Verify notification belongs to user
    const notification = await Notification.findById(notificationId);
    if (!notification || (notification.userId && notification.userId.toString() !== userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await notificationService.markAsRead(notificationId);

    res.json({
      notification: updated,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.warn(`[Error] Failed to mark notification as read: ${error.message}`);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await notificationService.markAllAsRead(userId);

    res.json({
      modifiedCount: result.modifiedCount,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.warn(`[Error] Failed to mark all as read: ${error.message}`);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify notification belongs to user
    const notification = await Notification.findById(notificationId);
    if (!notification || (notification.userId && notification.userId.toString() !== userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({
      message: 'Notification deleted',
    });
  } catch (error) {
    console.warn(`[Error] Failed to delete notification: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Get notification statistics (admin only)
 */
export const getNotificationStats = async (req, res) => {
  try {
    const stats = await notificationService.getNotificationStats();

    res.json({
      stats,
      message: 'Notification statistics retrieved',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get notification stats: ${error.message}`);
    res.status(500).json({ error: 'Failed to get notification stats' });
  }
};

/**
 * Create test notification (admin only)
 */
export const createTestNotification = async (req, res) => {
  try {
    const { type = 'system', severity = 'info', title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const notification = await notificationService.createNotification({
      type,
      severity,
      title,
      message,
    });

    res.status(201).json({
      notification,
      message: 'Test notification created',
    });
  } catch (error) {
    console.warn(`[Error] Failed to create test notification: ${error.message}`);
    res.status(500).json({ error: 'Failed to create test notification' });
  }
};
