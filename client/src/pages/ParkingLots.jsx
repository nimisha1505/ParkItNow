import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, MapPin } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const DUMMY_LOTS = [
  {
    _id: '1',
    name: 'Downtown SafePark Hub',
    city: 'New York',
    area: 'Manhattan',
    pricePerHour: 12,
    availableSlots: 24,
    supportedVehicleTypes: ['car', 'ev'],
    amenities: ['CCTV', 'EV Charger', 'Valet'],
  },
  {
    _id: '2',
    name: 'Westside Commuter Lot',
    city: 'San Francisco',
    area: 'SOMA',
    pricePerHour: 8,
    availableSlots: 15,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', 'Covered'],
  },
  {
    _id: '3',
    name: 'Express Transit Parking',
    city: 'Chicago',
    area: 'Loop',
    pricePerHour: 10,
    availableSlots: 4,
    supportedVehicleTypes: ['car', 'ev', 'bike'],
    amenities: ['CCTV', 'EV Charger', '24/7 Access'],
  },
  {
    _id: '4',
    name: 'Greenway Smart Station',
    city: 'Seattle',
    area: 'Capitol Hill',
    pricePerHour: 6,
    availableSlots: 42,
    supportedVehicleTypes: ['car', 'scooter', 'ev'],
    amenities: ['CCTV', 'EV Charger', 'Restrooms'],
  },
];

const ParkingLots = () => {
  const navigate = useNavigate();
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    city: '',
    area: '',
    vehicleType: '',
    maxPrice: '',
  });

  const fetchLots = async (searchFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchFilters.city) params.city = searchFilters.city;
      if (searchFilters.area) params.area = searchFilters.area;
      if (searchFilters.vehicleType) params.vehicleType = searchFilters.vehicleType;
      if (searchFilters.maxPrice) params.maxPrice = searchFilters.maxPrice;

      const response = await axiosClient.get('/parking-lots', { params });
      setParkingLots(response.data.data || []);
    } catch (err) {
      console.error('Fetch parking lots error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch parking lots.');
      setParkingLots(DUMMY_LOTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLots(filters);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Compass className="h-8 w-8 text-emerald-400" />
          <span>Find Parking Near You</span>
        </h2>
        <p className="text-slate-400 mt-2">
          Discover premium, secure parking hubs tailored to your vehicle specifications.
        </p>
      </div>

      {/* Search/Filter Section */}
      <form onSubmit={handleSearch} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="e.g. Noida"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={filters.area}
              onChange={handleChange}
              placeholder="e.g. Sector 62"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={filters.vehicleType}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Any Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="ev">EV</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Max Price (₹ / hr)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-6 py-2.5 rounded-lg shadow-lg transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search Spots</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm">
          {error} (Showing fallback lots)
        </div>
      )}

      {/* Parking Lot Cards */}
      {loading && parkingLots.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : parkingLots.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center text-slate-400">
          No active, approved parking lots found matching your search.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {parkingLots.map((lot) => {
            const lotId = lot._id || lot.id;
            return (
              <div
                key={lotId}
                className="bg-slate-800/60 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-100">{lot.name}</h3>
                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                      {lot.availableSlots} spots free
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="capitalize">{lot.area}, {lot.city}</span>
                  </p>
                  <p className="text-2xl font-extrabold text-blue-400">
                    ₹{lot.pricePerHour} <span className="text-sm font-medium text-slate-500">/ hour</span>
                  </p>
                </div>

                {/* Supported Vehicle Types */}
                {lot.supportedVehicleTypes && lot.supportedVehicleTypes.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
                      Vehicles Supported
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {lot.supportedVehicleTypes.map((type) => (
                        <span key={type} className="bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-800 uppercase font-semibold">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {lot.amenities && lot.amenities.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
                      Amenities Available
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {lot.amenities.map((amenity) => (
                        <span key={amenity} className="bg-slate-750/30 text-slate-400 text-xs px-2.5 py-1 rounded border border-slate-700/50">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/parking-lots/${lotId}/slots`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-slate-900 font-bold py-2 rounded-lg transition-colors text-center"
                >
                  View Slots
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParkingLots;
export { ParkingLots };
