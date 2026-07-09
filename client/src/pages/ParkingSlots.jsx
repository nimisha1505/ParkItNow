import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Compass, MapPin, ShieldCheck, Ticket } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const DUMMY_LOT = {
  name: 'Downtown SafePark Hub',
  city: 'New York',
  area: 'Manhattan',
  pricePerHour: 12,
};

const DUMMY_SLOTS = [
  { _id: 's1', slotNumber: 'A1', status: 'available' },
  { _id: 's2', slotNumber: 'A2', status: 'occupied' },
  { _id: 's3', slotNumber: 'A3', status: 'reserved' },
  { _id: 's4', slotNumber: 'B1', status: 'available' },
  { _id: 's5', slotNumber: 'B2', status: 'maintenance' },
  { _id: 's6', slotNumber: 'B3', status: 'available' },
];

const ParkingSlots = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const [lot, setLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [formData, setFormData] = useState({
    vehicleId: '',
    startTime: '',
    endTime: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Parking Lot Details
      let fetchedLot = null;
      try {
        const lotRes = await axiosClient.get(`/parking-lots/${lotId}`);
        fetchedLot = lotRes.data.data;
        setLot(fetchedLot);
      } catch (err) {
        console.warn('Failed to fetch lot details from API, using fallback.');
      }

      // 2. Fetch slots from backend
      try {
        const slotsRes = await axiosClient.get('/parking-slots', {
          params: { parkingLotId: lotId },
        });
        setSlots(slotsRes.data.data || []);
      } catch (err) {
        console.warn('Failed to fetch slots from API, using fallback.');
        setSlots(DUMMY_SLOTS);
      }

      // 3. Fetch user's vehicles
      try {
        const vehiclesRes = await axiosClient.get('/vehicles');
        const userVehicles = vehiclesRes.data.data || [];
        setVehicles(userVehicles);
        if (userVehicles.length > 0) {
          setFormData((prev) => ({
            ...prev,
            vehicleId: userVehicles[0]._id || userVehicles[0].id || '',
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch vehicles from API.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while loading slot choices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lotId]);

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select a parking slot');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const slotId = selectedSlot._id || selectedSlot.id;
    const payload = {
      parkingLot: lotId,
      parkingSlot: slotId,
      vehicle: formData.vehicleId,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    try {
      await axiosClient.post('/bookings', payload);
      setSuccess(true);
      alert(`Booking confirmed for slot ${selectedSlot.slotNumber || selectedSlot.name}!`);
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking confirmation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  const getSlotColor = (slot) => {
    const isSelected = selectedSlot?._id === slot._id || selectedSlot?.id === slot.id;
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

  const currentLot = lot || DUMMY_LOT;

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

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Selected Lot details header */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div className="space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Selected Lot</span>
          <h3 className="text-xl font-bold text-slate-100">{currentLot.name}</h3>
          <p className="text-sm text-slate-400 flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
            <span>{currentLot.area || 'N/A'}, {currentLot.city || 'N/A'}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Price Rate</span>
          <span className="text-2xl font-extrabold text-blue-400">₹{currentLot.pricePerHour}</span>
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

          {loading && slots.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              No slots available in this parking lot.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {slots.map((slot) => {
                const slotId = slot._id || slot.id;
                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => handleSlotSelect(slot)}
                    disabled={slot.status !== 'available'}
                    className={`h-16 rounded-xl flex items-center justify-center text-lg font-semibold border transition-all ${getSlotColor(slot)}`}
                  >
                    {slot.slotNumber || slot.name}
                  </button>
                );
              })}
            </div>
          )}
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
                required
                disabled={loading}
                value={formData.vehicleId}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                {vehicles.length === 0 ? (
                  <option value="">No vehicles found. Register one first!</option>
                ) : (
                  vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.brand} {v.model} ({v.registrationNumber})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startTime"
                required
                disabled={loading}
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                name="endTime"
                required
                disabled={loading}
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            {/* Selected Slot Summary */}
            {selectedSlot ? (
              <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-lg space-y-1">
                <span className="text-slate-500 text-xs font-semibold uppercase">Selected Spot</span>
                <p className="text-lg font-bold text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Slot {selectedSlot.slotNumber || selectedSlot.name}</span>
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-700 p-4 rounded-lg text-center text-slate-500">
                Please select a slot from the layout grid.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedSlot || vehicles.length === 0}
              className={`w-full font-bold py-2.5 rounded-lg transition-colors text-center ${
                selectedSlot && vehicles.length > 0 && !loading
                  ? 'bg-blue-500 hover:bg-blue-600 text-slate-900 shadow-lg cursor-pointer'
                  : 'bg-slate-750 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlots;
export { ParkingSlots };
