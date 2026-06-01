import express from 'express';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
  createTestNotification,
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.post('/mark-read', authenticateToken, markAsRead);
router.post('/mark-all-read', authenticateToken, markAllAsRead);
router.delete('/:notificationId', authenticateToken, deleteNotification);

// Admin routes
router.get('/admin/stats', getNotificationStats);
router.post('/admin/test', createTestNotification);

export default router;
