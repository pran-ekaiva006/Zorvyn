const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');

// DASHBOARD SUMMARY
const getDashboardSummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const result = await Transaction.aggregate([
    { $match: { user: userObjectId } },

    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalIncome: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
                },
              },
              totalExpense: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
                },
              },
            },
          },
        ],

        categoryBreakdown: [
          {
            $group: {
              _id: '$category',
              total: { $sum: '$amount' },
            },
          },
        ],

        recentTransactions: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);

  const totals = result[0].totals[0] || {
    totalIncome: 0,
    totalExpense: 0,
  };

  return {
    totalIncome: totals.totalIncome,
    totalExpense: totals.totalExpense,
    netBalance: totals.totalIncome - totals.totalExpense,
    categoryBreakdown: result[0].categoryBreakdown,
    recentTransactions: result[0].recentTransactions,
  };
};

// CATEGORY BREAKDOWN (separate endpoint)
const getCategoryBreakdown = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return await Transaction.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]);
};

module.exports = {
  getDashboardSummary,
  getCategoryBreakdown,
};