import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, QrCode, LayoutDashboard, Car, Calendar, Ticket } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Smart Parking for{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Urban Mobility
          </span>
        </h1>
        <p className="text-lg text-slate-400">
          Find, reserve, and manage your parking slot instantly. Skip the queue with our secure QR-based check-in passes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/parking-lots"
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-6 py-3 rounded-lg shadow-lg transition-colors"
          >
            <Compass className="h-5 w-5" />
            <span>Find Parking</span>
          </Link>
          <Link
            to="/my-bookings"
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-lg shadow-lg border border-slate-700 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span>View My Bookings</span>
          </Link>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Platform Features</h2>
          <p className="text-slate-400 mt-2">Designed for modern drivers and operators.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Real-time Slot Availability */}
          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors space-y-4">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg w-fit">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Real-time Availability</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Check live status updates for parking lot spots and reserve your space before you arrive.
            </p>
          </div>

          {/* Card 2: QR-based Entry Pass */}
          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors space-y-4">
            <div className="bg-blue-500/10 text-blue-400 p-3 rounded-lg w-fit">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">QR Entry Passes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Quick and contactless check-in/check-out. Scan your secure ticket pass at the parking gate.
            </p>
          </div>

          {/* Card 3: Admin Parking Dashboard */}
          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors space-y-4">
            <div className="bg-purple-500/10 text-purple-400 p-3 rounded-lg w-fit">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Admin Dashboard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Manage lots, parking slot assignments, and analyze occupancy and revenue metrics in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
          <p className="text-slate-400 mt-2">Get parking in three simple steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex items-center justify-center bg-slate-800 text-emerald-400 h-16 w-16 rounded-full border border-slate-700 shadow-md">
              <Car className="h-8 w-8" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">1</span>
            </div>
            <h4 className="font-bold text-lg">Add Your Vehicle</h4>
            <p className="text-slate-400 text-sm">Save your vehicle specifications for quick filtering and slot assignment.</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex items-center justify-center bg-slate-800 text-emerald-400 h-16 w-16 rounded-full border border-slate-700 shadow-md">
              <Compass className="h-8 w-8" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">2</span>
            </div>
            <h4 className="font-bold text-lg">Choose Lot & Slot</h4>
            <p className="text-slate-400 text-sm">Filter parking hubs by city, area, price range, and vehicle compatibility.</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex items-center justify-center bg-slate-800 text-emerald-400 h-16 w-16 rounded-full border border-slate-700 shadow-md">
              <Ticket className="h-8 w-8" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">3</span>
            </div>
            <h4 className="font-bold text-lg">Book & Use QR</h4>
            <p className="text-slate-400 text-sm">Instantly reserve your spot and obtain a secure QR pass for check-in.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
export { Home };
