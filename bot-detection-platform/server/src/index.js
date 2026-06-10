import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './config/database.js';
import { initializeSocketIO } from './services/socketService.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { securityHeaders } from './middleware/securityHeaders.js';

dotenv.config({ path: '../../.env' });

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocketIO(httpServer);

app.set('trust proxy', 1);
app.use(securityHeaders);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/detection', detectionRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Bot Detection Platform Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res) => {
  console.warn(`[Error] ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to database and start server
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.warn(`Bot Detection Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn(`Failed to connect to database: ${err.message}`);
    process.exit(1);
  });
