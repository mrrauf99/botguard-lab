import User from '../models/User.js';
import LoginAttempt from '../models/LoginAttempt.js';
import { generateToken } from '../utils/jwt.js';
import { validateRegisterInput } from '../utils/validation.js';

const getClientIp = (req) => req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';

const recordLoginAttempt = async (req, email, success) => {
  await LoginAttempt.create({
    email: email?.toLowerCase(),
    ipAddress: getClientIp(req),
    success,
    userAgent: req.headers['user-agent'],
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const validation = validateRegisterInput(email, password, name);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'user',
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      await recordLoginAttempt(req, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await recordLoginAttempt(req, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await recordLoginAttempt(req, email, true);
    const token = generateToken(user._id, user.role);

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user: ' + error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users: ' + error.message });
  }
};
