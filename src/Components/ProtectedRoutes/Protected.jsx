// components/ProtectedRoutes.js
import React from "react";
import { Navigate } from "react-router-dom";

export const SuperAdminProtectedRoute = ({ children }) => {
  const isSuperAdminLoggedIn = localStorage.getItem("superadminToken"); // Customize your auth logic
  return isSuperAdminLoggedIn ? children : <Navigate to="/" />;
};

export const AdminProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("token"); // Customize your auth logic
  return isAdminLoggedIn ? children : <Navigate to="/adminlogin" />;
};
