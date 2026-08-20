const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalyticsData } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('Admin'), getDashboardStats);
router.get('/analytics', protect, authorize('Admin'), getAnalyticsData);

module.exports = router;
