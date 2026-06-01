import express from 'express';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats,
  createTestNotification,
} from '../controllers/notificationController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.post('/mark-read', authenticateToken, markAsRead);
router.post('/mark-all-read', authenticateToken, markAllAsRead);
router.delete('/all', authenticateToken, deleteAllNotifications);
router.delete('/:notificationId', authenticateToken, deleteNotification);

// Admin routes
router.get('/admin/stats', authenticateToken, requireAdmin, getNotificationStats);
router.post('/admin/test', authenticateToken, requireAdmin, createTestNotification);

export default router;
