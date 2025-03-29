import { useState, useEffect } from "react";
import Logo from "../../../assets/logo.jpg";
import { Eye, EyeOff } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import adminHooks from "../store/hook";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activecard, setactivecard] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conformpasswordVisible, setConformPasswordVisible] = useState(false);
  const { getTeamUserById, createTeamUser } = adminHooks();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    mobilenumber: "",
    username: "",
  });
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log("isHovered", isHovered);

  const handleSubmituser = async (e) => {
    e.preventDefault();
    const { name, password, confirmPassword, username, mobilenumber } =
      formData;
    if (name && password && confirmPassword && username && mobilenumber) {
      if (password === confirmPassword) {
        console.log("Form submitted:", formData);
        try {
          const response = await createTeamUser(formData);
          console.log(response, "response in create new user");
          if (response.message === "✅ User created successfully!") {
            console.log("User created successfully");
            alert("User created successfully");
          }
        } catch (error) {
          console.error(error);
          alert("Failed to create user");
        }

        setModalOpen(false);
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left section - Logo and Desktop Nav */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <img src={Logo} alt="Logo" className="h-8 w-auto" />

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6">
                <NavLink
                  to="/admindashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-sm text-blue-600 px-3 py-2 font-bold "
                      : " text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/user"
                  className={({ isActive }) =>
                    isActive
                      ? "text-sm text-blue-600 px-3 py-2 font-bold "
                      : " text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  }
                >
                  User
                </NavLink>

                <NavLink
                  to="/calllog"
                  className={({ isActive }) =>
                    isActive
                      ? "text-sm text-blue-600 px-3 py-2 font-bold "
                      : " text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  }
                >
                  Call Log
                </NavLink>
              </div>
            </div>

            {/* Right section - Actions and Profile */}
            <div className="flex items-center space-x-4">
              <button class="inline-block relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span class="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-400 bg-green-600"></span>
              </button>

              <button className="inline-block relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-400 bg-green-600" />
              </button>

              {/* New Job Button - Desktop */}
              <button
                onClick={() => setModalOpen(true)}
                className="hidden md:inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                + New User
              </button>

              {/* User Profile - Desktop */}
              <div
                className="hidden md:flex items-center space-x-2 cursor-pointer"
                onClick={() => setactivecard(!activecard)}
              >
                <img
                  src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                  alt="User profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600 text-sm">Mr. Rahul Patil</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <NavLink
                to="/admindashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm text-blue-600 px-3 py-2 font-bold "
                    : " text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/user"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm text-blue-600 px-3 py-2 font-bold "
                    : " text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                }
              >
                User
              </NavLink>

              <NavLink
                to="/calllog"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm text-blue-600 px-3 py-2 font-bold "
                    : " text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                }
              >
                Call Log
              </NavLink>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full my-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium transition-colors"
              >
                + New User
              </button>

              <div
                className="flex md:hidden items-center space-x-2 cursor-pointer"
                onClick={() => setactivecard(!activecard)}
              >
                <img
                  src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                  alt="User profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600 text-sm">Mr. Rahul Patil</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {activecard && (
        <div className="fixed right-4 md:right-8 top-16 z-50 transition-all duration-300 ease-out">
          <div className="w-80 max-w-[90vw] border border-gray-200 rounded-xl bg-white shadow-xl overflow-hidden transform hover:shadow-2xl transition-shadow duration-300">
            {/* Profile Content */}
            <div className="px-6 py-4">
              <div className="flex flex-col items-start space-y-2">
                <h3 className="text-2xl font-bold text-blue-500">
                  Mr. Rahul Patil
                </h3>
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm text-blue-500 font-medium tracking-wide">
                  Admin
                </span>
              </div>
              <div className="space-y-4">
                {/* Info Items */}
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    ritika@deveraa.com
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    10 Users Limit
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    +977 9955221114
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => navigate("/adminlogin")}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  <span className="font-semibold">Log Out</span>
                </button>

                <div className="text-center pt-2">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px] max-w-[95%] border border-gray-100 animate-scaleIn">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmituser}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={conformpasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConformPasswordVisible(!conformpasswordVisible)
                    }
                    className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {conformpasswordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="mobilenumber"
                    placeholder="Phone number"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 transform mt-4"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
