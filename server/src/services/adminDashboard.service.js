const ParkingLot = require('../models/parkingLot.model');
const ParkingSlot = require('../models/parkingSlot.model');
const Booking = require('../models/booking.model');

class AdminDashboardService {
  /**
   * Fetch overview stats.
   */
  async getOverview() {
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

    return {
      totalParkingLots,
      activeParkingLots,
      totalSlots,
      availableSlots,
      occupiedSlots,
      totalBookings,
      confirmedBookings,
      todayBookings,
      totalRevenue,
    };
  }

  /**
   * Fetch revenue statistics over a specified period.
   */
  async getRevenueStats(period = 'month') {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let format = '%Y-%m-%d';
    if (period === 'today') {
      // Group by hour for today
      format = '%Y-%m-%d %H:00';
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      // Default: month (30 days ago)
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

    return {
      totalRevenue,
      period,
      chartData: chartData.map((item) => ({
        label: item._id,
        revenue: item.revenue,
        bookingsCount: item.bookingsCount,
      })),
    };
  }

  /**
   * Fetch occupancy details for all active parking lots.
   */
  async getOccupancy() {
    const activeLots = await ParkingLot.find({ isActive: true });

    return await Promise.all(
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
  }

  /**
   * Fetch 10 most recent bookings with safety filters.
   */
  async getRecentBookings() {
    return await Booking.find()
      .populate('user', 'name email')
      .populate('vehicle', 'type brand model registrationNumber color')
      .populate('parkingLot', 'name address city')
      .populate('parkingSlot', 'slotNumber floor section')
      .sort({ createdAt: -1 })
      .limit(10);
  }
}

module.exports = new AdminDashboardService();
