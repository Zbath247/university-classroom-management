// server/routes/teachers.js
const express = require('express');
const router  = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', getTeachers);
router.get('/:id', getTeacherById);

router.post('/', restrictTo('admin'), createTeacher);
router.put('/:id', restrictTo('admin'), updateTeacher);
router.delete('/:id', restrictTo('admin'), deleteTeacher);

module.exports = router;
