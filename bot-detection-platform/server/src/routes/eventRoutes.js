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

const router = express.Router();

// Public routes (no authentication required for session creation/event logging)
router.post('/sessions', createSession);
router.post('/events', logEvent);
router.post('/events/batch', logEventsBatch);
router.post('/sessions/end', endSession);

// Protected routes (authentication required)
router.get('/sessions/:sessionId', getSessionDetails);
router.get('/my-sessions', authenticateToken, getUserSessions);

// Admin only routes
router.get('/admin/sessions', authenticateToken, requireAdmin, getAllSessions);

export default router;
