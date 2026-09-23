// server/server.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: The entry point of the entire backend application.
//          This file starts the HTTP server.
//
// HOW TO RUN:
//   Development: npm run dev   (uses nodemon — auto restarts on changes)
//   Production:  npm start     (uses node directly)
//
// WHAT THIS FILE DOES:
//   1. Imports the configured Express app from app.js
//   2. Reads the PORT from .env (or defaults to 3000)
//   3. Starts listening for incoming connections on that port
//   4. Prints helpful startup messages to the terminal
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

// ─── Start the Server ─────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║    University Classroom Management System             ║');
  console.log('║    ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀនសាកលវិទ្យាល័យ         ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Server running at: http://localhost:${PORT}          ║`);
  console.log(`║  🔌 API base URL:      http://localhost:${PORT}/api      ║`);
  console.log(`║  ❤️  Health check:     http://localhost:${PORT}/api/health║`);
  console.log(`║  🗄️  DB status:        http://localhost:${PORT}/api/db-status║`);
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║  📚 University: Digital University of Cambodia        ║`);
  console.log(`║  🎓 Class:      G1-NW-B                               ║`);
  console.log(`║  👤 Student:    ម៉ុក សម្បត្តិ                        ║`);
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║  ⚙️  Environment: ${(process.env.NODE_ENV || 'development').padEnd(35)}║`);
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // Test database connection (non-blocking — server still runs even if DB is down)
  testConnection();
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
// When you press Ctrl+C in the terminal, this ensures the server closes cleanly
// instead of being abruptly killed.
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Ctrl+C detected. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

// ─── Unhandled Error Safety Net ───────────────────────────────────────────────
// Catches any errors that slip through without being handled.
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});
