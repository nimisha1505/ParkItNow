import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-100">
          Create Account
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              disabled
              placeholder="John Doe"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              placeholder="user@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              disabled
              placeholder="•••••••• (At least 6 characters)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 focus:outline-none"
            />
          </div>
          <button
            disabled
            className="w-full bg-emerald-500 text-slate-900 font-semibold py-2.5 rounded-lg opacity-60 cursor-not-allowed"
          >
            Register (Locked)
          </button>
        </div>
        <p className="mt-6 text-sm text-center text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
export { Register };
