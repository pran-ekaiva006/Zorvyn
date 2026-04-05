const transactionService = require('../services/transactionService');
const catchAsync = require('../utils/catchAsync');

const createTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.body, req.user.id);

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  // Pagination params
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Filter params
  const filters = {
    type: req.query.type,
    category: req.query.category,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  const result = await transactionService.getTransactions(req.user.id, page, limit, filters);

  res.status(200).json({
    success: true,
    count: result.transactions.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: result.transactions,
  });
});

const deleteTransaction = catchAsync(async (req, res) => {
  await transactionService.deleteTransaction(req.params.id, req.user.id);

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