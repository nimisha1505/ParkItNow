import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Car, Compass, Calendar, DollarSign, QrCode, Shield, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axiosClient from '../api/axiosClient.js';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [occupancy, setOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, recentRes, occupancyRes] = await Promise.all([
        axiosClient.get('/admin/dashboard/overview'),
        axiosClient.get('/admin/dashboard/recent-bookings'),
        axiosClient.get('/admin/dashboard/occupancy'),
      ]);

      setOverview(overviewRes.data.data);
      setRecentBookings(recentRes.data.data || []);
      setOccupancy(occupancyRes.data.data || []);
    } catch (err) {
      console.error('Fetch dashboard data failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to retrieve admin dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-500/20 capitalize">
            {status}
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-500/20 capitalize">
            {status}
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-500/10 text-red-400 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-red-500/20 capitalize">
            {status}
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-400 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-500/20 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-10 py-4 animate-fade-in">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
            <LayoutDashboard className="h-8 w-8 text-emerald-400" />
            <span>Admin Dashboard</span>
          </h2>
          <p className="text-slate-400 mt-2">
            Monitor system metrics, reservation trends, and slot occupancy statistics.
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {user?.role === 'superAdmin' && (
            <Link
              to="/admin/parking-approvals"
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-650 text-slate-100 font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-colors text-sm border border-slate-600"
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Parking Approvals</span>
            </Link>
          )}
          <Link
            to="/admin/qr-verify"
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-5 py-2.5 rounded-lg shadow-lg transition-colors text-sm"
          >
            <QrCode className="h-4 w-4" />
            <span>Verify Booking QR</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !overview ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Total Parking Lots */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                  Total Parking Lots
                </span>
                <span className="text-3xl font-bold text-slate-100">{overview?.totalParkingLots ?? 0}</span>
              </div>
              <div className="bg-blue-500/10 text-blue-400 p-3 rounded-lg">
                <Compass className="h-6 w-6" />
              </div>
            </div>

            {/* Card 2: Available Slots */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                  Available Slots
                </span>
                <span className="text-3xl font-bold text-emerald-400">{overview?.availableSlots ?? 0}</span>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
            </div>

            {/* Card 3: Today's Bookings */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                  Today's Bookings
                </span>
                <span className="text-3xl font-bold text-purple-400">{overview?.todayBookings ?? 0}</span>
              </div>
              <div className="bg-purple-500/10 text-purple-400 p-3 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            {/* Card 4: Revenue */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                  {user?.role === 'owner' ? 'Owner Earnings' : 'Platform Revenue'}
                </span>
                <span className="text-3xl font-bold text-yellow-400">
                  ₹{user?.role === 'owner' ? (overview?.ownerEarning ?? 0) : (overview?.totalRevenue ?? 0)}
                </span>
                {user?.role === 'superAdmin' && (
                  <span className="text-[10px] text-slate-500 block">Owner Share: ₹{overview?.ownerEarning ?? 0}</span>
                )}
              </div>
              <div className="bg-yellow-500/10 text-yellow-400 p-3 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Occupancy and Table split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Bookings Table */}
            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-xl font-bold text-slate-100">Recent Bookings</h3>
              {recentBookings.length === 0 ? (
                <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-xl text-center text-slate-500 text-sm">
                  No bookings found in this period.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Booking Ref</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Parking Lot</th>
                        <th className="px-4 py-3">Slot</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 rounded-r-lg">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {recentBookings.map((booking) => {
                        const bookingId = booking._id || booking.id;
                        return (
                          <tr key={bookingId} className="hover:bg-slate-750/30">
                            <td className="px-4 py-3 font-mono font-bold text-slate-200">{booking.bookingReference}</td>
                            <td className="px-4 py-3">{booking.user?.name || 'N/A'}</td>
                            <td className="px-4 py-3 text-slate-400">{booking.parkingLot?.name || 'N/A'}</td>
                            <td className="px-4 py-3 font-semibold text-slate-300">{booking.parkingSlot?.slotNumber || 'N/A'}</td>
                            <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                            <td className="px-4 py-3 font-bold text-emerald-400">₹{booking.totalAmount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Occupancy Section */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
              <h3 className="text-xl font-bold text-slate-100">Occupancy Levels</h3>
              {occupancy.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-6">No active lot occupancy metrics.</div>
              ) : (
                <div className="space-y-4">
                  {occupancy.map((lot) => {
                    const lotId = lot.parkingLotId || lot.id;
                    return (
                      <div key={lotId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-slate-300 truncate">{lot.name}</span>
                          <span className="text-emerald-400 font-bold">{lot.occupancyPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              lot.occupancyPercentage > 80
                                ? 'bg-red-500'
                                : lot.occupancyPercentage > 50
                                ? 'bg-blue-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${lot.occupancyPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
export { AdminDashboard };
