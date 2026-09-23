// server/middleware/security.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Security hardening middleware suite for University Classroom Management System
// Includes:
//   1. HTTP Security Headers (anti-clickjacking, MIME protection, XSS filter)
//   2. In-memory Rate Limiting (anti-brute force on auth, anti-DoS on API)
//   3. Input Sanitization (strips malicious tags from strings)
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1. HTTP Security Headers ────────────────────────────────────────────────
const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking (disallow embedding in iframes from other domains)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Enable legacy browser XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information sent in requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict download/execution of untrusted content
  res.setHeader('X-Download-Options', 'noopen');

  next();
};

// ─── 2. In-Memory Rate Limiter ───────────────────────────────────────────────
// Tracks request timestamps per client IP. Automatically prunes expired entries.
class RateLimiter {
  constructor({ windowMs = 60 * 1000, max = 100, message = 'Too many requests. Please try again later.' }) {
    this.windowMs = windowMs;
    this.max = max;
    this.message = message;
    this.hits = new Map(); // ip -> [timestamps]

    // Periodically clean up stale records every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [ip, timestamps] of this.hits.entries()) {
        const valid = timestamps.filter(t => now - t < this.windowMs);
        if (valid.length === 0) {
          this.hits.delete(ip);
        } else {
          this.hits.set(ip, valid);
        }
      }
    }, 5 * 60 * 1000).unref();
  }

  middleware() {
    return (req, res, next) => {
      // In development or test environments, don't throttle unless under test
      if (process.env.NODE_ENV === 'test') return next();

      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();

      let timestamps = this.hits.get(ip) || [];
      // Keep only timestamps within current window
      timestamps = timestamps.filter(t => now - t < this.windowMs);

      if (timestamps.length >= this.max) {
        const retryAfterSec = Math.ceil((this.windowMs - (now - timestamps[0])) / 1000);
        res.setHeader('Retry-After', retryAfterSec);
        return res.status(429).json({
          success: false,
          message: this.message,
          retryAfter: retryAfterSec
        });
      }

      timestamps.push(now);
      this.hits.set(ip, timestamps);
      next();
    };
  }
}

// Auth rate limiter: 30 attempts in production, 200 in development per 5 minutes
const authRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 30 : 200,
  message: 'Too many login attempts from this IP address. Please wait a few minutes before trying again.'
}).middleware();

// API rate limiter: 300 requests in production, 2000 in development per minute
const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 300 : 2000,
  message: 'Request rate limit exceeded. Please slow down.'
}).middleware();

// ─── 3. Input Sanitization (Anti-XSS) ─────────────────────────────────────────
// Recursively sanitizes string inputs to neutralize script tags
function sanitizeValue(val) {
  if (typeof val === 'string') {
    // Strip <script> tags and javascript: pseudo-protocol
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '');
  }
  if (val !== null && typeof val === 'object') {
    for (const key of Object.keys(val)) {
      val[key] = sanitizeValue(val[key]);
    }
  }
  return val;
}

const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = {
  securityHeaders,
  authRateLimiter,
  apiRateLimiter,
  sanitizeInputs
};
