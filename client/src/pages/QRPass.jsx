import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QrCode, Download, ArrowLeft } from 'lucide-react';

const DUMMY_BOOKING = {
  bookingReference: 'PIN-A9B8C7',
  parkingLotName: 'Downtown SafePark Hub',
  slotNumber: 'A-12',
  vehicleNumber: 'NY-99-C-1234',
  date: '2026-07-10',
  startTime: '10:00 AM',
  endTime: '02:00 PM',
  entryStatus: 'not_checked_in',
};

const QRPass = () => {
  const { bookingId } = useParams();

  const handleDownload = () => {
    console.log('Downloading QR Pass...');
    alert('Downloading QR Pass PDF/Image...');
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-6 max-w-md mx-auto">
      {/* Back link */}
      <div className="w-full text-left">
        <Link to="/my-bookings" className="text-emerald-400 hover:underline text-sm font-semibold inline-flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Bookings</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full text-center space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
            <QrCode className="h-6 w-6 text-emerald-400" />
            <span>Parking QR Pass</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Present this gate pass at parking terminal scanner.</p>
        </div>

        {/* QR Placeholder Box */}
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-inner flex items-center justify-center h-48 w-48">
            <div className="border-4 border-slate-900 h-full w-full flex flex-wrap p-2 gap-1 items-center justify-center bg-slate-100 text-slate-900 select-none">
              <QrCode className="h-24 w-24 stroke-[1.5]" />
              <span className="text-[10px] font-bold tracking-widest font-mono">GATE-PASS</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-400">Scan this QR at parking entry gate</p>
        </div>

        {/* Booking Details List */}
        <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-xl text-left space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-500 font-medium">Booking Ref</span>
            <span className="font-mono font-bold text-slate-200">{DUMMY_BOOKING.bookingReference}</span>
          </div>
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-500 font-medium">Parking Lot</span>
            <span className="font-semibold text-slate-200 text-right truncate max-w-[180px]">{DUMMY_BOOKING.parkingLotName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-500 font-medium">Slot Spot</span>
            <span className="font-bold text-blue-400">{DUMMY_BOOKING.slotNumber}</span>
          </div>
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-500 font-medium">Vehicle Reg</span>
            <span className="font-mono font-semibold text-slate-200">{DUMMY_BOOKING.vehicleNumber}</span>
          </div>
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-500 font-medium">Date & Time</span>
            <span className="text-slate-300 font-semibold text-right">
              {DUMMY_BOOKING.date} ({DUMMY_BOOKING.startTime} - {DUMMY_BOOKING.endTime})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Entry Status</span>
            <span className="bg-slate-700/50 text-slate-300 border border-slate-700 text-xs px-2 py-0.5 rounded capitalize font-semibold">
              {DUMMY_BOOKING.entryStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex-grow flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-slate-900 font-bold py-2.5 rounded-lg shadow-lg transition-colors text-sm"
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
