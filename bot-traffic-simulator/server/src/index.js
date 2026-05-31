import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Bot Traffic Simulator Server is running' });
});

app.listen(PORT, () => {
  console.warn(`Bot Simulator Server running on port ${PORT}`);
});
