// server/routes/assignments.js
const express = require('express');
const router  = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// All roles (students, teachers, admins) can view assignments
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

// Only teachers and admins can create, update, or delete assignments
router.post('/', restrictTo('teacher', 'admin'), createAssignment);
router.put('/:id', restrictTo('teacher', 'admin'), updateAssignment);
router.delete('/:id', restrictTo('teacher', 'admin'), deleteAssignment);

module.exports = router;
