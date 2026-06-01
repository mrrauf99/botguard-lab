import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/detection', detectionRoutes);

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
    app.listen(PORT, () => {
      console.warn(`Bot Detection Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn(`Failed to connect to database: ${err.message}`);
    process.exit(1);
  });
