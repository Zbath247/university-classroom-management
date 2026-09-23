// server/routes/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Define all authentication-related API routes.
//
// Routes defined here are mounted at /api/auth in routes/index.js
// So:  router.post('/login')  →  accessible at  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();

const { login, logout, getMe, uploadUserAvatar, deleteUserAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');
const { uploadAvatarMiddleware } = require('../middleware/uploadAvatar');

// POST /api/auth/login   — No auth required, rate-limited against brute-force attacks
router.post('/login', authRateLimiter, login);

// POST /api/auth/logout  — Optional: requires auth so we know who is logging out
router.post('/logout', protect, logout);

// GET  /api/auth/me      — Requires auth: returns current user info
router.get('/me', protect, getMe);

// POST /api/auth/avatar  — Requires auth: upload user avatar
router.post('/avatar', protect, uploadAvatarMiddleware, uploadUserAvatar);

// DELETE /api/auth/avatar — Requires auth: delete user avatar
router.delete('/avatar', protect, deleteUserAvatar);

module.exports = router;
