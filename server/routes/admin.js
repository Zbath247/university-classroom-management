// server/routes/admin.js
const express = require('express');
const router  = express.Router();
const { getAdminStats } = require('../controllers/adminStatsController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes here require login and admin role
router.use(protect, restrictTo('admin'));

router.get('/stats', getAdminStats);

module.exports = router;
