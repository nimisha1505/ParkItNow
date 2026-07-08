import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        Welcome to <span className="text-emerald-500">ParkItNow</span>
      </h1>
      <p className="text-lg text-slate-400 max-w-md mb-8">
        Your smart urban parking reservation assistant. Find and reserve spots instantly.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/parking-lots"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
        >
          Explore Parking Lots
        </Link>
        <Link
          to="/login"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-lg shadow-lg border border-slate-700 transition-colors"
        >
          Login / Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
export { Home };
