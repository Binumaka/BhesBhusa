// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Limit: 5 login attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: 'Too many login attempts. Try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
