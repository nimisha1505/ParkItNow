import React, { useState } from 'react';
import { QrCode, CheckCircle, MapPin, User, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const AdminQRVerify = () => {
  const [token, setToken] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setVerifiedBooking(null);

    let bookingReference = '';
    let qrToken = '';

    const cleanedToken = token.trim();
    if (cleanedToken.startsWith('{') && cleanedToken.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleanedToken);
        bookingReference = parsed.bookingReference;
        qrToken = parsed.qrToken;
      } catch (err) {
        setError('Invalid JSON payload in token');
        setLoading(false);
        return;
      }
    } else {
      bookingReference = cleanedToken;
      qrToken = 'dummy-token';
    }

    try {
      const response = await axiosClient.post('/qr/verify', {
        bookingReference,
        qrToken,
      });
      setVerifiedBooking({
        ...response.data.data,
        qrToken,
        bookingReference,
      });
      setSuccess('QR Pass verified successfully!');
    } catch (err) {
      console.error('Verify error:', err);
      setError(err.response?.data?.message || err.message || 'QR Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!verifiedBooking) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axiosClient.post('/qr/check-in', {
        bookingReference: verifiedBooking.bookingReference,
        qrToken: verifiedBooking.qrToken,
      });
      setVerifiedBooking((prev) => ({
        ...prev,
        entryStatus: response.data.data.entryStatus,
      }));
      setSuccess('Vehicle checked in successfully!');
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.response?.data?.message || err.message || 'Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!verifiedBooking) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axiosClient.post('/qr/check-out', {
        bookingReference: verifiedBooking.bookingReference,
        qrToken: verifiedBooking.qrToken,
      });
      setVerifiedBooking((prev) => ({
        ...prev,
        entryStatus: response.data.data.entryStatus,
      }));
      setSuccess('Vehicle checked out successfully!');
    } catch (err) {
      console.error('Check-out error:', err);
      setError(err.response?.data?.message || err.message || 'Check-out failed.');
    } finally {
      setLoading(false);
    }
  };

  const lotName = verifiedBooking
    ? (typeof verifiedBooking.parkingLot === 'object' ? verifiedBooking.parkingLot?.name : verifiedBooking.parkingLot)
    : '';

  const slotNumber = verifiedBooking
    ? (typeof verifiedBooking.parkingSlot === 'object' ? verifiedBooking.parkingSlot?.slotNumber : verifiedBooking.slotNumber)
    : '';

  const vehicleNumber = verifiedBooking
    ? (typeof verifiedBooking.vehicle === 'object' ? verifiedBooking.vehicle?.registrationNumber : verifiedBooking.vehicleNumber)
    : '';

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
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
    <div className="space-y-8 py-4 max-w-xl mx-auto animate-fade-in">
      {/* Page Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
          <QrCode className="h-8 w-8 text-emerald-400" />
          <span>QR Verification</span>
        </h2>
        <p className="text-slate-400 mt-2">
          Scan or input booking pass token to verify vehicle reservations at the gate terminal.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Verification Card Form */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter Booking Ref / Scan JSON Payload
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                disabled={loading}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder='e.g. {"bookingReference":"PIN-...", "qrToken":"..."}'
                className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono font-bold text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors shadow-md disabled:opacity-55"
              >
                {loading ? 'Verifying...' : 'Verify QR'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Verified Details Card */}
      {verifiedBooking && (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center space-x-2 border-b border-slate-700 pb-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Verification Result</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Booking Ref</span>
              <p className="font-mono font-bold text-slate-200">{verifiedBooking.bookingReference}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Parking Lot</span>
              <p className="font-semibold text-slate-300 flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{lotName || 'N/A'}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Slot Number</span>
              <p className="font-semibold text-blue-400">{slotNumber || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Vehicle Number</span>
              <p className="font-mono font-semibold text-slate-300">{vehicleNumber || 'N/A'}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-slate-500 text-xs font-semibold uppercase">Time Slot Range</span>
              <p className="font-semibold text-slate-300">
                {formatDate(verifiedBooking.startTime)} ({formatTime(verifiedBooking.startTime)} - {formatTime(verifiedBooking.endTime)})
              </p>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Current Entry Status</span>
              <div>
                <span className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-bold capitalize">
                  {(verifiedBooking.entryStatus || 'not_checked_in').replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2 border-t border-slate-700">
            <button
              onClick={handleCheckIn}
              disabled={loading || verifiedBooking.entryStatus === 'checked_in' || verifiedBooking.entryStatus === 'checked_out'}
              className={`flex-1 flex items-center justify-center space-x-2 font-bold py-2.5 rounded-lg transition-colors text-sm ${
                verifiedBooking.entryStatus === 'checked_in' || verifiedBooking.entryStatus === 'checked_out'
                  ? 'bg-slate-750 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-md cursor-pointer'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Check In</span>
            </button>
            <button
              onClick={handleCheckOut}
              disabled={loading || verifiedBooking.entryStatus === 'checked_out' || verifiedBooking.entryStatus === 'not_checked_in'}
              className={`flex-1 flex items-center justify-center space-x-2 font-bold py-2.5 rounded-lg transition-colors text-sm ${
                verifiedBooking.entryStatus === 'checked_out' || verifiedBooking.entryStatus === 'not_checked_in'
                  ? 'bg-slate-750 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-blue-500 hover:bg-blue-600 text-slate-900 shadow-md cursor-pointer'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Check Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQRVerify;
export { AdminQRVerify };
