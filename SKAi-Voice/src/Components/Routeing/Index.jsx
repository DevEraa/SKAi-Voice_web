import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminLogin from "../SuperAdmin/Login";
import SuperAdminDashboard from '../SuperAdmin/Dashboard';
import AdminHistory from "../SuperAdmin/AdminHistory";
import Dashboard from "../SuperAdmin/Dashboard";
import CallHistory from "../SuperAdmin/CallHistory";
// Admin routes
import AdminLogin from "../Admin/AdminLogin";
import AdminDashboard from "../Admin/AdminDashboard";
import User from '../Admin/User';
import Calllog from '../Admin/Calllog';

export default function Index() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SuperAdminLogin />} />
                    <Route path="/superadmindashboard" element={ <SuperAdminDashboard />} />
                    <Route path="/adminhistory" element={ <AdminHistory />} />
                    <Route path="/dashboard" element={ <Dashboard />} />
                    <Route path="/callhistory" element={ <CallHistory />} />
                    {/* Admin routes */}
                    <Route path="/adminlogin" element={ <AdminLogin />} />
                    <Route path="/admindashboard" element={ <AdminDashboard />} />
                    <Route path="/user" element={ <User />} />
                    <Route path="/calllog" element={ <Calllog />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
