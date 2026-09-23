// server/middleware/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: JWT authentication and role-based authorization middleware.
//
// WHAT IS JWT (JSON Web Token)?
//   A JWT is a signed string that contains user information.
//   Format:  header.payload.signature
//   Example: eyJhbGci...  (very long string)
//
//   The server creates it during login and the frontend stores it.
//   Every protected request must include it in the header:
//     Authorization: Bearer eyJhbGci...
//
// HOW protect() WORKS:
//   1. Read the Authorization header
//   2. Extract the token (remove "Bearer " prefix)
//   3. Verify the token signature using JWT_SECRET
//   4. If valid → decode payload and store in req.user
//   5. If invalid/expired → return 401 Unauthorized
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken');

// ─── protect — user must be logged in ────────────────────────────────────────
const protect = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers['authorization'];

    // 2. Check that the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in first.'
      });
    }

    // 3. Extract the token (remove "Bearer " — 7 characters)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // 4. Verify the token using the secret key from .env
    //    jwt.verify() will throw an error if:
    //      - the token is invalid (tampered with)
    //      - the token is expired
    const jwtSecret = process.env.JWT_SECRET || 'duc_g1_nw_b_sambath_classroom_secret_key_2026';
    const decoded = jwt.verify(token, jwtSecret);

    // 5. Attach decoded user data to the request object
    //    Now any route handler can access req.user to know WHO is making the request
    req.user = decoded;

    // 6. Continue to the next middleware or route handler
    next();

  } catch (error) {
    // Handle specific JWT errors with clear messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    }
    // Unknown error
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// ─── restrictTo — only allow specific roles ───────────────────────────────────
// Usage example:
//   router.delete('/students/:id', protect, restrictTo('admin'), deleteStudent)
//
// This means: user must be logged in AND must have role = 'admin'
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set by protect() — must call protect() before restrictTo()
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.'
      });
    }

    // Check if the user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires role: ${roles.join(' or ')}.`
      });
    }

    next();
  };
};

module.exports = { protect, restrictTo };
