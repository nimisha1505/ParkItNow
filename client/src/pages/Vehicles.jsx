import React, { useState } from 'react';
import { Car, Plus, Star } from 'lucide-react';

const DUMMY_VEHICLES = [
  {
    id: '1',
    type: 'car',
    brand: 'Tesla',
    model: 'Model 3',
    registrationNumber: 'NY-99-C-1234',
    color: 'Red',
    isDefault: true,
  },
  {
    id: '2',
    type: 'bike',
    brand: 'Yamaha',
    model: 'YZF-R3',
    registrationNumber: 'CA-55-B-5678',
    color: 'Blue',
    isDefault: false,
  },
  {
    id: '3',
    type: 'ev',
    brand: 'Nissan',
    model: 'Leaf',
    registrationNumber: 'WA-12-E-9012',
    color: 'White',
    isDefault: false,
  },
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(DUMMY_VEHICLES);
  const [formData, setFormData] = useState({
    type: 'car',
    brand: '',
    model: '',
    registrationNumber: '',
    color: '',
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Vehicle form submitted:', formData);
    const newVehicle = {
      id: Date.now().toString(),
      ...formData,
    };
    if (formData.isDefault) {
      setVehicles((prev) =>
        prev.map((v) => ({ ...v, isDefault: false })).concat(newVehicle)
      );
    } else {
      setVehicles((prev) => prev.concat(newVehicle));
    }
    setFormData({
      type: 'car',
      brand: '',
      model: '',
      registrationNumber: '',
      color: '',
      isDefault: false,
    });
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
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
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
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Tesla"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Model</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Model 3"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. NY-99-C-1234"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Red"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 bg-slate-900 border border-slate-700 rounded text-emerald-500 focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="isDefault" className="text-slate-300 select-none">
                Set as default vehicle
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2 rounded-lg transition-colors"
            >
              Add Vehicle
            </button>
          </form>
        </div>

        {/* Vehicles List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Registered Vehicles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`bg-slate-800 border p-5 rounded-xl flex flex-col justify-between space-y-4 ${
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
                    onClick={() => console.log('Edit vehicle id:', v.id)}
                    className="flex-1 bg-slate-900 hover:bg-slate-750 text-slate-300 py-1.5 rounded text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      console.log('Delete vehicle id:', v.id);
                      setVehicles((prev) => prev.filter((item) => item.id !== v.id));
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-750 text-red-400 py-1.5 rounded text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Delete
                  </button>
                  {!v.isDefault && (
                    <button
                      onClick={() => {
                        console.log('Set default vehicle id:', v.id);
                        setVehicles((prev) =>
                          prev.map((item) => ({
                            ...item,
                            isDefault: item.id === v.id,
                          }))
                        );
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-750 text-emerald-400 py-1.5 rounded text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
export { Vehicles };
