import BotTrafficGenerator from '../services/botTrafficGenerator.js';
import HumanTrafficGenerator from '../services/humanTrafficGenerator.js';

const botGenerator = new BotTrafficGenerator();
const humanGenerator = new HumanTrafficGenerator();
const activeGenerators = new Map();

/**
 * Start bot traffic simulation
 */
export const startBotTraffic = async (req, res) => {
  try {
    const { duration = 60000, botsPerInterval = 2, interval = 5000 } = req.body;

    if (activeGenerators.has('bot')) {
      return res.status(400).json({ error: 'Bot traffic already running' });
    }

    botGenerator.resetStats();
    botGenerator.startContinuousTraffic(duration, botsPerInterval, interval).then((stats) => {
      activeGenerators.delete('bot');
      console.warn('[SimulatorController] Bot traffic finished:', stats);
    });

    activeGenerators.set('bot', true);

    console.warn(
      `[SimulatorController] Bot traffic started: ${botsPerInterval} bots every ${interval}ms for ${duration}ms`
    );

    res.json({
      status: 'started',
      type: 'bot',
      duration,
      botsPerInterval,
      interval,
      message: 'Bot traffic simulation started',
    });
  } catch (error) {
    console.warn(`[Error] Failed to start bot traffic: ${error.message}`);
    res.status(500).json({ error: 'Failed to start bot traffic' });
  }
};

/**
 * Start human traffic simulation
 */
export const startHumanTraffic = async (req, res) => {
  try {
    const { duration = 60000, sessionsPerMinute = 3 } = req.body;

    if (activeGenerators.has('human')) {
      return res.status(400).json({ error: 'Human traffic already running' });
    }

    humanGenerator.resetStats();
    humanGenerator.startContinuousTraffic(duration, sessionsPerMinute).then((stats) => {
      activeGenerators.delete('human');
      console.warn('[SimulatorController] Human traffic finished:', stats);
    });

    activeGenerators.set('human', true);

    console.warn(
      `[SimulatorController] Human traffic started: ${sessionsPerMinute} sessions/min for ${duration}ms`
    );

    res.json({
      status: 'started',
      type: 'human',
      duration,
      sessionsPerMinute,
      message: 'Human traffic simulation started',
    });
  } catch (error) {
    console.warn(`[Error] Failed to start human traffic: ${error.message}`);
    res.status(500).json({ error: 'Failed to start human traffic' });
  }
};

/**
 * Start combined traffic simulation
 */
export const startCombinedTraffic = async (req, res) => {
  try {
    const {
      duration = 60000,
      botBotsPerInterval = 2,
      botInterval = 5000,
      humanSessionsPerMinute = 3,
    } = req.body;

    if (activeGenerators.has('bot') || activeGenerators.has('human')) {
      return res.status(400).json({ error: 'Traffic simulation already running' });
    }

    botGenerator.resetStats();
    humanGenerator.resetStats();

    botGenerator.startContinuousTraffic(duration, botBotsPerInterval, botInterval).then((stats) => {
      activeGenerators.delete('bot');
      console.warn('[SimulatorController] Bot traffic finished:', stats);
    });

    humanGenerator.startContinuousTraffic(duration, humanSessionsPerMinute).then((stats) => {
      activeGenerators.delete('human');
      console.warn('[SimulatorController] Human traffic finished:', stats);
    });

    activeGenerators.set('bot', true);
    activeGenerators.set('human', true);

    console.warn('[SimulatorController] Combined traffic simulation started');

    res.json({
      status: 'started',
      type: 'combined',
      duration,
      botConfig: {
        botsPerInterval: botBotsPerInterval,
        interval: botInterval,
      },
      humanConfig: {
        sessionsPerMinute: humanSessionsPerMinute,
      },
      message: 'Combined traffic simulation started',
    });
  } catch (error) {
    console.warn(`[Error] Failed to start combined traffic: ${error.message}`);
    res.status(500).json({ error: 'Failed to start combined traffic' });
  }
};

/**
 * Stop bot traffic simulation
 */
export const stopBotTraffic = async (req, res) => {
  try {
    botGenerator.stopTraffic();
    activeGenerators.delete('bot');

    console.warn('[SimulatorController] Bot traffic stopped');

    res.json({
      status: 'stopped',
      type: 'bot',
      stats: botGenerator.getStats(),
      message: 'Bot traffic simulation stopped',
    });
  } catch (error) {
    console.warn(`[Error] Failed to stop bot traffic: ${error.message}`);
    res.status(500).json({ error: 'Failed to stop bot traffic' });
  }
};

