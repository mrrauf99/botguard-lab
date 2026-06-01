import express from 'express';
import {
  getDashboardStats,
  getDetectionTrends,
  getRiskDistribution,
  getTopReasons,
  getHighRiskSessions,
  getSessionDetailedView
} from '../controllers/dashboardController.js';

const router = express.Router();

// Public routes for dashboard data
router.get('/stats', getDashboardStats);
router.get('/trends', getDetectionTrends);
router.get('/risk-distribution', getRiskDistribution);
router.get('/top-reasons', getTopReasons);
router.get('/high-risk-sessions', getHighRiskSessions);
router.get('/sessions/:sessionId', getSessionDetailedView);

export default router;
