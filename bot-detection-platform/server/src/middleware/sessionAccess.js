import Session from '../models/Session.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Allow analyze/end if valid JWT (any user) OR admin OR matching sessionToken
 */
export const validateSessionAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const bearer = authHeader && authHeader.split(' ')[1];

    if (bearer) {
      const decoded = verifyToken(bearer);
      if (decoded) {
        req.user = { ...decoded, id: decoded.userId };
        return next();
      }
    }

    const { sessionId, sessionToken } = req.body;
    if (!sessionId || !sessionToken) {
      return res.status(401).json({ error: 'sessionId and sessionToken required' });
    }

    const session = await Session.findById(sessionId);
    if (!session || session.sessionToken !== sessionToken) {
      return res.status(403).json({ error: 'Invalid session access' });
    }

    if (session.status === 'blocked') {
      return res.status(403).json({ error: 'Session is blocked' });
    }

    req.session = session;
    next();
  } catch (error) {
    console.warn(`[SessionAccess] ${error.message}`);
    res.status(500).json({ error: 'Session validation failed' });
  }
};
