import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { formatAttackLabel, inferAttackTypeSlug } from '../utils/attackTypeResolver.js';
import { getIO } from './socketService.js';

const SECURITY_TYPES = ['bot-detected', 'high-risk'];
const DEDUP_WINDOW_MS = 5 * 60 * 1000;
const HIGH_RISK_THRESHOLD = 60;

class NotificationService {
  /**
   * Single entry point for security incident notifications (deduplicated).
   */
  async createSecurityNotification({
    sessionId,
    classification,
    riskScore,
    reasons = [],
    attackType = null,
    userId = null,
  }) {
    const title = this.resolveSecurityTitle(classification, riskScore);
    if (!title) {
      return null;
    }

    const attackTypeSlug =
      inferAttackTypeSlug({
        attackType,
        classification,
        detectionReasons: reasons,
      }) || attackType || null;
    const attackTypeLabel = attackTypeSlug
      ? formatAttackLabel(attackTypeSlug)
      : this.resolveAttackType(attackType, reasons);
    const triggers = this.buildTriggers(classification, riskScore, reasons);
    const primaryReason =
      reasons[0] ||
      (classification === 'BOT' ? 'Automated behavior detected' : 'Elevated risk score');

    const type = classification === 'BOT' ? 'bot-detected' : 'high-risk';
    const severity =
      classification === 'BOT' ? (riskScore > 80 ? 'critical' : 'warning') : 'critical';

    const data = {
      sessionId,
      riskScore,
      classification,
      reason: primaryReason,
      attackType: attackTypeLabel,
      attackTypeSlug,
      triggers,
    };

    const recent = await Notification.findOne({
      'data.sessionId': sessionId,
      type: { $in: SECURITY_TYPES },
      createdAt: { $gte: new Date(Date.now() - DEDUP_WINDOW_MS) },
    }).sort({ createdAt: -1 });

    if (recent) {
      const existingTriggers = recent.data?.triggers || [];
      const mergedTriggers = [...new Set([...existingTriggers, ...triggers])];
      const mergedData = {
        ...(recent.data?.toObject?.() ?? recent.data ?? {}),
        ...data,
        triggers: mergedTriggers,
        attackType: attackTypeLabel || recent.data?.attackType,
      };

      recent.title = title;
      recent.type = type;
      recent.severity = severity;
      recent.data = mergedData;
      recent.message = this.buildSecurityMessage(mergedData);
      recent.markModified('data');

      await recent.save();
      console.warn(`[Notification] Merged security incident: ${recent._id} (session ${sessionId})`);
      return recent;
    }

    return this.createNotification({
      userId,
      type,
      severity,
      title,
      message: this.buildSecurityMessage(data),
      data,
    });
  }

  resolveSecurityTitle(classification, riskScore) {
    if (classification === 'BOT') {
      return 'BOT Detected';
    }
    if (riskScore > HIGH_RISK_THRESHOLD || classification === 'SUSPICIOUS') {
      return 'High Risk Session';
    }
    return null;
  }

  resolveAttackType(explicitAttackType, reasons = []) {
    if (explicitAttackType) {
      return formatAttackLabel(explicitAttackType);
    }

    const joined = reasons.join(' ').toLowerCase();
    if (joined.includes('login')) {
      return 'Login Attack';
    }
    if (joined.includes('form') || joined.includes('spam') || joined.includes('submission')) {
      return 'Spam Bot';
    }
    if (joined.includes('navigation')) {
      return 'Scraper Bot';
    }
    return null;
  }

  buildTriggers(classification, riskScore, reasons = []) {
    const triggers = [];
    if (classification === 'BOT') {
      triggers.push('BOT Classification');
    }
    if (riskScore > HIGH_RISK_THRESHOLD) {
      triggers.push('High Risk Threshold Exceeded');
    }
    reasons.forEach((r) => triggers.push(r));
    return [...new Set(triggers)];
  }

