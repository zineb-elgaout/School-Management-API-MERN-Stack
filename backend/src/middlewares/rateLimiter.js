const rateLimit = require('express-rate-limit');

const baseOptions = {
  windowMs: 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
};

const studentWriteLimiter = rateLimit({
  ...baseOptions,
  max: 10,
  message: {
    error: 'Too many requests — please wait 1 minute before trying again',
  },
});

const loginLimiter = rateLimit({
  ...baseOptions,
  max: 10,
  message: {
    error: 'Too many login attempts — please wait 1 minute before trying again',
  },
});

module.exports = { studentWriteLimiter, loginLimiter };
module.exports.default = studentWriteLimiter;
