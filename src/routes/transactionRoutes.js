const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createTransactionSchema } = require('../validations/transactionValidation');



// Admin only
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin'),
  validateRequest(createTransactionSchema),
  transactionController.createTransaction
);

// Admin + Analyst
router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin', 'analyst'),
  transactionController.getTransactions
);

// Admin only Delete
router.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin'),
  transactionController.deleteTransaction
);

module.exports = router;