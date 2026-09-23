// server/routes/attendance.js
const express = require('express');
const router  = express.Router();
const {
  getAttendance,
  recordAttendanceBatch,
  updateAttendance,
  getAttendanceSummary
} = require('../controllers/attendanceController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// Read allowed for all authenticated users (students can view their attendance)
router.get('/', getAttendance);
router.get('/summary', getAttendanceSummary);

// Only teachers and admins can record and update attendance
router.post('/batch', restrictTo('teacher', 'admin'), recordAttendanceBatch);
router.put('/:id', restrictTo('teacher', 'admin'), updateAttendance);

module.exports = router;
