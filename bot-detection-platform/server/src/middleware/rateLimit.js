/**
 * Simple in-memory rate limiter (per IP + route key)
 */
const buckets = new Map();

const getClientIp = (req) => req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';

export const createRateLimiter = ({ windowMs = 60000, max = 100, keyPrefix = '' } = {}) => {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    if (bucket.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    next();
  };
};

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyPrefix: 'auth',
});

export const eventRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 500,
  keyPrefix: 'events',
});
