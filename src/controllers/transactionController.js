const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');

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
  const transactions = await Transaction.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: transactions,
  });
});

module.exports = {
  createTransaction,
  getTransactions,
};