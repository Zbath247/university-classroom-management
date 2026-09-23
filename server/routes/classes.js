// server/routes/classes.js
const express = require('express');
const router  = express.Router();
const {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');
const { protect, restrictTo } = require('../middleware/auth');

// All class management requires authentication
router.use(protect);

// GET routes allow all authenticated users (teachers/students can view class lists)
router.get('/', getClasses);
router.get('/:id', getClassById);

// Modifications restricted to admin only
router.post('/', restrictTo('admin'), createClass);
router.put('/:id', restrictTo('admin'), updateClass);
router.delete('/:id', restrictTo('admin'), deleteClass);

module.exports = router;
