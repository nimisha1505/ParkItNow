import React, { useState } from 'react';
import { QrCode, CheckCircle, MapPin, User, LogIn, LogOut } from 'lucide-react';

const DUMMY_VERIFIED_BOOKING = {
  bookingReference: 'PIN-A9B8C7',
  userName: 'John Doe',
  parkingLot: 'Downtown SafePark Hub',
  slotNumber: 'A-12',
  vehicleNumber: 'NY-99-C-1234',
  startTime: '10:00 AM',
  endTime: '02:00 PM',
  entryStatus: 'not_checked_in',
};

const AdminQRVerify = () => {
  const [token, setToken] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    console.log('Verifying QR token:', token);
    if (token.trim().toUpperCase() === 'PIN-A9B8C7') {
      setVerifiedBooking(DUMMY_VERIFIED_BOOKING);
    } else {
      alert('Invalid QR token / Booking Reference. Try entering PIN-A9B8C7');
    }
  };

  const handleCheckIn = () => {
    console.log('Admin Action: Check-in confirmed for booking reference:', verifiedBooking.bookingReference);
    setVerifiedBooking((prev) => ({ ...prev, entryStatus: 'checked_in' }));
    alert('Vehicle checked in successfully!');
  };

  const handleCheckOut = () => {
    console.log('Admin Action: Check-out confirmed for booking reference:', verifiedBooking.bookingReference);
    setVerifiedBooking((prev) => ({ ...prev, entryStatus: 'checked_out' }));
    alert('Vehicle checked out successfully!');
  };

  return (
    <div className="space-y-8 py-4 max-w-xl mx-auto">
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

      {/* Verification Card Form */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter Booking Ref / Token (e.g. PIN-A9B8C7)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="PIN-XXXXXX"
                className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 uppercase font-mono font-bold"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors shadow-md"
              >
                Verify QR
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Verified Details Card */}
      {verifiedBooking && (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl space-y-6">
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
              <span className="text-slate-500 text-xs font-semibold uppercase">User Name</span>
              <p className="font-semibold text-slate-300 flex items-center space-x-1">
                <User className="h-4 w-4 text-slate-500" />
                <span>{verifiedBooking.userName}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Parking Lot</span>
              <p className="font-semibold text-slate-300 flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{verifiedBooking.parkingLot}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Slot Number</span>
              <p className="font-semibold text-blue-400">{verifiedBooking.slotNumber}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Vehicle Number</span>
              <p className="font-mono font-semibold text-slate-300">{verifiedBooking.vehicleNumber}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Time Range</span>
              <p className="font-semibold text-slate-300">
                {verifiedBooking.startTime} - {verifiedBooking.endTime}
              </p>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-slate-500 text-xs font-semibold uppercase">Current Entry Status</span>
              <div>
                <span className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-bold capitalize">
                  {verifiedBooking.entryStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2 border-t border-slate-700">
            <button
              onClick={handleCheckIn}
              disabled={verifiedBooking.entryStatus === 'checked_in'}
              className={`flex-1 flex items-center justify-center space-x-2 font-bold py-2.5 rounded-lg transition-colors text-sm ${
                verifiedBooking.entryStatus === 'checked_in'
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-md'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Check In</span>
            </button>
            <button
              onClick={handleCheckOut}
              disabled={verifiedBooking.entryStatus === 'checked_out' || verifiedBooking.entryStatus === 'not_checked_in'}
              className={`flex-1 flex items-center justify-center space-x-2 font-bold py-2.5 rounded-lg transition-colors text-sm ${
                verifiedBooking.entryStatus === 'checked_out' || verifiedBooking.entryStatus === 'not_checked_in'
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-slate-900 shadow-md'
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
