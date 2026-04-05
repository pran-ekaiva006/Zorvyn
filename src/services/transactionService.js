const Transaction = require('../models/transactionModel');
const AppError = require('../utils/AppError');

const createTransaction = async (data, userId) => {
  const transaction = await Transaction.create({
    ...data,
    user: userId,
  });

  return transaction;
};

const getTransactions = async (userId, page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  const query = { user: userId, isDeleted: false };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

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

  transaction.isDeleted = true;
  await transaction.save();
};

const updateTransaction = async (transactionId, userId, updateData) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, user: userId, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  );

  if (!transaction) {
    throw new AppError('Transaction not found or already deleted', 404);
  }

  return transaction;
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
};
