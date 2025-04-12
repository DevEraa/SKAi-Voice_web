import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminLogin from "../SuperAdmin/pages/Login";
import SuperAdminDashboard from "../SuperAdmin/pages/Dashboard";
import AdminHistory from "../SuperAdmin/pages/AdminHistory";
import CallHistory from "../SuperAdmin/pages/CallHistory";
// Admin routes
import AdminLogin from "../Admin/pages/AdminLogin";
import AdminDashboard from "../Admin/pages/AdminDashboard";
import User from "../Admin/pages/User";
import Calllog from "../Admin/pages/Calllog";

import {
  SuperAdminProtectedRoute,
  AdminProtectedRoute,
} from "../ProtectedRoutes/Protected";
import AudioPlayer from "../Admin/pages/AudioPlayer";

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SuperAdminLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Super Admin Protected Routes */}
        <Route
          path="/superadmindashboard"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboard />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/adminhistory"
          element={
            <SuperAdminProtectedRoute>
              <AdminHistory />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboard />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/callhistory"
          element={
            <SuperAdminProtectedRoute>
              <CallHistory />
            </SuperAdminProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admindashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <AdminProtectedRoute>
              <User />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/calllog"
          element={
            <AdminProtectedRoute>
              <Calllog />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
