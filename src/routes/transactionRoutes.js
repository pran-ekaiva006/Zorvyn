const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

console.log("DEBUG:", {
  create: transactionController.createTransaction,
  get: transactionController.getTransactions,
  verifyToken: authMiddleware.verifyToken,
  authorize: authMiddleware.authorize
});

// Admin only
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin'),
  transactionController.createTransaction
);

// Admin + Analyst
router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin', 'analyst'),
  transactionController.getTransactions
);

module.exports = router;