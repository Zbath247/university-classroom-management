// server/routes/students.js
const express = require('express');
const router  = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// Admins and teachers can list and view students
router.get('/', restrictTo('admin', 'teacher'), getStudents);
router.get('/:id', restrictTo('admin', 'teacher', 'student'), getStudentById);

// Only admins can create, edit, or delete students
router.post('/', restrictTo('admin'), createStudent);
router.put('/:id', restrictTo('admin'), updateStudent);
router.delete('/:id', restrictTo('admin'), deleteStudent);

module.exports = router;
