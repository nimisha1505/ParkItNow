import React from 'react';

const ParkingLots = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-slate-100">
        Available Parking Lots
      </h2>
      <p className="text-slate-400 mb-8">
        Browse smart parking lots across cities. API integration and dynamic spot tracking coming soon.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
            <div className="h-40 bg-slate-700 rounded-lg mb-4 flex items-center justify-center text-slate-400">
              Map View Placeholder
            </div>
            <h3 className="text-xl font-semibold mb-2">Metro Parking Hub {num}</h3>
            <p className="text-sm text-slate-400 mb-4">Downtown, Sector 5</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-emerald-400 font-semibold">$5.00 / hr</span>
              <span className="text-slate-400">12 slots available</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingLots;
export { ParkingLots };
