import React from "react";
import Loginsvg from "../../../assets/login.svg";
import Logo from "../../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import adminHooks from "../store/hook";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = adminHooks();
  const [data, setData] = React.useState({
    username: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.username || !data.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log("data", data)
      const success = await login(data);
      console.log(success?.name)
      localStorage.setItem("admin_name", success?.name);
      localStorage.setItem("admin_id", success?.username);
      localStorage.setItem("admin_limit", success?.adminlimits);
      localStorage.setItem("admin_email", success?.email);
      localStorage.setItem("admin_id", success?.id);
      if (success.message === "✅ Login successful!") {
        navigate("/admindashboard");
      } if (success.message === "Your are Lock, Contact your Superadmin") {
        setError("Your are Lock, Contact your Superadmin");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      let errorMessage = err.message || "Login failed. Please try again.";

  // Remove "Error: " prefix if present
  errorMessage = errorMessage.replace(/^Error:\s*/, "");

  setError(errorMessage); // Set cleaned-up error message
  console.error(err);
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
          Login to your Admin account
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-gray-50 p-6 rounded-lg shadow-2xl transform transition hover:scale-105"
        >
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              username
            </label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
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
