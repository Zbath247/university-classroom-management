// server/routes/teacher.js
const express = require('express');
const router  = express.Router();
const { getTeacherStats, getTeacherClasses } = require('../controllers/teacherStatsController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('teacher', 'admin'));

router.get('/stats', getTeacherStats);
router.get('/classes', getTeacherClasses);

module.exports = router;
