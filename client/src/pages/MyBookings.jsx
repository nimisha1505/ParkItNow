import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const DUMMY_BOOKINGS = [
  {
    id: '1',
    bookingReference: 'PIN-A9B8C7',
    parkingLotName: 'Downtown SafePark Hub',
    slotNumber: 'A-12',
    vehicleNumber: 'NY-99-C-1234',
    date: '2026-07-10',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    totalAmount: 48,
    status: 'confirmed',
    entryStatus: 'not_checked_in',
  },
  {
    id: '2',
    bookingReference: 'PIN-X2Y3Z4',
    parkingLotName: 'Westside Commuter Lot',
    slotNumber: 'B-04',
    vehicleNumber: 'CA-55-S-8765',
    date: '2026-07-08',
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    totalAmount: 72,
    status: 'completed',
    entryStatus: 'checked_out',
  },
  {
    id: '3',
    bookingReference: 'PIN-E5F6G7',
    parkingLotName: 'Greenway Smart Station',
    slotNumber: 'C-31',
    vehicleNumber: 'WA-12-E-9012',
    date: '2026-07-11',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    totalAmount: 12,
    status: 'cancelled',
    entryStatus: 'not_checked_in',
  },
];

const MyBookings = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/20 capitalize">
            {status}
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20 capitalize">
            {status}
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/20 capitalize">
            {status}
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-400 px-3 py-1 rounded-full text-xs font-semibold border border-slate-500/20 capitalize">
            {status}
          </span>
        );
    }
  };

  const getEntryStatusBadge = (entryStatus) => {
    const formatted = entryStatus.replace(/_/g, ' ');
    switch (entryStatus) {
      case 'not_checked_in':
        return (
          <span className="bg-slate-700/50 text-slate-400 px-2.5 py-0.5 rounded text-xs border border-slate-700 capitalize">
            {formatted}
          </span>
        );
      case 'checked_in':
        return (
          <span className="bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded text-xs border border-orange-500/20 capitalize">
            {formatted}
          </span>
        );
      case 'checked_out':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded text-xs border border-emerald-500/20 capitalize">
            {formatted}
          </span>
        );
      default:
        return (
          <span className="bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded text-xs capitalize">
            {formatted}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-emerald-400" />
          <span>My Bookings</span>
        </h2>
        <p className="text-slate-400 mt-2">
          View your confirmed reservations, track entry/exit status, and generate digital QR passes.
        </p>
      </div>

      {/* Booking Cards Grid */}
      <div className="grid grid-cols-1 gap-6 max-w-3xl">
        {DUMMY_BOOKINGS.map((booking) => (
          <div key={booking.id} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4">
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-700/50 pb-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  Booking Reference
                </span>
                <span className="font-mono text-lg font-bold text-slate-200">{booking.bookingReference}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(booking.status)}
                {getEntryStatusBadge(booking.entryStatus)}
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="col-span-2 md:col-span-1 space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Parking Lot</span>
                <p className="font-semibold text-slate-300 flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-slate-500 inline" />
                  <span>{booking.parkingLotName}</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Slot Number</span>
                <p className="font-semibold text-slate-300">{booking.slotNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Vehicle Number</span>
                <p className="font-semibold text-slate-300">{booking.vehicleNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Date</span>
                <p className="font-semibold text-slate-300">{booking.date}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Time Slot</span>
                <p className="font-semibold text-slate-300 flex items-center space-x-1">
                  <span>{booking.startTime}</span>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                  <span>{booking.endTime}</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Total Amount</span>
                <p className="font-bold text-emerald-400 text-lg">${booking.totalAmount}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {booking.status === 'confirmed' && (
                <>
                  <button
                    onClick={() => console.log(`Viewing QR pass for booking: ${booking.bookingReference}`)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-lg transition-colors text-center text-sm"
                  >
                    View QR Pass
                  </button>
                  <button
                    onClick={() => console.log(`Requesting cancellation for booking: ${booking.bookingReference}`)}
                    className="flex-1 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-red-400 font-bold py-2 px-4 rounded-lg transition-colors text-center text-sm"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {booking.status === 'completed' && (
                <button
                  disabled
                  className="w-full bg-slate-900 border border-slate-800 text-slate-500 py-2 rounded-lg cursor-not-allowed text-sm font-semibold"
                >
                  Completed
                </button>
              )}
              {booking.status === 'cancelled' && (
                <button
                  disabled
                  className="w-full bg-slate-900 border border-slate-800 text-slate-600 py-2 rounded-lg cursor-not-allowed text-sm font-semibold"
                >
                  Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
export { MyBookings };
