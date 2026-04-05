const dashboardService = require('../services/dashboardService');

// Dashboard Summary
const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardSummary(req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Category Breakdown
const getCategory = async (req, res) => {
  try {
    const data = await dashboardService.getCategoryBreakdown(req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Monthly Trends
const getTrends = async (req, res) => {
  try {
    const data = await dashboardService.getMonthlyTrends(req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getCategory,
  getTrends,
};