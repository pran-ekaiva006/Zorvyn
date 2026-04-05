const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// 🔍 DEBUG (check all handlers are functions)
console.log("DASHBOARD DEBUG:", {
  getDashboard: dashboardController.getDashboard,
  getCategory: dashboardController.getCategory,
  getTrends: dashboardController.getTrends,
});

// 🔹 Dashboard Summary
router.get(
  '/summary',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin', 'analyst', 'viewer'),
  dashboardController.getDashboard
);

// 🔹 Category Breakdown
router.get(
  '/category',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin', 'analyst'),
  dashboardController.getCategory
);

// 🔹 Monthly Trends
router.get(
  '/trends',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin', 'analyst'),
  dashboardController.getTrends
);

module.exports = router;