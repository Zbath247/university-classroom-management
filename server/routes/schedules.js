// server/routes/schedules.js
const express = require('express');
const router  = express.Router();
const {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// All roles (admin, teacher, student) can view schedules
router.get('/', getSchedules);
router.get('/:id', getScheduleById);

// Admin-only create, update, delete
router.post('/', restrictTo('admin'), createSchedule);
router.put('/:id', restrictTo('admin'), updateSchedule);
router.delete('/:id', restrictTo('admin'), deleteSchedule);

module.exports = router;
