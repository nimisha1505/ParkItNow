import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import ListParking from '../pages/ListParking.jsx';
import ParkingApprovals from '../pages/ParkingApprovals.jsx';
import OwnerParkings from '../pages/OwnerParkings.jsx';
import OwnerSlots from '../pages/OwnerSlots.jsx';
import NotFound from '../pages/NotFound.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 bg-slate-900 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'owner') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'superAdmin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/parking-lots" replace />;
    }
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* User Specific Routes */}
        <Route
          path="parking-lots"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <ParkingLots />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="parking-lots/:lotId/slots"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <ParkingSlots />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <MyBookings />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="bookings/:bookingId/qr-pass"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <QRPass />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="vehicles"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <Vehicles />
            </RoleProtectedRoute>
          }
        />

        {/* Common Authenticated Routes */}
        <Route
          path="profile"
          element={
            <RoleProtectedRoute allowedRoles={['user', 'owner', 'superAdmin']}>
              <Profile />
            </RoleProtectedRoute>
          }
        />

        {/* Owner Specific Routes */}
        <Route
          path="list-parking"
          element={
            <RoleProtectedRoute allowedRoles={['owner']}>
              <ListParking />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="owner/parkings"
          element={
            <RoleProtectedRoute allowedRoles={['owner']}>
              <OwnerParkings />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="owner/parkings/:parkingLotId/slots"
          element={
            <RoleProtectedRoute allowedRoles={['owner']}>
              <OwnerSlots />
            </RoleProtectedRoute>
          }
        />

        {/* Owner & Admin Common Routes */}
        <Route
          path="admin"
          element={
            <RoleProtectedRoute allowedRoles={['owner', 'superAdmin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/qr-verify"
          element={
            <RoleProtectedRoute allowedRoles={['owner', 'superAdmin']}>
              <AdminQRVerify />
            </RoleProtectedRoute>
          }
        />

        {/* SuperAdmin Specific Routes */}
        <Route
          path="admin/parking-approvals"
          element={
            <RoleProtectedRoute allowedRoles={['superAdmin']}>
              <ParkingApprovals />
            </RoleProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
export { AppRoutes };
