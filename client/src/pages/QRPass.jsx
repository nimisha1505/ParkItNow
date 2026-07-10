import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QrCode, Download, ArrowLeft, ShieldAlert } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const QRPass = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPassDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch booking details
      const detailsRes = await axiosClient.get(`/bookings/${bookingId}`);
      setBooking(detailsRes.data.data);
    } catch (err) {
      console.error('Booking fetch failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const qrRes = await axiosClient.post(`/bookings/${bookingId}/qr-pass`);
      setQrCode(qrRes.data.data.qrCode);
    } catch (err) {
      console.error('QR pass generation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate parking QR pass.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassDetails();
  }, [bookingId]);

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `Parking_QRPass_${booking?.bookingReference || 'Pass'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="flex flex-col items-center justify-center py-4 space-y-6 max-w-md mx-auto animate-fade-in">
      {/* Back link */}
      <div className="w-full text-left">
        <Link to="/my-bookings" className="text-emerald-400 hover:underline text-sm font-semibold inline-flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Bookings</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-405 text-red-400 p-4 rounded-xl text-sm flex gap-2 items-center w-full">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full text-center space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
            <QrCode className="h-6 w-6 text-emerald-400" />
            <span>Parking QR Pass</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Present this gate pass at parking terminal scanner.</p>
        </div>

        {/* QR Box */}
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl flex flex-col items-center justify-center space-y-4 min-h-[260px]">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          ) : qrCode ? (
            <>
              <div className="bg-white p-3 rounded-lg shadow-inner flex items-center justify-center h-48 w-48">
                <img src={qrCode} alt="Parking Lot QR Pass" className="h-full w-full object-contain" />
              </div>
              <p className="text-sm font-semibold text-emerald-400">Scan this QR at parking entry gate</p>
            </>
          ) : (
            <button
              onClick={handleGenerateQR}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-sm"
            >
              <QrCode className="w-5 h-5" />
              <span>Generate QR Pass</span>
            </button>
          )}
        </div>

        {/* Booking Details List */}
        {booking && (
          <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-xl text-left space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-500 font-medium">Booking Ref</span>
              <span className="font-mono font-bold text-slate-200">{booking.bookingReference}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-500 font-medium">Parking Lot</span>
              <span className="font-semibold text-slate-200 text-right truncate max-w-[180px]">
                {booking.parkingLot?.name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-500 font-medium">Slot Spot</span>
              <span className="font-bold text-blue-400">{booking.parkingSlot?.slotNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-500 font-medium">Vehicle Reg</span>
              <span className="font-mono font-semibold text-slate-200">{booking.vehicle?.registrationNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-500 font-medium">Date</span>
              <span className="text-slate-300 font-semibold">{formatDate(booking.startTime)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-500 font-medium">Time Slot</span>
              <span className="text-slate-300 font-semibold text-right">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Entry Status</span>
              <span className="bg-slate-700/50 text-slate-300 border border-slate-700 text-xs px-2 py-0.5 rounded capitalize font-semibold">
                {(booking.entryStatus || 'not_checked_in').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={!qrCode}
            className={`flex-grow flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-slate-900 font-bold py-2.5 rounded-lg shadow-lg transition-colors text-sm ${
              !qrCode ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Download Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPass;
export { QRPass };