  buildSecurityMessage(data) {
    const sessionShort = data.sessionId ? String(data.sessionId).slice(0, 8) : 'unknown';
    const parts = [`Session: ${sessionShort}…`, `Risk: ${data.riskScore ?? 0}/100`];
    if (data.attackType) parts.push(data.attackType);
    return parts.join(' · ');
  }

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
      this.broadcastNotification(notification);

      console.warn(`[Notification] Created: ${notification._id} (${notification.type})`);
      return notification;
    } catch (error) {
      console.warn(`[Notification] Error creating notification: ${error.message}`);
      throw error;
    }
  }

  broadcastNotification(notification) {
    try {
      const io = getIO();
      const payload = notification.toObject ? notification.toObject() : notification;

      io.of('/dashboard').to('dashboard-detections').emit('new-notification', payload);

      if (notification.userId) {
        io.of('/dashboard')
          .to(`user-${notification.userId}`)
          .emit('user-notification', payload);
      }

      if (notification.severity === 'critical') {
        io.of('/dashboard').emit('critical-alert', payload);
      }

      console.warn(`[Notification] Broadcast: ${notification._id}`);
    } catch (error) {
      console.warn(`[Notification] Error broadcasting notification: ${error.message}`);
    }
  }

  /** @deprecated Use createSecurityNotification */
  async notifyBotDetected(sessionId, classification, riskScore, reason, options = {}) {
    return this.createSecurityNotification({
      sessionId,
      classification,
      riskScore,
      reasons: reason ? [reason] : [],
      attackType: options.attackType,
      userId: options.userId,
    });
  }

  /** @deprecated Use createSecurityNotification */
  async notifyHighRisk(sessionId, riskScore, options = {}) {
    return this.createSecurityNotification({
      sessionId,
      classification: options.classification || 'SUSPICIOUS',
      riskScore,
      reasons: options.reasons || [],
      attackType: options.attackType,
      userId: options.userId,
    });
  }

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

  async notifySystem(title, message) {
    return this.createNotification({
      type: 'system',
      severity: 'info',
      title,
      message,
    });
  }

  userNotificationFilter(userId) {
    if (!userId) {
      return { userId: null };
    }
    const uid = new mongoose.Types.ObjectId(userId);
    return {
      $or: [{ userId: uid }, { userId: null }],
    };
  }

  async getUserNotifications(userId, limit = 20, skip = 0) {
    try {
      const filter = this.userNotificationFilter(userId);
      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Notification.countDocuments(filter);
      const unreadCount = await Notification.countDocuments({
        ...filter,
        read: false,
      });

      return { notifications, total, unreadCount };
    } catch (error) {
      console.warn(`[Notification] Error fetching notifications: ${error.message}`);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { read: true, readAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.warn(`[Notification] Error marking notification as read: ${error.message}`);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      return await Notification.updateMany(
        { ...this.userNotificationFilter(userId), read: false },
        { read: true, readAt: new Date() }
      );
    } catch (error) {
      console.warn(`[Notification] Error marking all notifications as read: ${error.message}`);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        ...this.userNotificationFilter(userId),
        read: false,
      });
    } catch (error) {
      console.warn(`[Notification] Error getting unread count: ${error.message}`);
      throw error;
    }
  }

  async deleteAllForUser(userId) {
    try {
      const result = await Notification.deleteMany(this.userNotificationFilter(userId));
      console.warn(`[Notification] Deleted ${result.deletedCount} notifications for user scope`);
      return result;
    } catch (error) {
      console.warn(`[Notification] Error deleting all notifications: ${error.message}`);
      throw error;
    }
  }

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

  async getNotificationStats() {
    try {
      return await Notification.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            unread: { $sum: { $cond: ['$read', 0, 1] } },
          },
        },
        { $sort: { count: -1 } },
      ]);
    } catch (error) {
      console.warn(`[Notification] Error getting statistics: ${error.message}`);
      throw error;
    }
  }
}

export default NotificationService;
