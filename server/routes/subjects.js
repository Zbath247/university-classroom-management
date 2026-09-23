// server/routes/subjects.js
const express = require('express');
const router  = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// Read allowed for all authenticated roles
router.get('/', getSubjects);
router.get('/:id', getSubjectById);

// Admin-only modifications
router.post('/', restrictTo('admin'), createSubject);
router.put('/:id', restrictTo('admin'), updateSubject);
router.delete('/:id', restrictTo('admin'), deleteSubject);

module.exports = router;
