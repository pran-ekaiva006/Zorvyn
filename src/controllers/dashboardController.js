const dashboardService = require('../services/dashboardService');
const catchAsync = require('../utils/catchAsync');

// Dashboard Summary
const getDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getDashboardSummary(req.user.id);

  res.status(200).json({
    success: true,
    data,
  });
});

// Category Breakdown
const getCategory = catchAsync(async (req, res) => {
  const data = await dashboardService.getCategoryBreakdown(req.user.id);

  res.status(200).json({
    success: true,
    data,
  });
});

// Monthly Trends
const getTrends = catchAsync(async (req, res) => {
  const data = await dashboardService.getMonthlyTrends(req.user.id);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getDashboard,
  getCategory,
  getTrends,
};