import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminLogin from "../SuperAdmin/pages/Login";
import SuperAdminDashboard from "../SuperAdmin/pages/Dashboard";
import AdminHistory from "../SuperAdmin/pages/AdminHistory";
import Dashboard from "../SuperAdmin/pages/Dashboard";
import CallHistory from "../SuperAdmin/pages/CallHistory";
// Admin routes
import AdminLogin from "../Admin/pages/AdminLogin";
import AdminDashboard from "../Admin/pages/AdminDashboard";
import User from "../Admin/pages/User";
import Calllog from "../Admin/pages/Calllog";

export default function Index() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SuperAdminLogin />} />
          <Route
            path="/superadmindashboard"
            element={<SuperAdminDashboard />}
          />
          <Route path="/adminhistory" element={<AdminHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/callhistory" element={<CallHistory />} />
          {/* Admin routes */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/calllog" element={<Calllog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