/**
 * Stop human traffic simulation
 */
export const stopHumanTraffic = async (req, res) => {
  try {
    humanGenerator.stopTraffic();
    activeGenerators.delete('human');

    console.warn('[SimulatorController] Human traffic stopped');

    res.json({
      status: 'stopped',
      type: 'human',
      stats: humanGenerator.getStats(),
      message: 'Human traffic simulation stopped',
    });
  } catch (error) {
    console.warn(`[Error] Failed to stop human traffic: ${error.message}`);
    res.status(500).json({ error: 'Failed to stop human traffic' });
  }
};

/**
 * Stop all traffic simulation
 */
export const stopAllTraffic = async (req, res) => {
  try {
    botGenerator.stopTraffic();
    humanGenerator.stopTraffic();
    activeGenerators.clear();

    console.warn('[SimulatorController] All traffic stopped');

    res.json({
      status: 'stopped',
      allTraffic: true,
      botStats: botGenerator.getStats(),
      humanStats: humanGenerator.getStats(),
      message: 'All traffic simulation stopped',
    });
  } catch (error) {
    console.warn(`[Error] Failed to stop all traffic: ${error.message}`);
    res.status(500).json({ error: 'Failed to stop all traffic' });
  }
};

/**
 * Get traffic status and statistics
 */
export const getTrafficStatus = async (req, res) => {
  try {
    const botStats = botGenerator.getStats();
    const humanStats = humanGenerator.getStats();

    res.json({
      active: {
        bot: activeGenerators.has('bot'),
        human: activeGenerators.has('human'),
      },
      stats: {
        bot: botStats,
        human: humanStats,
        combined: {
          totalSessions: botStats.totalSessions + humanStats.totalSessions,
          totalEvents: botStats.totalEvents + humanStats.totalEvents,
          botsDetected: botStats.botsGenerated,
          humansGenerated: humanStats.humansGenerated,
        },
      },
      message: 'Traffic status retrieved',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get traffic status: ${error.message}`);
    res.status(500).json({ error: 'Failed to get traffic status' });
  }
};

/**
 * Reset all statistics
 */
export const resetStats = async (req, res) => {
  try {
    botGenerator.resetStats();
    humanGenerator.resetStats();

    console.warn('[SimulatorController] Statistics reset');

    res.json({
      message: 'Statistics reset successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to reset stats: ${error.message}`);
    res.status(500).json({ error: 'Failed to reset stats' });
  }
};

/**
 * Generate single bot session
 */
export const generateSingleBot = async (req, res) => {
  try {
    const { type = 'fast-navigation' } = req.body;

    const botMap = {
      'fast-navigation': () => botGenerator.generateFastNavigationBot(),
      'no-interaction': () => botGenerator.generateNoInteractionBot(),
      'form-spam': () => botGenerator.generateFormSpamBot(),
      'click-spam': () => botGenerator.generateClickSpamBot(),
      suspicious: () => botGenerator.generateSuspiciousBot(),
    };

    const generator = botMap[type];
    if (!generator) {
      return res.status(400).json({ error: 'Invalid bot type' });
    }

    const sessionId = await generator();

    console.warn(`[SimulatorController] Single bot generated: ${type}`);

    res.json({
      type,
      sessionId,
      stats: botGenerator.getStats(),
      message: `Single bot session generated (${type})`,
    });
  } catch (error) {
    console.warn(`[Error] Failed to generate single bot: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate single bot' });
  }
};

/**
 * Generate single human session
 */
export const generateSingleHuman = async (req, res) => {
  try {
    const { type = 'normal' } = req.body;

    const humanMap = {
      normal: () => humanGenerator.generateHumanSession(),
      bouncer: () => humanGenerator.generateBouncerSession(),
    };

    const generator = humanMap[type];
    if (!generator) {
      return res.status(400).json({ error: 'Invalid human type' });
    }

    const sessionId = await generator();

    console.warn(`[SimulatorController] Single human generated: ${type}`);

    res.json({
      type,
      sessionId,
      stats: humanGenerator.getStats(),
      message: `Single human session generated (${type})`,
    });
  } catch (error) {
    console.warn(`[Error] Failed to generate single human: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate single human' });
  }
};
