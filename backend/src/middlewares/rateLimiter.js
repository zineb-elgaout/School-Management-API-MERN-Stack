const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,    // fenêtre de 1 minute
  max: 10,                 // max 10 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests — please wait 1 minute before trying again',
  },
});

module.exports = rateLimiter;