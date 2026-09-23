// server/routes/resources.js
const express = require('express');
const router  = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const upload = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// All authenticated roles can view resources
router.get('/', getResources);
router.get('/:id', getResourceById);

// Teachers and admins can share, edit, or delete resources (support multipart/form-data upload)
router.post('/', restrictTo('teacher', 'admin'), upload.single('file'), createResource);
router.put('/:id', restrictTo('teacher', 'admin'), upload.single('file'), updateResource);
router.delete('/:id', restrictTo('teacher', 'admin'), deleteResource);

module.exports = router;
