import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Car, Compass, Calendar, DollarSign, QrCode } from 'lucide-react';

const DUMMY_STATS = {
  totalParkingLots: 8,
  availableSlots: 104,
  todayBookings: 32,
  revenue: 1240,
};

const DUMMY_RECENT_BOOKINGS = [
  {
    ref: 'PIN-A9B8C7',
    user: 'John Doe',
    lot: 'Downtown SafePark Hub',
    slot: 'A-12',
    status: 'confirmed',
    amount: 48,
  },
  {
    ref: 'PIN-X2Y3Z4',
    user: 'Jane Smith',
    lot: 'Westside Commuter Lot',
    slot: 'B-04',
    status: 'completed',
    amount: 72,
  },
  {
    ref: 'PIN-E5F6G7',
    user: 'Mike Johnson',
    lot: 'Greenway Smart Station',
    slot: 'C-31',
    status: 'cancelled',
    amount: 12,
  },
  {
    ref: 'PIN-D3E4F5',
    user: 'Sarah Williams',
    lot: 'Downtown SafePark Hub',
    slot: 'A-02',
    status: 'confirmed',
    amount: 24,
  },
  {
    ref: 'PIN-H7I8J9',
    user: 'Robert Brown',
    lot: 'Express Transit Parking',
    slot: 'D-08',
    status: 'completed',
    amount: 30,
  },
];

const DUMMY_OCCUPANCY = [
  { id: '1', name: 'Downtown SafePark Hub', percentage: 78 },
  { id: '2', name: 'Westside Commuter Lot', percentage: 42 },
  { id: '3', name: 'Express Transit Parking', percentage: 90 },
];

const AdminDashboard = () => {
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
    <div className="space-y-10 py-4">
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
        <Link
          to="/admin/qr-verify"
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-5 py-2.5 rounded-lg shadow-lg transition-colors text-sm"
        >
          <QrCode className="h-4 w-4" />
          <span>Verify Booking QR</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Parking Lots */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
              Total Parking Lots
            </span>
            <span className="text-3xl font-bold text-slate-100">{DUMMY_STATS.totalParkingLots}</span>
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
            <span className="text-3xl font-bold text-emerald-400">{DUMMY_STATS.availableSlots}</span>
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
            <span className="text-3xl font-bold text-purple-400">{DUMMY_STATS.todayBookings}</span>
          </div>
          <div className="bg-purple-500/10 text-purple-400 p-3 rounded-lg">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-3xl font-bold text-yellow-400">${DUMMY_STATS.revenue}</span>
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
                {DUMMY_RECENT_BOOKINGS.map((booking, index) => (
                  <tr key={index} className="hover:bg-slate-750/30">
                    <td className="px-4 py-3 font-mono font-bold text-slate-200">{booking.ref}</td>
                    <td className="px-4 py-3">{booking.user}</td>
                    <td className="px-4 py-3 text-slate-400">{booking.lot}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{booking.slot}</td>
                    <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">${booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Occupancy Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
          <h3 className="text-xl font-bold text-slate-100">Occupancy Levels</h3>
          <div className="space-y-4">
            {DUMMY_OCCUPANCY.map((lot) => (
              <div key={lot.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-300 truncate">{lot.name}</span>
                  <span className="text-emerald-400 font-bold">{lot.percentage}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      lot.percentage > 80
                        ? 'bg-red-500'
                        : lot.percentage > 50
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${lot.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
export { AdminDashboard };
