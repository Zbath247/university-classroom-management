// server/middleware/errorHandler.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: A centralized place to handle all errors from the entire application.
//
// WHAT IS MIDDLEWARE?
//   Middleware is code that runs BETWEEN receiving a request and sending a
//   response. Think of it like a checkpoint.
//
// HOW IT WORKS:
//   When any route throws an error (using next(error)), Express automatically
//   sends it here. We format the error into a clean JSON response.
//
// WHY CENTRALIZE?
//   Without this, every single route would need its own error handling code.
//   With this, we write error handling ONCE and it works everywhere.
// ─────────────────────────────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Log the full error to the server terminal (for debugging)
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong. Please try again.';

  // ─── Database Error Sanitization ──────────────────────────────────────────
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with this identifier or unique code already exists.';
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
    statusCode = 409;
    message = 'Cannot delete or modify this item because other academic records depend on it.';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452) {
    statusCode = 400;
    message = 'The specified parent record (such as class or subject) does not exist.';
  } else if (err.code === 'ER_DATA_TOO_LONG') {
    statusCode = 400;
    message = 'One or more input fields exceed the maximum permitted length.';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database service is currently unreachable. Please try again shortly.';
  }

  // Send a clean, consistent JSON error response to the frontend
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, code: err.code })
  });
};

module.exports = errorHandler;

