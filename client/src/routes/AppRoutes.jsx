import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ParkingLots from '../pages/ParkingLots.jsx';
import ParkingSlots from '../pages/ParkingSlots.jsx';
import MyBookings from '../pages/MyBookings.jsx';
import QRPass from '../pages/QRPass.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import AdminQRVerify from '../pages/AdminQRVerify.jsx';
import Vehicles from '../pages/Vehicles.jsx';
import Profile from '../pages/Profile.jsx';
import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="parking-lots" element={<ParkingLots />} />
          <Route path="parking-lots/:lotId/slots" element={<ParkingSlots />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="bookings/:bookingId/qr-pass" element={<QRPass />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/qr-verify" element={<AdminQRVerify />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
export { AppRoutes };
