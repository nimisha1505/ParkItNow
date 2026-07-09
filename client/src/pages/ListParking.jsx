import React, { useState } from 'react';
import { Info, MapPin, Shield, DollarSign, Car } from 'lucide-react';

const ListParking = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    area: '',
    landmark: '',
    lat: '',
    lng: '',
    pricePerHour: '',
    supportedVehicleTypes: [],
    amenities: [],
  });

  const [submitted, setSubmitted] = useState(false);

  const vehicleTypesOptions = [
    { label: 'Car', value: 'car' },
    { label: 'Bike', value: 'bike' },
    { label: 'Scooter', value: 'scooter' },
    { label: 'Electric Vehicle (EV)', value: 'ev' },
  ];

  const amenitiesOptions = [
    'CCTV',
    'Covered',
    'EV Charger',
    'Valet',
    '24/7 Access',
    'Restrooms',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const currentList = prev[name];
      const newList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return {
        ...prev,
        [name]: newList,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Parking Space Listing:', formData);
    setSubmitted(true);
    // Reset form after successful mock submit
    setFormData({
      name: '',
      address: '',
      city: '',
      area: '',
      landmark: '',
      lat: '',
      lng: '',
      pricePerHour: '',
      supportedVehicleTypes: [],
      amenities: [],
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Car className="text-emerald-500" /> List Your Parking Space
        </h1>
        <p className="text-slate-400 mt-2">
          Earn passive income by sharing your empty land, garage, or parking spots.
        </p>
      </div>

      {submitted && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Submission Received!</h4>
            <p className="text-sm mt-1 text-slate-300">
              Your parking space has been submitted for approval.
            </p>
          </div>
        </div>
      )}

      {/* Process Info Alert */}
      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl mb-8 flex gap-3 items-start">
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-slate-300">
          <strong>Approval Notice:</strong> After submission, the ParkItNow team will review and approve your parking space before it becomes visible to users.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-200 border-b border-slate-700 pb-3">
          Space Specifications
        </h2>

        {/* Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Parking Lot Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Metro Square Secure Parking"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Price Per Hour (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                name="pricePerHour"
                required
                min="0"
                value={formData.pricePerHour}
                onChange={handleChange}
                placeholder="40"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Plot No 42, Sector 18"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* City and Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Noida"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Area / Locality
            </label>
            <input
              type="text"
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              placeholder="Sector 18"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Near Metro Station"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
          <div className="md:col-span-2 flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Geographic Coordinates (Required for Map Navigations)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-450 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              name="lat"
              required
              value={formData.lat}
              onChange={handleChange}
              placeholder="e.g. 28.5708"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-450 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              name="lng"
              required
              value={formData.lng}
              onChange={handleChange}
              placeholder="e.g. 77.3261"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Supported Vehicle Types */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Supported Vehicle Types
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vehicleTypesOptions.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer select-none transition-colors ${
                  formData.supportedVehicleTypes.includes(type.value)
                    ? 'border-emerald-500/50 bg-emerald-500/5 text-slate-200'
                    : 'border-slate-700 hover:border-slate-600 text-slate-400 bg-slate-900/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.supportedVehicleTypes.includes(type.value)}
                  onChange={() => handleCheckboxChange('supportedVehicleTypes', type.value)}
                  className="accent-emerald-500"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Available Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amenitiesOptions.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer select-none transition-colors ${
                  formData.amenities.includes(amenity)
                    ? 'border-emerald-500/50 bg-emerald-500/5 text-slate-200'
                    : 'border-slate-700 hover:border-slate-600 text-slate-400 bg-slate-900/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleCheckboxChange('amenities', amenity)}
                  className="accent-emerald-500"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 text-base"
        >
          <Shield className="w-5 h-5" /> Submit for Approval
        </button>
      </form>
    </div>
  );
};

export default ListParking;
export { ListParking };
