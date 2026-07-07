const adminDashboardService = require('../services/adminDashboard.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

/**
 * Controller to fetch dashboard overview statistics.
 */
const getOverview = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const overview = await adminDashboardService.getOverview();
  return res
    .status(200)
    .json(new ApiResponse(200, overview, 'Overview statistics retrieved successfully'));
});

/**
 * Controller to fetch dashboard revenue statistics.
 */
const getRevenue = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { period } = req.query;
  const revenueData = await adminDashboardService.getRevenueStats(period);
  return res
    .status(200)
    .json(new ApiResponse(200, revenueData, 'Revenue stats retrieved successfully'));
});

/**
 * Controller to fetch dashboard parking occupancy percentages.
 */
const getOccupancy = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const occupancy = await adminDashboardService.getOccupancy();
  return res
    .status(200)
    .json(new ApiResponse(200, occupancy, 'Occupancy details retrieved successfully'));
});

/**
 * Controller to fetch latest 10 bookings.
 */
const getRecentBookings = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const recentBookings = await adminDashboardService.getRecentBookings();
  return res
    .status(200)
    .json(new ApiResponse(200, recentBookings, 'Recent bookings retrieved successfully'));
});

module.exports = {
  getOverview,
  getRevenue,
  getOccupancy,
  getRecentBookings,
};
