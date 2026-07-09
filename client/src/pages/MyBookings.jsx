import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, ShieldAlert } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const DUMMY_BOOKINGS = [
  {
    _id: '1',
    bookingReference: 'PIN-A9B8C7',
    parkingLot: { name: 'Downtown SafePark Hub' },
    parkingSlot: { slotNumber: 'A-12' },
    vehicle: { registrationNumber: 'NY-99-C-1234' },
    startTime: '2026-07-10T10:00:00.000Z',
    endTime: '2026-07-10T14:00:00.000Z',
    totalAmount: 48,
    status: 'confirmed',
    entryStatus: 'not_checked_in',
  },
  {
    _id: '2',
    bookingReference: 'PIN-X2Y3Z4',
    parkingLot: { name: 'Westside Commuter Lot' },
    parkingSlot: { slotNumber: 'B-04' },
    vehicle: { registrationNumber: 'CA-55-S-8765' },
    startTime: '2026-07-08T08:00:00.000Z',
    endTime: '2026-07-08T17:00:00.000Z',
    totalAmount: 72,
    status: 'completed',
    entryStatus: 'checked_out',
  },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/bookings/my-bookings');
      setBookings(response.data.data || []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings.');
      setBookings(DUMMY_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id, ref) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    setError(null);
    try {
      await axiosClient.patch(`/bookings/${id}/cancel`);
      alert(`Booking ${ref} cancelled successfully!`);
      await fetchBookings();
    } catch (err) {
      console.error('Cancel booking failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to cancel booking.');
    }
  };

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

  const getEntryStatusBadge = (entryStatus = 'not_checked_in') => {
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

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error} (Using fallback display)</span>
        </div>
      )}

      {/* Booking Cards Grid */}
      {loading && bookings.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center text-slate-400 max-w-3xl">
          No bookings found. Head to 'Parking Lots' to secure a spot!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-3xl">
          {bookings.map((booking) => {
            const bookingId = booking._id || booking.id;
            return (
              <div key={bookingId} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4">
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
                      <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{booking.parkingLot?.name || 'N/A'}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs font-semibold uppercase">Slot Number</span>
                    <p className="font-semibold text-slate-300">{booking.parkingSlot?.slotNumber || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs font-semibold uppercase">Vehicle Number</span>
                    <p className="font-semibold text-slate-350">{booking.vehicle?.registrationNumber || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs font-semibold uppercase">Date</span>
                    <p className="font-semibold text-slate-300">{formatDate(booking.startTime)}</p>
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <span className="text-slate-500 text-xs font-semibold uppercase">Time Slot</span>
                    <p className="font-semibold text-slate-300 flex items-center space-x-1.5">
                      <span>{formatTime(booking.startTime)}</span>
                      <ArrowRight className="h-3 w-3 text-slate-500" />
                      <span>{formatTime(booking.endTime)}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs font-semibold uppercase">Total Amount</span>
                    <p className="font-bold text-emerald-400 text-lg">₹{booking.totalAmount}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => navigate(`/bookings/${bookingId}/qr-pass`)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-lg transition-colors text-center text-sm"
                      >
                        View QR Pass
                      </button>
                      <button
                        onClick={() => handleCancelBooking(bookingId, booking.bookingReference)}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
export { MyBookings };
