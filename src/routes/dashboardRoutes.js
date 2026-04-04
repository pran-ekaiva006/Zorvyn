const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

// Summary
router.get(
  '/summary',
  verifyToken,
  authorize('admin', 'analyst', 'viewer'),
  dashboardController.getSummary
);

// Category
router.get(
  '/category',
  verifyToken,
  authorize('admin', 'analyst'),
  dashboardController.getCategory
);

module.exports = router; 