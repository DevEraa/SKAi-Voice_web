import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminLogin from "../SuperAdmin/Login";
import SuperAdminDashboard from '../SuperAdmin/Dashboard';
import AdminHistory from "../SuperAdmin/AdminHistory";

export default function Index() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SuperAdminLogin />} />
                    <Route path="/superadmindashboard" element={ <SuperAdminDashboard />} />
                    <Route path="/adminhistory" element={ <AdminHistory />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
