import Session from '../models/Session.js';
import Event from '../models/Event.js';

/**
 * Get dashboard overview statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const filter = {};
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }

    // Count sessions by classification
    const humanCount = await Session.countDocuments({
      ...filter,
      classification: 'HUMAN'
    });

    const suspiciousCount = await Session.countDocuments({
      ...filter,
      classification: 'SUSPICIOUS'
    });

    const botCount = await Session.countDocuments({
      ...filter,
      classification: 'BOT'
    });

    const totalCount = humanCount + suspiciousCount + botCount;

    // Count active sessions
    const activeCount = await Session.countDocuments({
      ...filter,
      status: 'active'
    });

    // Get average risk score
    const avgRiskResult = await Session.aggregate([
      { $match: filter },
      { $group: { _id: null, avgScore: { $avg: '$riskScore' } } }
    ]);

    const avgRiskScore = avgRiskResult.length > 0 ? avgRiskResult[0].avgScore : 0;

    // Get stats by event type
    const eventStats = await Event.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: {
        totalSessions: totalCount,
        activeSessions: activeCount,
        averageRiskScore: avgRiskScore.toFixed(2)
      },
      classification: {
        human: humanCount,
        suspicious: suspiciousCount,
        bot: botCount
      },
      eventStats,
      timestamp: new Date(),
      message: 'Dashboard stats retrieved'
    });
  } catch (error) {
    console.warn(`[Error] Failed to get dashboard stats: ${error.message}`);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

/**
 * Get detection trends
 */
export const getDetectionTrends = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily counts by classification
    const trends = await Session.aggregate([
      {
        $match: {
          startTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
            classification: '$classification'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Format trends data
    const formattedTrends = [];
    const dates = new Set();

    trends.forEach(trend => {
      dates.add(trend._id.date);
    });

    Array.from(dates).forEach(date => {
      const dailyData = { date };
      trends.forEach(trend => {
        if (trend._id.date === date) {
          dailyData[trend._id.classification.toLowerCase()] = trend.count;
        }
      });
      formattedTrends.push(dailyData);
    });

    res.json({
      trends: formattedTrends,
      days,
      timestamp: new Date(),
      message: 'Detection trends retrieved'
    });
  } catch (error) {
    console.warn(`[Error] Failed to get detection trends: ${error.message}`);
    res.status(500).json({ error: 'Failed to get detection trends' });
  }
};

/**
 * Get risk score distribution
 */
export const getRiskDistribution = async (req, res) => {
  try {
    // Bucket sessions by risk score ranges
    const distribution = await Session.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$riskScore', 29] }, then: '0-29 (Human)' },
                { case: { $lte: ['$riskScore', 59] }, then: '30-59 (Suspicious)' },
                { case: { $lte: ['$riskScore', 100] }, then: '60-100 (Bot)' }
              ],
              default: 'Unknown'
            }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$riskScore' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      distribution,
      timestamp: new Date(),
      message: 'Risk distribution retrieved'
    });
  } catch (error) {
    console.warn(`[Error] Failed to get risk distribution: ${error.message}`);
    res.status(500).json({ error: 'Failed to get risk distribution' });
  }
};

/**
 * Get top detection reasons
 */
export const getTopReasons = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const reasons = await Session.aggregate([
      {
        $unwind: '$detectionReasons'
      },
      {
        $group: {
          _id: '$detectionReasons',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      topReasons: reasons,
      limit: parseInt(limit),
      timestamp: new Date(),
      message: 'Top detection reasons retrieved'
    });
  } catch (error) {
    console.warn(`[Error] Failed to get top reasons: ${error.message}`);
    res.status(500).json({ error: 'Failed to get top reasons' });
  }
};

/**
 * Get high-risk sessions
 */
export const getHighRiskSessions = async (req, res) => {
  try {
    const { limit = 20, threshold = 60 } = req.query;

    const sessions = await Session.find({
      riskScore: { $gte: parseInt(threshold) }
    })
      .sort({ riskScore: -1 })
      .limit(parseInt(limit))
      .select('_id sessionToken classification riskScore startTime duration eventCount');

    res.json({
      sessions,
      limit: parseInt(limit),
      threshold: parseInt(threshold),
      timestamp: new Date(),
      message: 'High-risk sessions retrieved'
    });
  } catch (error) {
    console.warn(`[Error] Failed to get high-risk sessions: ${error.message}`);
    res.status(500).json({ error: 'Failed to get high-risk sessions' });
  }
};

/**
 * Get session details with events
 */
export const getSessionDetailedView = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const events = await Event.find({ sessionId }).sort({ timestamp: 1 });

    // Calculate event timeline
    const timeline = events.map(event => ({
      eventType: event.eventType,
      timestamp: event.timestamp,
      x: event.x,
      y: event.y
    }));

    res.json({
      session,
      events: timeline,
      eventCount: events.length,
      message: 'Session detailed view retrieved'
    });
  } catch (error) {
    console.warn(`[Error] Failed to get session detailed view: ${error.message}`);
    res.status(500).json({ error: 'Failed to get session detailed view' });
  }
};
