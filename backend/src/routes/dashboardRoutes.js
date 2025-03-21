const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All dashboard routes are admin-only
router.use(verifyToken, isAdmin);

// Get dashboard stats
router.get('/stats', dashboardController.getDashboardStats);

// Get recent activities
router.get('/activities', dashboardController.getRecentActivities);

module.exports = router;
