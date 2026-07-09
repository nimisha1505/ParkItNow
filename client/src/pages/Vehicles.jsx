import React, { useState, useEffect } from 'react';
import { Car, Plus, Star, Trash2 } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    type: 'car',
    brand: '',
    model: '',
    registrationNumber: '',
    color: '',
    isDefault: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/vehicles');
      setVehicles(response.data.data || []);
    } catch (err) {
      console.error('Fetch vehicles error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Please login to manage your vehicles.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch vehicles.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosClient.post('/vehicles', formData);
      setSuccess(true);
      setFormData({
        type: 'car',
        brand: '',
        model: '',
        registrationNumber: '',
        color: '',
        isDefault: false,
      });
      await fetchVehicles();
    } catch (err) {
      console.error('Create vehicle error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Please login to manage your vehicles.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create vehicle.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axiosClient.delete(`/vehicles/${id}`);
      await fetchVehicles();
    } catch (err) {
      console.error('Delete vehicle error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Please login to manage your vehicles.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to delete vehicle.');
      }
    }
  };

  const handleSetDefault = async (id) => {
    setError(null);
    try {
      await axiosClient.patch(`/vehicles/${id}/default`);
      await fetchVehicles();
    } catch (err) {
      console.error('Set default vehicle error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Please login to manage your vehicles.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to set default vehicle.');
      }
    }
  };

  return (
    <div className="space-y-10 py-4">
      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Car className="h-8 w-8 text-emerald-400" />
          <span>My Vehicles</span>
        </h2>
        <p className="text-slate-400 mt-2">
          Manage your vehicle profiles. Registered vehicles can be assigned to reservations.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-405 text-red-400 p-4 rounded-xl flex items-start gap-3">
          <div className="text-sm">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-4 rounded-xl flex items-start gap-3">
          <div className="text-sm">Vehicle added successfully!</div>
        </div>
      )}

      {/* Grid split: Add Form and Vehicles Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Vehicle Form */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4 h-fit">
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Plus className="h-5 w-5 text-emerald-400" />
            <span>Add Vehicle</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Vehicle Type</label>
              <select
                name="type"
                disabled={loading}
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="ev">EV</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                required
                disabled={loading}
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Tesla"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Model</label>
              <input
                type="text"
                name="model"
                required
                disabled={loading}
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Model 3"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                required
                disabled={loading}
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. NY-99-C-1234"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                required
                disabled={loading}
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Red"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                disabled={loading}
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 bg-slate-900 border border-slate-700 rounded text-emerald-500 focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
              />
              <label htmlFor="isDefault" className="text-slate-300 select-none">
                Set as default vehicle
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2 rounded-lg transition-colors ${
                loading ? 'opacity-65 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </div>

        {/* Vehicles List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 font-bold">Registered Vehicles</h3>
          {loading && vehicles.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
              No registered vehicles found. Add one on the left to get started.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div
                  key={v._id}
                  className={`bg-slate-800 border p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all ${
                    v.isDefault ? 'border-emerald-500/50' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded text-xs font-semibold text-slate-300 uppercase">
                        {v.type}
                      </span>
                      {v.isDefault && (
                        <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <Star className="h-3 w-3 fill-emerald-400" />
                          <span>Default</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-200">
                      {v.brand} {v.model}
                    </h4>
                    <div className="space-y-1 text-sm text-slate-400">
                      <p>Registration: <span className="font-mono font-semibold text-slate-300">{v.registrationNumber}</span></p>
                      <p>Color: <span className="font-semibold text-slate-300">{v.color}</span></p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2 border-t border-slate-700/50">
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="flex-1 bg-slate-900 hover:bg-slate-750 text-red-400 py-1.5 rounded text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    {!v.isDefault && (
                      <button
                        onClick={() => handleSetDefault(v._id)}
                        className="flex-1 bg-slate-900 hover:bg-slate-750 text-emerald-400 py-1.5 rounded text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
export { Vehicles };
