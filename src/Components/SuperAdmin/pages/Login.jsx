import React from "react";
import Loginsvg from "../../../assets/login.svg";
import Logo from "../../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import superadminApp from "../store/hook";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    username: "",
    password: "",
  });

  const { superadminlogin } = superadminApp();

  const handleSubmit = async () => {
    try {
      const response = await superadminlogin(data);
      console.log(response.message);
      if (response.message == "✅ Login successful!") {
        localStorage.setItem("token", response.token);
        navigate("/superadmindashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: response.data.message
        });
        // alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: "Invalid Credentials !"
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white text-blue-600 p-10 shadow-xl rounded-lg">
        <img src={Logo} alt="Logo" className="w-24 h-24 mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-6 animate-fade-in">
          Welcome Back
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Login to your Super Admin account
        </p>
        <div className="w-full max-w-sm bg-gray-50 p-6 rounded-lg shadow-2xl transform transition hover:scale-105">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              username
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Enter your username"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Enter your password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-md hover:shadow-lg"
          >
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
  );
}
