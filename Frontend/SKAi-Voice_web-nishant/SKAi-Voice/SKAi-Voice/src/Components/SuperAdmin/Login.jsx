import React from 'react';
import Loginsvg from '../../assets/login.svg';
import Logo from '../../assets/logo.jpg'
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white text-blue-600 p-10 shadow-xl rounded-lg">
        <img src={Logo} alt="Logo" className="w-24 h-24 mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-6 animate-fade-in">Welcome Back</h1>
        <p className="mb-6 text-lg text-gray-600">Login to your Super Admin account</p>
        <div className="w-full max-w-sm bg-gray-50 p-6 rounded-lg shadow-2xl transform transition hover:scale-105">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Enter your password"
            />
          </div>
          <button onClick={() => navigate('/superadmindashboard')} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-md hover:shadow-lg">
            Login
          </button>
          {/* <p className="mt-4 text-sm text-gray-500 text-center">Forgot password? <a href="#" className="text-blue-400 hover:underline">Reset here</a></p> */}
        </div>
      </div>

      {/* Right Side - Image (Hidden on Small Screens) */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-10 animate-slide-in">
        <img
          src={Loginsvg}
          alt="Illustration"
          className="max-w-full h-auto drop-shadow-xl rounded-lg"
        />
      </div>
    </div>
  )
}
