// server/app.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Configure the Express application — middleware, routes, static files.
//
// WHAT IS EXPRESS.JS?
//   Express.js is a framework built on top of Node.js that makes it easy to
//   create web servers. It handles incoming HTTP requests and sends responses.
//
// WHY SEPARATE app.js FROM server.js?
//   - app.js sets up WHAT the server does (routes, middleware, logic)
//   - server.js handles HOW the server starts (port, startup messages)
//   This separation makes testing easier in the future.
//
// WHAT IS CORS?
//   CORS (Cross-Origin Resource Sharing) is a security feature in browsers.
//   By default, browsers block JavaScript from calling an API on a different
//   origin (e.g., frontend on port 5500 calling backend on port 3000).
//   We configure CORS to allow this communication during development.
// ─────────────────────────────────────────────────────────────────────────────

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config(); // Load .env file variables into process.env

const apiRoutes    = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const { securityHeaders, apiRateLimiter, sanitizeInputs } = require('./middleware/security');

const app = express();

// Disable Express advertising header
app.disable('x-powered-by');

// ─── Global Security & Parsing Middleware ────────────────────────────────────
// Apply HTTP security headers
app.use(securityHeaders);

// Parse incoming JSON request bodies with bounded memory limit
app.use(express.json({ limit: '2mb' }));

// Parse URL-encoded form data with bounded memory limit
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Sanitize request inputs against XSS attacks
app.use(sanitizeInputs);

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN  // In production, restrict to specific domain
    : '*',                        // In development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Serve Uploaded Files & Static Frontend Files ────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../client')));

// ─── API Routes ───────────────────────────────────────────────────────────────
// Protected by API rate limiting
app.use('/api', apiRateLimiter, apiRoutes);

// ─── SPA Fallback ─────────────────────────────────────────────────────────────
// If a browser navigates to a URL that isn't an API route or a static file,
// serve the main index.html so the frontend can handle routing.
// (This is mainly useful when using a frontend router in Phase 7+)
app.get('*', (req, res, next) => {
  // Only catch non-API routes
  if (req.path.startsWith('/api/')) {
    const error = new Error(`Route not found: ${req.method} ${req.path}`);
    error.statusCode = 404;
    return next(error);
  }
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ─── Error Handling Middleware ────────────────────────────────────────────────
// MUST be placed LAST — Express knows it is an error handler because it has
// 4 parameters (err, req, res, next)
app.use(errorHandler);

module.exports = app;
