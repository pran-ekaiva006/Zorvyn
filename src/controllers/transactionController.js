const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const createTransaction = catchAsync(async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  // Pagination params
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Query filtering out deleted items
  const query = { user: req.user.id, isDeleted: false };

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: transactions,
  });
});

const deleteTransaction = catchAsync(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
    isDeleted: false,
  });

  if (!transaction) {
    throw new AppError('Transaction not found or already deleted', 404);
  }

  // Soft delete
  transaction.isDeleted = true;
  await transaction.save();

  res.status(200).json({
    success: true,
    message: 'Transaction successfully deleted',
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
};