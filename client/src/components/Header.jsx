import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            ParkItNow
          </span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link to="/parking-lots" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Parking Lots
          </Link>
          <Link to="/my-bookings" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            My Bookings
          </Link>
          <Link to="/vehicles" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Vehicles
          </Link>
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            Register
          </Link>
          <Link to="/admin" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
export { Header };
