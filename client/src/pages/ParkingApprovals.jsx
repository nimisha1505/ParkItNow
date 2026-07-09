import React, { useState, useEffect } from 'react';
import { Shield, Check, X, MapPin, DollarSign, Car } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const ParkingApprovals = () => {
  const [pendingLots, setPendingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingLots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/parking-lots');
      const allLots = response.data.data || [];
      const pending = allLots.filter((lot) => lot.approvalStatus === 'pending');
      setPendingLots(pending);
    } catch (err) {
      console.error('Fetch approvals error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Only SuperAdmin can approve or reject parking spaces.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch pending parking spaces.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLots();
  }, []);

  const handleApprove = async (id) => {
    setError(null);
    try {
      await axiosClient.patch(`/parking-lots/${id}/approve`);
      setPendingLots((prev) => prev.filter((lot) => lot._id !== id));
    } catch (err) {
      console.error('Approve error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Only SuperAdmin can approve or reject parking spaces.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to approve parking space.');
      }
    }
  };

  const handleReject = async (id) => {
    setError(null);
    try {
      await axiosClient.patch(`/parking-lots/${id}/reject`);
      setPendingLots((prev) => prev.filter((lot) => lot._id !== id));
    } catch (err) {
      console.error('Reject error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Only SuperAdmin can approve or reject parking spaces.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to reject parking space.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="text-emerald-500" /> Parking Space Approvals
        </h1>
        <p className="text-slate-400 mt-2">
          Review and approve submitted parking lot specifications from space owners.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingLots.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
              No pending parking space approval requests found.
            </div>
          ) : (
            pendingLots.map((lot) => (
              <div
                key={lot._id}
                className="bg-slate-800 border border-slate-750 rounded-xl p-6 shadow-xl hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Details Section */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-slate-100">{lot.name}</h2>
                        <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          PENDING
                        </span>
                      </div>
                      {lot.owner && (
                        <p className="text-sm text-slate-400 mt-1">
                          Owner Reference ID: <strong className="text-slate-350">{lot.owner}</strong>
                        </p>
                      )}
                    </div>

                    {/* Geolocation info */}
                    <div className="text-sm text-slate-300 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span>
                          {lot.address}, <strong className="text-slate-350">{lot.area}</strong>, {lot.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>₹{lot.pricePerHour} per hour</span>
                      </div>
                    </div>

                    {/* Vehicle types supported */}
                    {lot.supportedVehicleTypes && lot.supportedVehicleTypes.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 block mb-1">SUPPORTED VEHICLES</span>
                        <div className="flex flex-wrap gap-1.5">
                          {lot.supportedVehicleTypes.map((type) => (
                            <span key={type} className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-800">
                              {type.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    {lot.amenities && lot.amenities.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 block mb-1">AMENITIES</span>
                        <div className="flex flex-wrap gap-1.5">
                          {lot.amenities.map((amenity) => (
                            <span key={amenity} className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-800">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Section */}
                  <div className="flex sm:flex-row md:flex-col gap-3 min-w-[140px] justify-end">
                    <button
                      onClick={() => handleApprove(lot._id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(lot._id)}
                      className="bg-slate-700 hover:bg-slate-650 hover:text-red-400 text-slate-300 font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors border border-slate-600"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ParkingApprovals;
export { ParkingApprovals };
