import express from 'express';
import {
  startBotTraffic,
  startHumanTraffic,
  startCombinedTraffic,
  stopBotTraffic,
  stopHumanTraffic,
  stopAllTraffic,
  getTrafficStatus,
  resetStats,
  generateSingleBot,
  generateSingleHuman,
} from '../controllers/simulatorController.js';

const router = express.Router();

// Traffic control endpoints
router.post('/traffic/bot/start', startBotTraffic);
router.post('/traffic/human/start', startHumanTraffic);
router.post('/traffic/combined/start', startCombinedTraffic);
router.post('/traffic/bot/stop', stopBotTraffic);
router.post('/traffic/human/stop', stopHumanTraffic);
router.post('/traffic/stop-all', stopAllTraffic);

// Status endpoints
router.get('/traffic/status', getTrafficStatus);
router.post('/stats/reset', resetStats);

// Single session generators
router.post('/generate/bot', generateSingleBot);
router.post('/generate/human', generateSingleHuman);

export default router;
