import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-100">
          Sign In
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              placeholder="user@example.com (API integration coming soon)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              disabled
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 focus:outline-none"
            />
          </div>
          <button
            disabled
            className="w-full bg-blue-500 text-slate-900 font-semibold py-2.5 rounded-lg opacity-60 cursor-not-allowed"
          >
            Sign In (Locked)
          </button>
        </div>
        <p className="mt-6 text-sm text-center text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
export { Login };
