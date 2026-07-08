import React from 'react';

const MyBookings = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-slate-100">
        My Reservations
      </h2>
      <p className="text-slate-400 mb-8">
        Manage your active and past parking slots reservations. Log in to view your real bookings.
      </p>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
        No active bookings found. Please log in to reserve a parking slot.
      </div>
    </div>
  );
};

export default MyBookings;
export { MyBookings };
