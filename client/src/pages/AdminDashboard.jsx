import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-slate-100">
        Admin Dashboard
      </h2>
      <p className="text-slate-400 mb-8">
        Manage parking hubs, verify passes, and monitor occupancy. Charts and management tables coming soon.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
          <div className="text-slate-400 text-sm font-semibold mb-1">Total Parking Lots</div>
          <div className="text-3xl font-bold text-blue-400">0</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
          <div className="text-slate-400 text-sm font-semibold mb-1">Active Bookings</div>
          <div className="text-3xl font-bold text-emerald-400">0</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
          <div className="text-slate-400 text-sm font-semibold mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-yellow-400">$0.00</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
export { AdminDashboard };
