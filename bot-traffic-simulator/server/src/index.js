import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import simulatorRoutes from './routes/simulatorRoutes.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.SIMULATOR_PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/simulator', simulatorRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Bot Traffic Simulator Server is running' });
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

app.listen(PORT, () => {
  console.warn(`Bot Simulator Server running on port ${PORT}`);
});
