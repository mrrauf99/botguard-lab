import express from 'express';
import {
  analyzeSession,
  analyzeSessionsBatch,
  getDetectionStats,
  getDetectionRules,
  getSessionsByClassification,
} from '../controllers/detectionController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateSessionAccess } from '../middleware/sessionAccess.js';

const router = express.Router();

router.post('/analyze', validateSessionAccess, analyzeSession);
router.post('/analyze/batch', authenticateToken, requireAdmin, analyzeSessionsBatch);
router.get('/rules', getDetectionRules);

// Protected routes
router.get('/stats', authenticateToken, getDetectionStats);
router.get('/sessions/:classification', authenticateToken, getSessionsByClassification);

// Admin only routes
router.get('/admin/stats', authenticateToken, requireAdmin, getDetectionStats);

export default router;
