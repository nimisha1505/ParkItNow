import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Plus, Trash2, ArrowLeft, Layers, ShieldAlert, CheckCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const OwnerSlots = () => {
  const { parkingLotId } = useParams();

  const [slots, setSlots] = useState([]);
  const [lot, setLot] = useState(null);
  const [formData, setFormData] = useState({
    slotNumber: '',
    floor: '',
    section: '',
    supportedVehicleTypes: [],
    status: 'available',
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const vehicleTypesOptions = [
    { label: 'Car', value: 'car' },
    { label: 'Bike', value: 'bike' },
    { label: 'Scooter', value: 'scooter' },
    { label: 'Electric Vehicle (EV)', value: 'ev' },
  ];

  const statusOptions = ['available', 'reserved', 'occupied', 'maintenance'];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch ParkingLot Info
      try {
        const lotRes = await axiosClient.get(`/parking-lots/${parkingLotId}`);
        setLot(lotRes.data.data);
      } catch (err) {
        console.warn('Failed to fetch lot details.');
      }

      // 2. Fetch Slots belonging to lot
      const slotsRes = await axiosClient.get('/parking-slots', {
        params: { parkingLotId, status: 'all' }, // Pass custom status to bypass default 'available'
      });
      setSlots(slotsRes.data.data || []);
    } catch (err) {
      console.error('Fetch slots failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch parking slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parkingLotId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData((prev) => {
      const currentList = prev.supportedVehicleTypes;
      const newList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return {
        ...prev,
        supportedVehicleTypes: newList,
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.supportedVehicleTypes.length === 0) {
      alert('Please select at least one supported vehicle type');
      return;
    }
    setSubmitLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      parkingLot: parkingLotId,
      slotNumber: formData.slotNumber,
      floor: formData.floor,
      section: formData.section,
      supportedVehicleTypes: formData.supportedVehicleTypes,
      status: formData.status,
    };

    try {
      await axiosClient.post('/parking-slots', payload);
      setSuccess(true);
      setFormData({
        slotNumber: '',
        floor: '',
        section: '',
        supportedVehicleTypes: [],
        status: 'available',
      });
      // Refetch
      await fetchData();
    } catch (err) {
      console.error('Create slot failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create slot.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (slotId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this parking slot?');
    if (!confirmDelete) return;

    setError(null);
    try {
      await axiosClient.delete(`/parking-slots/${slotId}`);
      await fetchData();
    } catch (err) {
      console.error('Delete slot failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete parking slot.');
    }
  };

  const handleStatusChange = async (slotId, newStatus) => {
    setError(null);
    try {
      await axiosClient.patch(`/parking-slots/${slotId}`, { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error('Update status failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update slot status.');
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Back Link and Heading */}
      <div className="space-y-4">
        <Link to="/owner/parkings" className="text-emerald-450 text-emerald-400 hover:underline text-sm font-semibold inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to My Parkings
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Layers className="h-8 w-8 text-emerald-400" />
            <span>Manage Parking Slots</span>
          </h2>
          {lot && (
            <p className="text-slate-400 mt-2">
              Configuring slots for: <strong className="text-slate-300">{lot.name}</strong> ({lot.city})
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-405 text-red-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Slot created successfully!</span>
        </div>
      )}

      {/* Forms & Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4 h-fit">
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-700 pb-3">
            <Plus className="h-5 w-5 text-emerald-400" />
            <span>Create Slot</span>
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-350 font-medium mb-1">Slot Number / Name</label>
              <input
                type="text"
                name="slotNumber"
                required
                disabled={submitLoading}
                value={formData.slotNumber}
                onChange={handleInputChange}
                placeholder="e.g. A-12"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-350 font-medium mb-1">Floor</label>
                <input
                  type="text"
                  name="floor"
                  required
                  disabled={submitLoading}
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g. Ground"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-slate-350 font-medium mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  required
                  disabled={submitLoading}
                  value={formData.section}
                  onChange={handleInputChange}
                  placeholder="e.g. Zone B"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-350 font-medium mb-1">Initial Status</label>
              <select
                name="status"
                disabled={submitLoading}
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50 capitalize"
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-350 font-medium mb-2">Supported Vehicles</label>
              <div className="grid grid-cols-2 gap-2">
                {vehicleTypesOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-colors ${
                      formData.supportedVehicleTypes.includes(opt.value)
                        ? 'border-emerald-500 bg-emerald-500/5 text-slate-200'
                        : 'border-slate-700 hover:border-slate-650 text-slate-450 bg-slate-900/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={submitLoading}
                      checked={formData.supportedVehicleTypes.includes(opt.value)}
                      onChange={() => handleCheckboxChange(opt.value)}
                      className="accent-emerald-500"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className={`w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2 rounded-lg transition-colors flex items-center justify-center ${
                submitLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {submitLoading ? 'Creating...' : 'Create Slot'}
            </button>
          </form>
        </div>

        {/* Existing Slots Table */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Configured Slots</h3>

          {loading && slots.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : slots.length === 0 ? (
            <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-xl text-center text-slate-550">
              No slots configured yet. Add slots using the creator form on the left.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Slot Number</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Supported Types</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {slots.map((slot) => {
                    const slotId = slot._id || slot.id;
                    return (
                      <tr key={slotId} className="hover:bg-slate-750/30">
                        <td className="px-4 py-3 font-bold text-slate-200">{slot.slotNumber}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs space-y-0.5">
                          <p>Floor: <strong className="text-slate-300">{slot.floor}</strong></p>
                          <p>Section: <strong className="text-slate-300">{slot.section}</strong></p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {slot.supportedVehicleTypes.map((type) => (
                              <span
                                key={type}
                                className="bg-slate-900 text-slate-350 text-[10px] px-1.5 py-0.5 rounded uppercase border border-slate-800"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={slot.status}
                            onChange={(e) => handleStatusChange(slotId, e.target.value)}
                            className={`bg-slate-900 border rounded px-2.5 py-1 text-xs font-semibold focus:outline-none capitalize ${
                              slot.status === 'available'
                                ? 'text-emerald-450 border-emerald-500/20'
                                : slot.status === 'maintenance'
                                ? 'text-yellow-450 border-yellow-500/20'
                                : slot.status === 'occupied'
                                ? 'text-red-450 border-red-500/20'
                                : 'text-blue-450 border-blue-500/20'
                            }`}
                          >
                            {statusOptions.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(slotId)}
                            className="bg-slate-900 hover:bg-slate-750 text-red-400 p-1.5 rounded border border-slate-700 transition-colors inline-flex items-center justify-center"
                            title="Delete Slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerSlots;
export { OwnerSlots };
