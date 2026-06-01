import express from 'express';
import { register, login, getCurrentUser, getAllUsers } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', authenticateToken, getCurrentUser);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

export default router;
