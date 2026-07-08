import ParkingLot from '../models/parkingLot.model.js';
import ParkingSlot from '../models/parkingSlot.model.js';
import Booking from '../models/booking.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalParkingLots,
    activeParkingLots,
    totalSlots,
    availableSlots,
    occupiedSlots,
    totalBookings,
    confirmedBookings,
    todayBookings,
    completedBookingsSum,
  ] = await Promise.all([
    ParkingLot.countDocuments(),
    ParkingLot.countDocuments({ isActive: true }),
    ParkingSlot.countDocuments(),
    ParkingSlot.countDocuments({ status: 'available' }),
    ParkingSlot.countDocuments({ status: 'occupied' }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ createdAt: { $gte: startOfToday } }),
    Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);

  const totalRevenue = completedBookingsSum.length > 0 ? completedBookingsSum[0].total : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalParkingLots,
        activeParkingLots,
        totalSlots,
        availableSlots,
        occupiedSlots,
        totalBookings,
        confirmedBookings,
        todayBookings,
        totalRevenue,
      },
      'Overview statistics retrieved successfully'
    )
  );
});

export const getRevenue = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { period } = req.query;
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  let format = '%Y-%m-%d';
  if (period === 'today') {
    format = '%Y-%m-%d %H:00';
  } else if (period === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate.setDate(startDate.getDate() - 30);
  }

  const [totalRevenueResult, chartData] = await Promise.all([
    Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Booking.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          bookingsCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

  const result = {
    totalRevenue,
    period: period || 'month',
    chartData: chartData.map((item) => ({
      label: item._id,
      revenue: item.revenue,
      bookingsCount: item.bookingsCount,
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Revenue stats retrieved successfully'));
});

export const getOccupancy = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const activeLots = await ParkingLot.find({ isActive: true });

  const occupancy = await Promise.all(
    activeLots.map(async (lot) => {
      const [totalSlots, availableSlots, occupiedSlots] = await Promise.all([
        ParkingSlot.countDocuments({ parkingLot: lot._id }),
        ParkingSlot.countDocuments({ parkingLot: lot._id, status: 'available' }),
        ParkingSlot.countDocuments({ parkingLot: lot._id, status: 'occupied' }),
      ]);

      const occupancyPercentage = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

      return {
        parkingLotId: lot._id,
        name: lot.name,
        totalSlots,
        availableSlots,
        occupiedSlots,
        occupancyPercentage,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, occupancy, 'Occupancy details retrieved successfully'));
});

export const getRecentBookings = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const recentBookings = await Booking.find()
    .populate('user', 'name email')
    .populate('vehicle', 'type brand model registrationNumber color')
    .populate('parkingLot', 'name address city')
    .populate('parkingSlot', 'slotNumber floor section')
    .sort({ createdAt: -1 })
    .limit(10);

  return res
    .status(200)
    .json(new ApiResponse(200, recentBookings, 'Recent bookings retrieved successfully'));
});
