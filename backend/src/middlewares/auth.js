const crypto = require('crypto');

const safeCompare = (provided, expected) => {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

const adminAuth = (req, res, next) => {
  const configuredKey = process.env.API_KEY;

  if (!configuredKey) {
    return res.status(500).json({ error: 'Server API key is not configured' });
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized — API key missing' });
  }

  if (!safeCompare(apiKey, configuredKey)) {
    return res.status(403).json({ error: 'Forbidden — Invalid API key' });
  }

  return next();
};

module.exports = adminAuth;
module.exports.safeCompare = safeCompare;
