const rateLimit = (req, res, next) => {
  // Simple rate limiting middleware
  const clientIp = req.ip;
  const now = Date.now();
  const windowSize = 60000; // 1 minute
  const maxRequests = 10;

  // In production, use redis or similar for distributed rate limiting
  const requestTimestamps = req.app.locals.requestTimestamps || {};

  if (!requestTimestamps[clientIp]) {
    requestTimestamps[clientIp] = [];
  }

  // Remove old timestamps
  requestTimestamps[clientIp] = requestTimestamps[clientIp].filter(
    (timestamp) => now - timestamp < windowSize
  );

  if (requestTimestamps[clientIp].length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  requestTimestamps[clientIp].push(now);
  req.app.locals.requestTimestamps = requestTimestamps;

  next();
};

module.exports = { rateLimit };
