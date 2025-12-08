const requestCounts = new Map();
const WINDOW_MS = 60000;
const MAX_REQUESTS = 100;

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  const requestData = requestCounts.get(ip);

  if (now > requestData.resetTime) {
    requestData.count = 1;
    requestData.resetTime = now + WINDOW_MS;
    return next();
  }

  if (requestData.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
    });
  }

  requestData.count++;
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, WINDOW_MS);
