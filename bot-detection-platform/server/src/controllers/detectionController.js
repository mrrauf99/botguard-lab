import Session from '../models/Session.js';
import Event from '../models/Event.js';
import DetectionService from '../services/detectionService.js';
import NotificationService from '../services/notificationService.js';
import { emitDetectionResult } from '../services/socketService.js';

const detectionService = new DetectionService();
const notificationService = new NotificationService();

/**
 * Analyze single session
 */
export const analyzeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const events = await Event.find({ sessionId }).sort({ timestamp: 1 });

    const analysis = detectionService.analyzeSession(session, events);

    // Update session with analysis results
    session.riskScore = analysis.riskScore;
    session.classification = analysis.classification;
    session.detectionReasons = analysis.reasons;

    // Update flags based on detection
    session.flags.hasFastNavigation = analysis.reasons.some((r) => r.includes('navigation'));
    session.flags.hasNoMouseMovement = analysis.reasons.some((r) => r.includes('mouse movement'));
    session.flags.hasNoScroll = analysis.reasons.some((r) => r.includes('scroll'));
    session.flags.hasUnusualClickPattern = analysis.reasons.some((r) => r.includes('click'));
    session.flags.hasHighRequestRate = analysis.reasons.some((r) => r.includes('rate'));

    await session.save();

    console.warn(
      `[Detection] Session analyzed: ${sessionId}, Score: ${analysis.riskScore}, Class: ${analysis.classification}`
    );

    // Emit real-time update
    emitDetectionResult(sessionId, analysis);

    // Create notification if bot or high-risk
    if (analysis.classification === 'BOT') {
      await notificationService.notifyBotDetected(
        sessionId,
        analysis.classification,
        analysis.riskScore,
        analysis.reasons[0] || 'Bot behavior detected'
      );
    }

    if (analysis.riskScore > 60) {
      await notificationService.notifyHighRisk(sessionId, analysis.riskScore);
    }

    res.json({
      sessionId: session._id,
      riskScore: analysis.riskScore,
      classification: analysis.classification,
      confidence: analysis.confidence,
      reasons: analysis.reasons,
      message: 'Session analysis completed',
    });
  } catch (error) {
    console.warn(`[Error] Failed to analyze session: ${error.message}`);
    res.status(500).json({ error: 'Failed to analyze session' });
  }
};

/**
 * Analyze multiple sessions (batch)
 */
export const analyzeSessionsBatch = async (req, res) => {
  try {
    const { sessionIds } = req.body;

    if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
      return res.status(400).json({ error: 'sessionIds array is required' });
    }

    const sessions = await Session.find({ _id: { $in: sessionIds } });
    const events = await Event.find({ sessionId: { $in: sessionIds } });

    const results = [];

    for (const session of sessions) {
      const sessionEvents = events.filter(
        (e) => e.sessionId?.toString() === session._id?.toString()
      );

      const analysis = detectionService.analyzeSession(session, sessionEvents);

      // Update session
      session.riskScore = analysis.riskScore;
      session.classification = analysis.classification;
      session.detectionReasons = analysis.reasons;
      session.flags.hasFastNavigation = analysis.reasons.some((r) => r.includes('navigation'));
      session.flags.hasNoMouseMovement = analysis.reasons.some((r) => r.includes('mouse movement'));
      session.flags.hasNoScroll = analysis.reasons.some((r) => r.includes('scroll'));
      session.flags.hasUnusualClickPattern = analysis.reasons.some((r) => r.includes('click'));
      session.flags.hasHighRequestRate = analysis.reasons.some((r) => r.includes('rate'));

      await session.save();

      results.push({
        sessionId: session._id,
        riskScore: analysis.riskScore,
        classification: analysis.classification,
        confidence: analysis.confidence,
        reasons: analysis.reasons,
      });
    }

    console.warn(`[Detection] Batch analyzed ${results.length} sessions`);

    res.json({
      analyzedCount: results.length,
      results,
      message: 'Batch analysis completed',
    });
  } catch (error) {
    console.warn(`[Error] Failed to batch analyze sessions: ${error.message}`);
    res.status(500).json({ error: 'Failed to batch analyze sessions' });
  }
};

/**
 * Get detection statistics
 */
