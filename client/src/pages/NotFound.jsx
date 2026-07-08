import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-sm mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-slate-900 font-semibold px-6 py-2.5 rounded-lg shadow-lg transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
export { NotFound };
