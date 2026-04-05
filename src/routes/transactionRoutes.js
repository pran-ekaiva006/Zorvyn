const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createTransactionSchema, updateTransactionSchema } = require('../validations/transactionValidation');



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

// Admin only Update
router.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.authorize('admin'),
  validateRequest(updateTransactionSchema),
  transactionController.updateTransaction
);

module.exports = router;