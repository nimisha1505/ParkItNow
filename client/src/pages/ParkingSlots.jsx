import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Compass, MapPin, ShieldCheck, Ticket, Navigation, ArrowUp, ArrowDown } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const DUMMY_LOT = {
  name: 'Downtown SafePark Hub',
  city: 'New York',
  area: 'Manhattan',
  pricePerHour: 12,
};

const DUMMY_SLOTS = [
  { _id: 's1', slotNumber: 'A1', floor: 'Ground', section: 'Sec A', status: 'available' },
  { _id: 's2', slotNumber: 'A2', floor: 'Ground', section: 'Sec A', status: 'occupied' },
  { _id: 's3', slotNumber: 'A3', floor: 'Ground', section: 'Sec A', status: 'reserved' },
  { _id: 's4', slotNumber: 'B1', floor: 'Ground', section: 'Sec B', status: 'available' },
  { _id: 's5', slotNumber: 'B2', floor: 'Ground', section: 'Sec B', status: 'maintenance' },
  { _id: 's6', slotNumber: 'B3', floor: 'Ground', section: 'Sec B', status: 'available' },
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

  const handleGetDirections = (targetLot) => {
    if (!targetLot) return;
    let url = '';
    if (targetLot.coordinates && targetLot.coordinates.lat && targetLot.coordinates.lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${targetLot.coordinates.lat},${targetLot.coordinates.lng}`;
    } else {
      const query = encodeURIComponent(`${targetLot.name}, ${targetLot.area || ''}, ${targetLot.city}`);
      url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    }
    window.open(url, '_blank');
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
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-400 font-bold scale-[1.02] shadow-emerald-500/10 shadow-lg';
    }
    const status = slot.status || 'available';
    switch (status) {
      case 'available':
        return 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer';
      case 'occupied':
        return 'bg-red-500/5 text-red-500 border-red-500/25 cursor-not-allowed opacity-70';
      case 'reserved':
        return 'bg-amber-500/5 text-amber-500 border-amber-500/25 cursor-not-allowed opacity-70';
      case 'maintenance':
        return 'bg-slate-800/40 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-50';
      default:
        return 'bg-slate-900 text-slate-455 border-slate-800';
    }
  };

  const getPricePreview = () => {
    if (!formData.startTime || !formData.endTime) {
      return (
        <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-lg text-slate-500 text-xs text-center">
          Select a valid start and end time to preview price.
        </div>
      );
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const diffMs = end - start;

    if (isNaN(diffMs) || diffMs <= 0) {
      return (
        <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-lg text-slate-500 text-xs text-center">
          Select a valid start and end time to preview price.
        </div>
      );
    }

    const durationHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const selectedVehicleObj = vehicles.find((v) => v._id === formData.vehicleId || v.id === formData.vehicleId);
    const vehicleType = selectedVehicleObj?.type || 'car';
    let category = '';
    if (['bike', 'scooter'].includes(vehicleType)) {
      category = 'twoWheeler';
    } else if (['car', 'ev'].includes(vehicleType)) {
      category = 'fourWheeler';
    }

    let rate = currentLot.pricePerHour;
    if (category && currentLot.pricePerHourByVehicleCategory?.[category]) {
      rate = currentLot.pricePerHourByVehicleCategory[category];
    }

    const estimatedAmount = durationHours * rate;

    return (
      <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-lg space-y-2 text-xs animate-fade-in">
        <span className="text-slate-500 font-semibold uppercase block mb-1">Price Preview</span>
        <div className="space-y-1 text-slate-300">
          <div className="flex justify-between">
            <span>Selected Vehicle Type:</span>
            <span className="font-bold text-slate-200 capitalize">{vehicleType}</span>
          </div>
          <div className="flex justify-between">
            <span>Vehicle Category:</span>
            <span className="font-bold text-slate-200">{category === 'twoWheeler' ? '2-Wheeler' : '4-Wheeler'}</span>
          </div>
          <div className="flex justify-between">
            <span>Hourly Rate:</span>
            <span className="font-bold text-slate-200">₹{rate}/hr</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-bold text-slate-200">{durationHours} hr{durationHours > 1 ? 's' : ''}</span>
          </div>
          <div className="border-t border-slate-700 pt-1.5 flex justify-between text-sm">
            <span className="font-semibold text-slate-200">Estimated Amount:</span>
            <span className="font-extrabold text-emerald-450 text-base">₹{estimatedAmount}</span>
          </div>
        </div>
      </div>
    );
  };

  const currentLot = lot || DUMMY_LOT;

  // Group slots by Floor
  const slotsByFloor = slots.reduce((acc, slot) => {
    const floor = slot.floor || 'Ground Floor';
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(slot);
    return acc;
  }, {});

  const totalSlotsCount = slots.length;
  const availableCount = slots.filter((s) => (s.status || 'available') === 'available').length;
  const reservedCount = slots.filter((s) => s.status === 'reserved').length;
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length;
  const maintenanceCount = slots.filter((s) => s.status === 'maintenance').length;

  const renderSlotButton = (slot) => {
    const slotId = slot._id || slot.id;
    const status = slot.status || 'available';
    return (
      <button
        key={slotId}
        type="button"
        onClick={() => handleSlotSelect(slot)}
        disabled={status !== 'available'}
        className={`w-full py-4 rounded-lg flex flex-col items-center justify-center border transition-all text-center relative overflow-hidden ${getSlotColor(slot)}`}
      >
        <span className="text-sm font-extrabold tracking-wider">{slot.slotNumber}</span>
        <span className="text-[9px] uppercase font-bold opacity-60 mt-0.5">{slot.section || 'General'}</span>
      </button>
    );
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
          <div className="pt-2 text-xs flex flex-wrap gap-4 text-slate-400">
            <span>2-Wheeler: <strong className="text-slate-200">₹{currentLot.pricePerHourByVehicleCategory?.twoWheeler || Math.round(currentLot.pricePerHour * 0.4)}</strong>/hr</span>
            <span>4-Wheeler: <strong className="text-slate-200">₹{currentLot.pricePerHourByVehicleCategory?.fourWheeler || currentLot.pricePerHour}</strong>/hr</span>
            {currentLot.evCharging?.available && (
              <span className="text-emerald-400 font-medium">⚡ EV Charging: <strong className="text-emerald-350">₹{currentLot.evCharging.pricePerHour}</strong>/hr ({currentLot.evCharging.connectorTypes?.join(', ') || 'N/A'})</span>
            )}
          </div>
          <div className="pt-2">
            <button
              onClick={() => handleGetDirections(currentLot)}
              className="bg-slate-900 hover:bg-slate-750 border border-slate-700 text-slate-355 font-bold px-3.5 py-1.5 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Price Rate</span>
          <span className="text-2xl font-extrabold text-blue-400">
            ₹{
              (() => {
                const selectedVehicleObj = vehicles.find((v) => v._id === formData.vehicleId || v.id === formData.vehicleId);
                const type = selectedVehicleObj?.type || 'car';
                let cat = '';
                if (['bike', 'scooter'].includes(type)) {
                  cat = 'twoWheeler';
                } else if (['car', 'ev'].includes(type)) {
                  cat = 'fourWheeler';
                }
                if (cat && currentLot.pricePerHourByVehicleCategory?.[cat]) {
                  return currentLot.pricePerHourByVehicleCategory[cat];
                }
                return currentLot.pricePerHour;
              })()
            }
          </span>
          <span className="text-xs text-slate-400"> / hr</span>
          <span className="text-[10px] text-slate-500 block uppercase font-bold">
            ({
              (() => {
                const selectedVehicleObj = vehicles.find((v) => v._id === formData.vehicleId || v.id === formData.vehicleId);
                const type = selectedVehicleObj?.type || 'car';
                let cat = '';
                if (['bike', 'scooter'].includes(type)) {
                  cat = 'twoWheeler';
                } else if (['car', 'ev'].includes(type)) {
                  cat = 'fourWheeler';
                }
                return cat === 'twoWheeler' ? '2-Wheeler' : '4-Wheeler';
              })()
            } Rate)
          </span>
        </div>
      </div>

      {/* Main split grid: Slots layout vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Slot Selection Grid */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-100">Lot Slot Layout Map</h3>
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-slate-900 border border-emerald-500/30"></div><span>Available</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-emerald-500/20 border border-emerald-400"></div><span>Selected</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-amber-500/5 border border-amber-500/20"></div><span>Reserved</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-red-500/5 border border-red-500/20"></div><span>Occupied</span></div>
              <div className="flex items-center space-x-1.5"><div className="h-3 w-3 rounded bg-slate-800/40 border border-slate-700/50"></div><span>Maintenance</span></div>
            </div>
          </div>

          {/* Slot Count Summary */}
          {slots.length > 0 && (
            <div className="grid grid-cols-5 gap-2 text-center bg-slate-900/40 p-4 rounded-xl border border-slate-700/40 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold uppercase tracking-wider block">Total Slots</span>
                <span className="text-sm font-bold text-slate-100">{totalSlotsCount}</span>
              </div>
              <div className="space-y-1">
                <span className="text-emerald-400 font-semibold uppercase tracking-wider block">Available</span>
                <span className="text-sm font-bold text-emerald-400">{availableCount}</span>
              </div>
              <div className="space-y-1">
                <span className="text-amber-450 font-semibold uppercase tracking-wider block">Reserved</span>
                <span className="text-sm font-bold text-amber-450">{reservedCount}</span>
              </div>
              <div className="space-y-1">
                <span className="text-red-400 font-semibold uppercase tracking-wider block">Occupied</span>
                <span className="text-sm font-bold text-red-400">{occupiedCount}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Maint.</span>
                <span className="text-sm font-bold text-slate-350">{maintenanceCount}</span>
              </div>
            </div>
          )}

          {loading && slots.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              No slots found for this parking lot.
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(slotsByFloor).map(([floorName, floorSlots]) => {
                // Split floor slots into left side and right side
                const leftSlots = floorSlots.filter((_, idx) => idx % 2 === 0);
                const rightSlots = floorSlots.filter((_, idx) => idx % 2 !== 0);

                return (
                  <div key={floorName} className="space-y-4 border border-slate-700/50 p-5 rounded-xl bg-slate-900/20 shadow-inner">
                    <h4 className="text-sm font-bold text-slate-350 uppercase tracking-widest flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                      <span>{floorName}</span>
                    </h4>

                    <div className="relative border border-slate-700/60 rounded-xl overflow-hidden bg-slate-900/65 p-4 space-y-4">
                      {/* Entry Gate at top */}
                      <div className="flex justify-center items-center gap-2 py-1.5 bg-slate-900 border border-dashed border-slate-750 text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest rounded-lg">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>Entry Gate</span>
                      </div>

                      {/* Main Parking Grid */}
                      <div className="grid grid-cols-5 gap-2 items-stretch">
                        {/* Left Side Slots */}
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                          {leftSlots.map((slot) => renderSlotButton(slot))}
                        </div>

                        {/* Drive Lane in Center */}
                        <div className="col-span-1 border-l-2 border-r-2 border-dashed border-slate-700 flex flex-col justify-between items-center py-6 text-center select-none bg-slate-900/40 relative">
                          <div className="absolute inset-y-0 w-0 border-l border-dashed border-slate-700 left-1/2"></div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest my-auto block whitespace-nowrap rotate-90 transform">
                            🚗 DRIVE LANE 🚗
                          </span>
                        </div>

                        {/* Right Side Slots */}
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                          {rightSlots.map((slot) => renderSlotButton(slot))}
                        </div>
                      </div>

                      {/* Exit Gate at bottom */}
                      <div className="flex justify-center items-center gap-2 py-1.5 bg-slate-900 border border-dashed border-slate-750 text-[10px] font-extrabold text-red-400 uppercase tracking-widest rounded-lg">
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span>Exit Gate</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Form Card */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
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

              {/* Selected Slot Summary Panel */}
              {selectedSlot ? (
                <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-lg space-y-2 animate-fade-in text-xs">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Selected Spot Summary
                  </span>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>Slot Number:</span>
                      <strong className="text-slate-100">{selectedSlot.slotNumber || selectedSlot.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Floor Level:</span>
                      <span className="text-slate-205 capitalize">{selectedSlot.floor || 'Ground'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Section / Zone:</span>
                      <span className="text-slate-205 capitalize">{selectedSlot.section || 'General'}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1">
                      <span>Supported Vehicles:</span>
                      <span className="text-slate-205 uppercase font-semibold">
                        {selectedSlot.supportedVehicleTypes?.join(', ') || 'All'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slot Status:</span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase text-[9px] font-bold">
                        {selectedSlot.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-dashed border-slate-700 p-4 rounded-lg text-center text-slate-500 text-xs">
                  Please select an available slot from the layout grid.
                </div>
              )}

              {/* Pricing Preview */}
              {getPricePreview()}

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
    </div>
  );
};

export default ParkingSlots;
export { ParkingSlots };
