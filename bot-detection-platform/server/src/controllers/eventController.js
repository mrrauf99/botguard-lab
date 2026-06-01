import Session from '../models/Session.js';
import Event from '../models/Event.js';
import crypto from 'crypto';

// Generate unique session token
const generateSessionToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Create a new session
export const createSession = async (req, res) => {
  try {
    const { pageUrl, userAgent, ipAddress, referer } = req.body;
    const userId = req.user?.id || null;

    const sessionToken = generateSessionToken();

    const session = new Session({
      userId,
      sessionToken,
      pageUrl,
      userAgent,
      ipAddress,
      referer,
      status: 'active',
    });

    await session.save();

    console.warn(`[Behavior Tracking] New session created: ${sessionToken}`);

    res.status(201).json({
      sessionId: session._id,
      sessionToken: session.sessionToken,
      message: 'Session created successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to create session: ${error.message}`);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// Log individual events
export const logEvent = async (req, res) => {
  try {
    const { sessionId, eventType, x, y, scrollX, scrollY, targetElement, keyCode } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Validate session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const event = new Event({
      sessionId,
      userId: session.userId,
      eventType,
      x,
      y,
      scrollX,
      scrollY,
      targetElement,
      keyCode,
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        referer: req.headers.referer,
      },
    });

    await event.save();

    // Update session event counters
    session.eventCount += 1;

    switch (eventType) {
      case 'mousemove':
        session.mouseEvents += 1;
        break;
      case 'scroll':
        session.scrollEvents += 1;
        break;
      case 'click':
        session.clickEvents += 1;
        break;
      case 'keydown':
        session.keyEvents += 1;
        break;
      case 'navigation':
        session.navigationEvents += 1;
        break;
      case 'form_submit':
        break;
      default:
        break;
    }

    await session.save();

    res.status(201).json({
      eventId: event._id,
      message: 'Event logged successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to log event: ${error.message}`);
    res.status(500).json({ error: 'Failed to log event' });
  }
};

// Batch log multiple events
export const logEventsBatch = async (req, res) => {
  try {
    const { sessionId, events } = req.body;

    if (!sessionId || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'sessionId and events array are required' });
    }

    // Validate session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const referer = req.headers.referer;

    // Prepare events for bulk insertion
    const eventDocuments = events.map((event) => ({
      sessionId,
      userId: session.userId,
      eventType: event.eventType,
      x: event.x,
      y: event.y,
      scrollX: event.scrollX,
      scrollY: event.scrollY,
      targetElement: event.targetElement,
      keyCode: event.keyCode,
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
      metadata: {
        userAgent,
        ipAddress,
        referer,
      },
    }));

    // Insert all events
    const insertedEvents = await Event.insertMany(eventDocuments);

    // Update session counters
    let mouseCount = 0;
    let scrollCount = 0;
    let clickCount = 0;
    let keyCount = 0;

    events.forEach((event) => {
      switch (event.eventType) {
        case 'mousemove':
          mouseCount += 1;
          break;
        case 'scroll':
          scrollCount += 1;
          break;
        case 'click':
          clickCount += 1;
          break;
        case 'keydown':
          keyCount += 1;
          break;
        default:
          break;
      }
    });

    session.eventCount += events.length;
    session.mouseEvents += mouseCount;
    session.scrollEvents += scrollCount;
    session.clickEvents += clickCount;
    session.keyEvents += keyCount;

    await session.save();

    console.warn(
      `[Behavior Tracking] Logged ${insertedEvents.length} events for session ${sessionId}`
    );

    res.status(201).json({
      eventsLogged: insertedEvents.length,
      message: 'Events logged successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to batch log events: ${error.message}`);
    res.status(500).json({ error: 'Failed to batch log events' });
  }
};

// End session and compute idle time
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'completed';
    session.endTime = new Date();
    session.duration = session.endTime - session.startTime;

    // Calculate idle time based on events
    const events = await Event.find({ sessionId }).sort({ timestamp: 1 });

    let maxIdlePeriod = 0;
    let totalIdleTime = 0;

    if (events.length > 1) {
      for (let i = 1; i < events.length; i++) {
        const timeDiff = events[i].timestamp - events[i - 1].timestamp;
        if (timeDiff > 5000) {
          // Consider > 5 seconds as idle
          totalIdleTime += timeDiff;
          maxIdlePeriod = Math.max(maxIdlePeriod, timeDiff);
        }
      }
    }

    session.idleTime = totalIdleTime;
    session.maxIdlePeriod = maxIdlePeriod;

    await session.save();

    console.warn(
      `[Behavior Tracking] Session ended: ${sessionId}, Duration: ${session.duration}ms`
    );

    res.json({
      sessionId: session._id,
      duration: session.duration,
      eventCount: session.eventCount,
      idleTime: session.idleTime,
      message: 'Session ended successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to end session: ${error.message}`);
    res.status(500).json({ error: 'Failed to end session' });
  }
};

// Get session details with events
export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const events = await Event.find({ sessionId }).sort({ timestamp: 1 });

    res.json({
      session,
      events,
      message: 'Session details retrieved successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get session details: ${error.message}`);
    res.status(500).json({ error: 'Failed to get session details' });
  }
};

// Get user sessions
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sessions = await Session.find({ userId }).sort({ startTime: -1 }).limit(50);

    res.json({
      sessions,
      count: sessions.length,
      message: 'User sessions retrieved successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get user sessions: ${error.message}`);
    res.status(500).json({ error: 'Failed to get user sessions' });
  }
};

// Get all sessions (admin only)
export const getAllSessions = async (req, res) => {
  try {
    const { limit = 100, skip = 0, status, classification } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (classification) filter.classification = classification;

    const sessions = await Session.find(filter)
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Session.countDocuments(filter);

    res.json({
      sessions,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      message: 'All sessions retrieved successfully',
    });
  } catch (error) {
    console.warn(`[Error] Failed to get all sessions: ${error.message}`);
    res.status(500).json({ error: 'Failed to get all sessions' });
  }
};
