import Notification from '../models/Notification.js';
import { getIO } from './socketService.js';

class NotificationService {
  /**
   * Create and broadcast notification
   */
  async createNotification(data) {
    try {
      const notification = new Notification({
        userId: data.userId || null,
        type: data.type,
        severity: data.severity || 'info',
        title: data.title,
        message: data.message,
        data: data.data || {},
      });

      await notification.save();

      // Broadcast via Socket.io
      this.broadcastNotification(notification);

      console.warn(`[Notification] Created: ${notification._id} (${notification.type})`);
      return notification;
    } catch (error) {
      console.warn(`[Notification] Error creating notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Broadcast notification via Socket.io
   */
  broadcastNotification(notification) {
    try {
      const io = getIO();

      // Broadcast to dashboard
      io.of('/dashboard').to('dashboard-detections').emit('new-notification', notification);

      // Broadcast to user if authenticated
      if (notification.userId) {
        io.of('/dashboard').to(`user-${notification.userId}`).emit('user-notification', notification);
      }

      // Broadcast critical notifications to all
      if (notification.severity === 'critical') {
        io.of('/dashboard').emit('critical-alert', notification);
      }

      console.warn(`[Notification] Broadcast: ${notification._id}`);
    } catch (error) {
      console.warn(`[Notification] Error broadcasting notification: ${error.message}`);
    }
  }

  /**
   * Create bot detection notification
   */
  async notifyBotDetected(sessionId, classification, riskScore, reason) {
    return this.createNotification({
      type: 'bot-detected',
      severity: riskScore > 80 ? 'critical' : riskScore > 60 ? 'warning' : 'info',
      title: `${classification} Detected`,
      message: `Session classified as ${classification} with risk score ${riskScore}/100`,
      data: {
        sessionId,
        riskScore,
        classification,
        reason,
      },
    });
  }

  /**
   * Create high-risk session notification
   */
  async notifyHighRisk(sessionId, riskScore) {
    return this.createNotification({
      type: 'high-risk',
      severity: 'critical',
      title: 'High-Risk Session Alert',
      message: `Session exceeds high-risk threshold with score ${riskScore}/100`,
      data: {
        sessionId,
        riskScore,
      },
    });
  }

  /**
   * Create anomaly notification
   */
  async notifyAnomaly(sessionId, anomalyType, details) {
    return this.createNotification({
      type: 'anomaly',
      severity: 'warning',
      title: `Anomaly Detected: ${anomalyType}`,
      message: `Unusual behavior pattern detected in session`,
      data: {
        sessionId,
        reason: anomalyType,
        ...details,
      },
    });
  }

  /**
   * Create session-ended notification
   */
  async notifySessionEnded(sessionId, duration, eventCount) {
    return this.createNotification({
      type: 'session-ended',
      severity: 'info',
      title: 'Session Completed',
      message: `Session ended after ${(duration / 1000).toFixed(1)}s with ${eventCount} events`,
      data: {
        sessionId,
      },
    });
  }

  /**
   * Create system notification
   */
  async notifySystem(title, message) {
    return this.createNotification({
      type: 'system',
      severity: 'info',
      title,
      message,
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, limit = 20, skip = 0) {
    try {
      const notifications = await Notification.find({
        userId,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Notification.countDocuments({ userId });

      return { notifications, total };
    } catch (error) {
      console.warn(`[Notification] Error fetching notifications: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        {
          read: true,
          readAt: new Date(),
        },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.warn(`[Notification] Error marking notification as read: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, read: false },
        {
          read: true,
          readAt: new Date(),
        }
      );

      return result;
    } catch (error) {
      console.warn(`[Notification] Error marking all notifications as read: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        userId,
        read: false,
      });

      return count;
    } catch (error) {
      console.warn(`[Notification] Error getting unread count: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete old notifications (cleanup)
   */
  async deleteOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      console.warn(`[Notification] Deleted ${result.deletedCount} old notifications`);
      return result;
    } catch (error) {
      console.warn(`[Notification] Error deleting old notifications: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats() {
    try {
      const stats = await Notification.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            unread: {
              $sum: { $cond: ['$read', 0, 1] },
            },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      return stats;
    } catch (error) {
      console.warn(`[Notification] Error getting statistics: ${error.message}`);
      throw error;
    }
  }
}

export default NotificationService;
