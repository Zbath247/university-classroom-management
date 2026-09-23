// server/routes/index.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: The main router that connects all API route files together.
// ─────────────────────────────────────────────────────────────────────────────

const express   = require('express');
const router    = express.Router();
const { query } = require('../config/db');

// ─── Mount Auth Routes (Phase 3) ──────────────────────────────────────────────
const authRoutes = require('./auth');
router.use('/auth', authRoutes);

// ─── GET /api/health ──────────────────────────────────────────────────────────
// Simple check to confirm the server is running.
router.get('/health', (req, res) => {
  res.json({
    success:    true,
    message:    'Server is running',
    project:    'University Classroom Management System',
    university: 'Digital University of Cambodia',
    class:      'G1-NW-B',
    timestamp:  new Date().toISOString()
  });
});

// ─── GET /api/db-status ───────────────────────────────────────────────────────
// Check database connection and list all tables.
// Visit: http://localhost:3000/api/db-status
router.get('/db-status', async (req, res) => {
  try {
    const tables = await query(
      `SELECT TABLE_NAME AS tableName, TABLE_ROWS AS rowCount
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ?
       ORDER BY TABLE_NAME`,
      [process.env.DB_NAME || 'classroom_db']
    );

    res.json({
      success:  true,
      message:  'Database connected successfully',
      database: process.env.DB_NAME || 'classroom_db',
      tables:   tables
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database not connected: ' + error.message,
      hint:    'Make sure MySQL is running and you have imported schema.sql and seed.sql'
    });
  }
});

// ─── Phase 4 Routes (Admin & Management) ──────────────────────────────────────
const adminRoutes    = require('./admin');
const studentRoutes  = require('./students');
const teacherRoutes  = require('./teachers');
const classRoutes    = require('./classes');
const subjectRoutes  = require('./subjects');
const scheduleRoutes = require('./schedules');

router.use('/admin',     adminRoutes);
router.use('/students',  studentRoutes);
router.use('/teachers',  teacherRoutes);
router.use('/classes',   classRoutes);
router.use('/subjects',  subjectRoutes);
router.use('/schedules', scheduleRoutes);

// ─── Phase 5 Routes (Teacher Features & Classroom Management) ────────────────
const teacherPortalRoutes = require('./teacher');
const attendanceRoutes    = require('./attendance');
const assignmentRoutes    = require('./assignments');
const resourceRoutes      = require('./resources');

router.use('/teacher',     teacherPortalRoutes);
router.use('/attendance',  attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/resources',   resourceRoutes);

// ─── Phase 6 Routes (Student Portal) ──────────────────────────────────────────
const studentPortalRoutes = require('./student');
router.use('/student', studentPortalRoutes);

module.exports = router;
