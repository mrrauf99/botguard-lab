import express from 'express';
import {
  getDashboardStats,
  getDetectionTrends,
  getRiskDistribution,
  getTopReasons,
  getHighRiskSessions,
  getRecentSessions,
  getSessionDetailedView,
  getClassificationOverTime,
  getDetectionMetricsTrends,
  getRiskHeatmap,
  getAttackTypeDistribution,
  getRealtimeActivity,
  getSessionOutcomes,
  getDetectionFunnel,
  getRecentSecurityEvents,
} from '../controllers/dashboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/trends', getDetectionTrends);
router.get('/risk-distribution', getRiskDistribution);
router.get('/top-reasons', getTopReasons);
router.get('/classification-over-time', getClassificationOverTime);
router.get('/detection-metrics', getDetectionMetricsTrends);
router.get('/risk-heatmap', getRiskHeatmap);
router.get('/attack-types', getAttackTypeDistribution);
router.get('/realtime-activity', getRealtimeActivity);
router.get('/session-outcomes', getSessionOutcomes);
router.get('/detection-funnel', getDetectionFunnel);
router.get('/security-events', getRecentSecurityEvents);
router.get('/recent-sessions', getRecentSessions);
router.get('/high-risk-sessions', getHighRiskSessions);
router.get('/sessions/:sessionId', getSessionDetailedView);

export default router;
