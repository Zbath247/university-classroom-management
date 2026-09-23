// server/routes/student.js
const express = require('express');
const router  = express.Router();
const {
  getStudentDashboard,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getStudentSchedule,
  getStudentAttendance,
  getStudentAssignments,
  getStudentResources
} = require('../controllers/studentPortalController');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadAvatarMiddleware } = require('../middleware/uploadAvatar');

// All routes require login and student/admin/teacher role
router.use(protect, restrictTo('student', 'admin', 'teacher'));

router.get('/dashboard',          getStudentDashboard);
router.get('/profile',            getProfile);
router.put('/profile',            updateProfile);
router.post('/profile/avatar',    uploadAvatarMiddleware, uploadAvatar);
router.delete('/profile/avatar',  deleteAvatar);
router.get('/schedule',        getStudentSchedule);
router.get('/attendance',      getStudentAttendance);
router.get('/assignments',     getStudentAssignments);
router.get('/resources',       getStudentResources);

module.exports = router;