export const getDetectionStats = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;

    // Get counts by classification
    const humanCount = await Session.countDocuments({
      ...filter,
      classification: 'HUMAN',
    });

    const suspiciousCount = await Session.countDocuments({
      ...filter,
      classification: 'SUSPICIOUS',
    });

    const botCount = await Session.countDocuments({
      ...filter,
      classification: 'BOT',
    });

    // Get average risk score
    const avgRiskResult = await Session.aggregate([
      { $match: filter },
      { $group: { _id: null, avgScore: { $avg: '$riskScore' } } },
    ]);

    const avgRiskScore = avgRiskResult.length > 0 ? avgRiskResult[0].avgScore : 0;

    // Get high-risk sessions
    const highRiskSessions = await Session.find({
      ...filter,
      classification: { $in: ['SUSPICIOUS', 'BOT'] },
    })
      .sort({ riskScore: -1 })
      .limit(10);

    res.json({
      totalSessions: humanCount + suspiciousCount + botCount,
      classification: {
        human: humanCount,
        suspicious: suspiciousCount,
        bot: botCount,
      },
      averageRiskScore: avgRiskScore.toFixed(2),
      highRiskSessions,
      message: 'Detection statistics retrieved',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get detection stats: ${error.message}`);
    res.status(500).json({ error: 'Failed to get detection stats' });
  }
};

/**
 * Get detection rules (for reference)
 */
export const getDetectionRules = async (req, res) => {
  try {
    const rules = [
      {
        name: 'Fast Navigation',
        description: 'Multiple page changes in short time',
        weight: 15,
        threshold: '> 5 pages/minute',
      },
      {
        name: 'No Mouse Movement',
        description: 'Complete absence of mouse movement',
        weight: 20,
        threshold: '0 mouse events',
      },
      {
        name: 'No Scroll Activity',
        description: 'User never scrolls on page',
        weight: 18,
        threshold: '0 scroll events',
      },
      {
        name: 'High Click Rate',
        description: 'Abnormally fast clicking',
        weight: 12,
        threshold: '> 5 clicks/second',
      },
      {
        name: 'High Keystroke Rate',
        description: 'Abnormally fast typing',
        weight: 10,
        threshold: '> 10 keystrokes/second',
      },
      {
        name: 'Very Short Session',
        description: 'Session ends in seconds',
        weight: 15,
        threshold: '< 5 seconds',
      },
      {
        name: 'Long Idle Periods',
        description: 'Extended inactivity',
        weight: 8,
        threshold: '> 2 minutes',
      },
      {
        name: 'Spam Submissions',
        description: 'Rapid form submissions',
        weight: 12,
        threshold: '> 2 submissions/minute',
      },
      {
        name: 'Sequential Clicks',
        description: 'Repetitive clicking on same element',
        weight: 10,
        threshold: '> 5 consecutive clicks',
      },
    ];

    const thresholds = {
      humanMax: 29,
      suspiciousMin: 30,
      suspiciousMax: 59,
      botMin: 60,
      botMax: 100,
    };

    res.json({
      rules,
      thresholds,
      classification: {
        HUMAN: 'Score 0-29: Normal human behavior',
        SUSPICIOUS: 'Score 30-59: Unusual behavior patterns',
        BOT: 'Score 60-100: Strong indicators of automated activity',
      },
      message: 'Detection rules retrieved',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get detection rules: ${error.message}`);
    res.status(500).json({ error: 'Failed to get detection rules' });
  }
};

/**
 * Analyze sessions by classification
 */
export const getSessionsByClassification = async (req, res) => {
  try {
    const { classification, limit = 50, skip = 0 } = req.query;

    if (!['HUMAN', 'SUSPICIOUS', 'BOT'].includes(classification)) {
      return res.status(400).json({ error: 'Invalid classification' });
    }

    const sessions = await Session.find({ classification })
      .sort({ riskScore: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Session.countDocuments({ classification });

    res.json({
      classification,
      count: sessions.length,
      total,
      sessions,
      message: `${classification} sessions retrieved`,
    });
  } catch (error) {
    console.warn(`[Error] Failed to get sessions by classification: ${error.message}`);
    res.status(500).json({ error: 'Failed to get sessions by classification' });
  }
};
