import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, MapPin, ShieldCheck, Ticket } from 'lucide-react';

const DUMMY_LOT = {
  id: '1',
  name: 'Downtown SafePark Hub',
  city: 'New York',
  area: 'Manhattan',
  pricePerHour: 12,
};

const DUMMY_VEHICLES = [
  { id: 'v1', brand: 'Tesla', model: 'Model 3', reg: 'NY-99-C-1234' },
  { id: 'v2', brand: 'Yamaha', model: 'YZF-R3', reg: 'CA-55-B-5678' },
  { id: 'v3', brand: 'Nissan', model: 'Leaf', reg: 'WA-12-E-9012' },
];

const DUMMY_SLOTS = [
  { id: 's1', name: 'A1', status: 'available' },
  { id: 's2', name: 'A2', status: 'occupied' },
  { id: 's3', name: 'A3', status: 'reserved' },
  { id: 's4', name: 'B1', status: 'available' },
  { id: 's5', name: 'B2', status: 'maintenance' },
  { id: 's6', name: 'B3', status: 'available' },
  { id: 's7', name: 'C1', status: 'available' },
  { id: 's8', name: 'C2', status: 'occupied' },
];

const ParkingSlots = () => {
  const { lotId } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: DUMMY_VEHICLES[0]?.id || '',
    startTime: '',
    endTime: '',
  });

  const handleSlotSelect = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select a parking slot');
      return;
    }
    const bookingDetails = {
      lotId,
      lotName: DUMMY_LOT.name,
      pricePerHour: DUMMY_LOT.pricePerHour,
      selectedSlot: selectedSlot.name,
      ...formData,
    };
    console.log('Confirming booking details:', bookingDetails);
    alert(`Booking confirmed for slot ${selectedSlot.name}!`);
  };

  const getSlotColor = (slot) => {
    const isSelected = selectedSlot?.id === slot.id;
    if (isSelected) {
      return 'bg-emerald-500 text-slate-900 border-emerald-400 font-bold scale-105';
    }
    switch (slot.status) {
      case 'available':
        return 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700';
      case 'occupied':
        return 'bg-red-500/10 text-red-500 border-red-500/20 cursor-not-allowed opacity-60';
      case 'reserved':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20 cursor-not-allowed opacity-60';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 cursor-not-allowed opacity-60';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-10 py-4">
      {/* Back button and page heading */}
      <div className="space-y-4">
        <Link to="/parking-lots" className="text-emerald-400 hover:underline text-sm font-semibold inline-flex items-center space-x-1">
          &larr; Back to Parking Lots
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Compass className="h-8 w-8 text-emerald-400" />
            <span>Choose Your Parking Slot</span>
          </h2>
          <p className="text-slate-400 mt-2">
            Select an available parking spot in the lot layout below.
          </p>
        </div>
      </div>

      {/* Dummy parking lot info */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Selected Lot</span>
          <h3 className="text-xl font-bold text-slate-100">{DUMMY_LOT.name}</h3>
          <p className="text-sm text-slate-400 flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span>{DUMMY_LOT.area}, {DUMMY_LOT.city}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Price Rate</span>
          <span className="text-2xl font-extrabold text-blue-400">${DUMMY_LOT.pricePerHour}</span>
          <span className="text-xs text-slate-400"> / hr</span>
        </div>
      </div>

      {/* Main split grid: Slots layout vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Slot Selection Grid */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-100">Lot Slot Layout Map</h3>
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-slate-800 border border-slate-700"></div><span>Available</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-blue-500/10 border border-blue-500/20"></div><span>Reserved</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-red-500/10 border border-red-500/20"></div><span>Occupied</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-yellow-500/10 border border-yellow-500/20"></div><span>Maintenance</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-emerald-500 border border-emerald-400"></div><span>Selected</span></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {DUMMY_SLOTS.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                disabled={slot.status !== 'available'}
                className={`h-16 rounded-xl flex items-center justify-center text-lg font-semibold border transition-all ${getSlotColor(slot)}`}
              >
                {slot.name}
              </button>
            ))}
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-700 pb-4">
            <Ticket className="h-5 w-5 text-emerald-400" />
            <span>Booking Details</span>
          </h3>

          <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Select Vehicle</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {DUMMY_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.reg})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Selected Slot Summary */}
            {selectedSlot ? (
              <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-lg space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Selected Spot</span>
                <p className="text-lg font-bold text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Slot {selectedSlot.name}</span>
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-700 p-4 rounded-lg text-center text-slate-500">
                Please select a slot from the layout grid.
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedSlot}
              className={`w-full font-bold py-2.5 rounded-lg transition-colors text-center ${
                selectedSlot
                  ? 'bg-blue-500 hover:bg-blue-600 text-slate-900 shadow-lg'
                  : 'bg-slate-750 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlots;
export { ParkingSlots };
