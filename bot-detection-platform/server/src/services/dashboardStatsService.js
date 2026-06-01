import Session from '../models/Session.js';
import { emitStatsUpdate } from './socketService.js';

export const buildDashboardStats = async () => {
  const humanCount = await Session.countDocuments({ classification: 'HUMAN' });
  const suspiciousCount = await Session.countDocuments({ classification: 'SUSPICIOUS' });
  const botCount = await Session.countDocuments({ classification: 'BOT' });
  const totalCount = humanCount + suspiciousCount + botCount;
  const activeCount = await Session.countDocuments({ status: 'active' });

  const avgRiskResult = await Session.aggregate([
    { $group: { _id: null, avgScore: { $avg: '$riskScore' } } },
  ]);
  const avgRiskScore = avgRiskResult.length > 0 ? avgRiskResult[0].avgScore : 0;

  return {
    overview: {
      totalSessions: totalCount,
      activeSessions: activeCount,
      averageRiskScore: Number(avgRiskScore.toFixed(2)),
    },
    classification: {
      human: humanCount,
      suspicious: suspiciousCount,
      bot: botCount,
    },
    timestamp: new Date(),
  };
};

export const pushDashboardStatsUpdate = async () => {
  try {
    const stats = await buildDashboardStats();
    emitStatsUpdate(stats);
    return stats;
  } catch (error) {
    console.warn(`[DashboardStats] Failed to push update: ${error.message}`);
    return null;
  }
};
