import ParkingLot from '../models/parkingLot.model.js';
import ParkingSlot from '../models/parkingSlot.model.js';
import Booking from '../models/booking.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner';

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: Unauthorized access');
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const lotQuery = {};
  const slotQuery = {};
  const bookingQuery = {};

  if (isOwner) {
    const ownerLots = await ParkingLot.find({ owner: req.user._id });
    const lotIds = ownerLots.map((lot) => lot._id);
    lotQuery._id = { $in: lotIds };
    slotQuery.parkingLot = { $in: lotIds };
    bookingQuery.parkingLot = { $in: lotIds };
  }

  const todayBookingQuery = {
    ...bookingQuery,
    createdAt: { $gte: startOfToday },
  };

  const completedBookingMatch = {
    ...bookingQuery,
    status: 'completed',
  };

  const [
    totalParkingLots,
    activeParkingLots,
    totalSlots,
    availableSlots,
    occupiedSlots,
    totalBookings,
    confirmedBookings,
    todayBookings,
    completedBookings,
    paidBookings,
    completedBookingsSum,
  ] = await Promise.all([
    ParkingLot.countDocuments(lotQuery),
    ParkingLot.countDocuments({ ...lotQuery, isActive: true }),
    ParkingSlot.countDocuments(slotQuery),
    ParkingSlot.countDocuments({ ...slotQuery, status: 'available' }),
    ParkingSlot.countDocuments({ ...slotQuery, status: 'occupied' }),
    Booking.countDocuments(bookingQuery),
    Booking.countDocuments({ ...bookingQuery, status: 'confirmed' }),
    Booking.countDocuments(todayBookingQuery),
    Booking.countDocuments({ ...bookingQuery, status: 'completed' }),
    Booking.countDocuments({ ...bookingQuery, paymentStatus: 'paid' }),
    Booking.aggregate([
      { $match: completedBookingMatch },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          platformFee: { $sum: '$platformFee' },
          ownerEarning: { $sum: '$ownerEarning' },
        },
      },
    ]),
  ]);

  const totalRevenue = completedBookingsSum.length > 0 ? completedBookingsSum[0].total : 0;
  const platformFee = completedBookingsSum.length > 0 ? completedBookingsSum[0].platformFee : 0;
  const ownerEarning = completedBookingsSum.length > 0 ? completedBookingsSum[0].ownerEarning : 0;

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
        completedBookings,
        paidBookings,
        totalRevenue,
        platformFee,
        ownerEarning,
      },
      'Overview statistics retrieved successfully'
    )
  );
});

export const getRevenue = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner';

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: Unauthorized access');
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

  const bookingQuery = {};
  if (isOwner) {
    const ownerLots = await ParkingLot.find({ owner: req.user._id });
    const lotIds = ownerLots.map((lot) => lot._id);
    bookingQuery.parkingLot = { $in: lotIds };
  }

  const totalRevenueMatch = {
    ...bookingQuery,
    status: 'completed',
  };

  const chartMatch = {
    ...bookingQuery,
    status: 'completed',
    createdAt: { $gte: startDate },
  };

  const [
    totalRevenueResult,
    totalBookings,
    completedBookings,
    paidBookings,
    chartData,
  ] = await Promise.all([
    Booking.aggregate([
      { $match: totalRevenueMatch },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          platformFee: { $sum: '$platformFee' },
          ownerEarning: { $sum: '$ownerEarning' },
        },
      },
    ]),
    Booking.countDocuments(bookingQuery),
    Booking.countDocuments({ ...bookingQuery, status: 'completed' }),
    Booking.countDocuments({ ...bookingQuery, paymentStatus: 'paid' }),
    Booking.aggregate([
      { $match: chartMatch },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          platformFee: { $sum: '$platformFee' },
          ownerEarning: { $sum: '$ownerEarning' },
          bookingsCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
  const platformFee = totalRevenueResult.length > 0 ? totalRevenueResult[0].platformFee : 0;
  const ownerEarning = totalRevenueResult.length > 0 ? totalRevenueResult[0].ownerEarning : 0;

  const result = {
    totalRevenue,
    platformFee,
    ownerEarning,
    totalBookings,
    completedBookings,
    paidBookings,
    period: period || 'month',
    chartData: chartData.map((item) => ({
      label: item._id,
      revenue: item.revenue,
      platformFee: item.platformFee,
      ownerEarning: item.ownerEarning,
      bookingsCount: item.bookingsCount,
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Revenue stats retrieved successfully'));
});

export const getOccupancy = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner';

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: Unauthorized access');
  }

  const lotQuery = { isActive: true };
  if (isOwner) {
    lotQuery.owner = req.user._id;
  }

  const activeLots = await ParkingLot.find(lotQuery);

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
  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner';

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: Unauthorized access');
  }

  const bookingQuery = {};
  if (isOwner) {
    const ownerLots = await ParkingLot.find({ owner: req.user._id });
    const lotIds = ownerLots.map((lot) => lot._id);
    bookingQuery.parkingLot = { $in: lotIds };
  }

  const recentBookings = await Booking.find(bookingQuery)
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
