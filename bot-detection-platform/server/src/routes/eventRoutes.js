import express from 'express';
import {
  createSession,
  logEvent,
  logEventsBatch,
  endSession,
  getSessionDetails,
  getUserSessions,
  getAllSessions,
} from '../controllers/eventController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { eventRateLimiter } from '../middleware/rateLimit.js';
import { validateSessionAccess } from '../middleware/sessionAccess.js';

const router = express.Router();

router.post('/sessions', eventRateLimiter, createSession);
router.post('/events', eventRateLimiter, logEvent);
router.post('/batch', eventRateLimiter, logEventsBatch);
router.post('/sessions/end', eventRateLimiter, validateSessionAccess, endSession);

router.get('/sessions/:sessionId', authenticateToken, requireAdmin, getSessionDetails);
router.get('/my-sessions', authenticateToken, getUserSessions);

// Admin only routes
router.get('/admin/sessions', authenticateToken, requireAdmin, getAllSessions);

export default router;
