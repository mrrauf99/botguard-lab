import express from 'express';
import {
  analyzeSession,
  analyzeSessionsBatch,
  getDetectionStats,
  getDetectionRules,
  getSessionsByClassification,
} from '../controllers/detectionController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes for analysis
router.post('/analyze', analyzeSession);
router.post('/analyze/batch', analyzeSessionsBatch);
router.get('/rules', getDetectionRules);

// Protected routes
router.get('/stats', authenticateToken, getDetectionStats);
router.get('/sessions/:classification', authenticateToken, getSessionsByClassification);

// Admin only routes
router.get('/admin/stats', authenticateToken, requireAdmin, getDetectionStats);

export default router;
