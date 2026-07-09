import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const OwnerParkings = () => {
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyLots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/parking-lots', {
        params: { myLots: 'true' },
      });
      setLots(response.data.data || []);
    } catch (err) {
      console.error('Fetch my lots error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch your parking spaces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLots();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Page Heading */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Compass className="h-8 w-8 text-emerald-400" />
            <span>My Parking Spaces</span>
          </h2>
          <p className="text-slate-400 mt-2">
            Manage your submitted spaces, track approval status, and configure parking slots.
          </p>
        </div>
        <button
          onClick={() => navigate('/list-parking')}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-5 py-2.5 rounded-lg shadow-lg transition-colors text-sm"
        >
          Add New Space
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm flex gap-2 items-center">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : lots.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center text-slate-400 max-w-3xl">
          You haven't listed any parking spaces yet. Click 'Add New Space' above to register one!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {lots.map((lot) => {
            const lotId = lot._id || lot.id;
            return (
              <div
                key={lotId}
                className="bg-slate-800 border border-slate-750 p-6 rounded-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-slate-100">{lot.name}</h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                        lot.approvalStatus === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : lot.approvalStatus === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {lot.approvalStatus.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span>{lot.area}, {lot.city}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-550 block">STATUS</span>
                      <span className="flex items-center gap-1 mt-0.5 font-semibold">
                        {lot.isActive ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-slate-300">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-slate-400">Inactive</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-550 block">PRICE RATE</span>
                      <span className="text-blue-400 font-bold mt-0.5 block text-sm">₹{lot.pricePerHour} / hr</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block">TOTAL SLOTS</span>
                      <span className="text-slate-305 text-slate-300 font-bold mt-0.5 block">{lot.totalSlots}</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block">FREE SLOTS</span>
                      <span className="text-emerald-400 font-bold mt-0.5 block">{lot.availableSlots}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/owner/parkings/${lotId}/slots`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-slate-900 font-bold py-2 rounded-lg transition-colors text-center text-sm shadow-md"
                >
                  Manage Slots
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerParkings;
export { OwnerParkings };
