import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.io server
 */
export const initializeSocketIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST']
    }
  });

  // Dashboard namespace for real-time updates
  io.of('/dashboard').on('connection', (socket) => {
    console.warn(`[Socket.io] Dashboard client connected: ${socket.id}`);

    // Subscribe to real-time updates
    socket.on('subscribe-stats', () => {
      socket.join('dashboard-stats');
      console.warn(`[Socket.io] Client subscribed to stats: ${socket.id}`);
    });

    socket.on('subscribe-sessions', () => {
      socket.join('dashboard-sessions');
      console.warn(`[Socket.io] Client subscribed to sessions: ${socket.id}`);
    });

    socket.on('subscribe-detections', () => {
      socket.join('dashboard-detections');
      console.warn(`[Socket.io] Client subscribed to detections: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.warn(`[Socket.io] Dashboard client disconnected: ${socket.id}`);
    });
  });

  // Sessions namespace for session updates
  io.of('/sessions').on('connection', (socket) => {
    console.warn(`[Socket.io] Sessions client connected: ${socket.id}`);

    socket.on('join-session', (sessionId) => {
      socket.join(`session-${sessionId}`);
      console.warn(`[Socket.io] Client joined session: ${sessionId}`);
    });

    socket.on('disconnect', () => {
      console.warn(`[Socket.io] Sessions client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get Socket.io instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Emit real-time stats update
 */
export const emitStatsUpdate = (stats) => {
  if (io) {
    io.of('/dashboard').to('dashboard-stats').emit('stats-update', stats);
    console.warn('[Socket.io] Stats update emitted');
  }
};

/**
 * Emit new session event
 */
export const emitNewSession = (session) => {
  if (io) {
    io.of('/dashboard').to('dashboard-sessions').emit('new-session', session);
    io.of('/sessions').emit('session-created', session);
    console.warn('[Socket.io] New session emitted');
  }
};

/**
 * Emit session ended event
 */
export const emitSessionEnded = (sessionId, session) => {
  if (io) {
    io.of('/dashboard').to('dashboard-sessions').emit('session-ended', { sessionId, session });
    io.of('/sessions').to(`session-${sessionId}`).emit('session-ended', session);
    console.warn(`[Socket.io] Session ended emitted: ${sessionId}`);
  }
};

/**
 * Emit detection event
 */
export const emitDetectionResult = (sessionId, result) => {
  if (io) {
    io.of('/dashboard').to('dashboard-detections').emit('detection-result', { sessionId, result });
    io.of('/sessions').to(`session-${sessionId}`).emit('detection-result', result);
    console.warn(`[Socket.io] Detection result emitted: ${sessionId}`);
  }
};

/**
 * Emit classification update
 */
export const emitClassificationUpdate = (sessionId, classification) => {
  if (io) {
    io.of('/dashboard').to('dashboard-sessions').emit('classification-update', { sessionId, classification });
    console.warn(`[Socket.io] Classification update emitted: ${sessionId} -> ${classification}`);
  }
};
