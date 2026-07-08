import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
      &copy; {new Date().getFullYear()} ParkItNow. All rights reserved.
    </footer>
  );
};

export default Footer;
export { Footer };
