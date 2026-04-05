const Transaction = require('../models/transactionModel');
const AppError = require('../utils/AppError');

const createTransaction = async (data, userId) => {
  const transaction = await Transaction.create({
    ...data,
    user: userId,
  });

  return transaction;
};

const getTransactions = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = { user: userId, isDeleted: false };

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return {
    transactions,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const deleteTransaction = async (transactionId, userId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
    isDeleted: false,
  });

  if (!transaction) {
    throw new AppError('Transaction not found or already deleted', 404);
  }

  // Soft delete
  transaction.isDeleted = true;
  await transaction.save();
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
};
