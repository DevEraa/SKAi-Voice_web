import { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo.jpg";
import { Eye, EyeOff, Link } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import adminHooks from "../store/hook";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import superadminApp from "../../SuperAdmin/store/hook";
import { FaCloudDownloadAlt } from "react-icons/fa";

const Navbar = ({ setusercreated }) => {
  const linkRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updateAdmin, getAdminById } = superadminApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activecard, setactivecard] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conformpasswordVisible, setConformPasswordVisible] = useState(false);
  const { getTeamUserById, createTeamUser, updateTeamUser } = adminHooks();

  const [Logusername, setLogUsername] = useState("");
  const [Loguseremail, setLoguseremail] = useState("");
  const [Loguserlimit, setLoguserlimit] = useState("");
  const [Logadminid, setLogadminid] = useState("");
  const [Totaluser, setTotaluser] = useState(0);
  const [Adminlimitpopup, setAdminlimitpopup] = useState(false);
  const [Logoutpopup, setlogoutpopup] = useState(false);
  const [Passwordresetpopup, setPasswordresetpopup] = useState(false);
  const [Adminid, setAdminid] = useState();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    mobilenumber: "",
    username: "",
    createdby: Logadminid,
    Channelid: "Channelid",
  });

  useEffect(() => {
    setLogUsername(localStorage.getItem("admin_name"));
    setLoguseremail(localStorage.getItem("admin_email"));
    setLoguserlimit(localStorage.getItem("admin_limit"));
    setLogadminid(localStorage.getItem("admin_id"));
    setTotaluser(localStorage.getItem("totaluser"));
    setAdminid(localStorage.getItem("admin_id"));
    setFormData({ ...formData, createdby: localStorage.getItem("admin_id") });
  }, []);

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

  useEffect(() => {
    const admin = async () => {
      const id = localStorage.getItem("admin_id");
      try {
        const response = await getAdminById(id);
        setLoguserlimit(response?.adminlimits);
        setLogadminid(response?.username);
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
      }
    };
    admin();
  }, []);

  // const handleSubmituser = async (e) => {
  //   e.preventDefault();
  //   console.log("form data")
  //   if (Totaluser >= Loguserlimit) {
  //     console.log("Loguserlimit:", Loguserlimit, "Totaluser:", Totaluser);
  //     setAdminlimitpopup(true);
  //     console.log("Limit exceeded: Cannot create more users.");
  //     return;
  //   }

  //   const { name, password, confirmPassword, username, mobilenumber, } = formData;
  //   console.log("form data", formData)
  //   if (name && password && confirmPassword && username) {
  //     if (password === confirmPassword) {
  //       console.log("Form submitted:", formData);
  //       try {
  //         console.log("form data", formData)
  //         const response = await createTeamUser(formData);
  //         console.log(response, "response in create new user");
  //         if (response.message === "✅ Team created successfully!") {
  //           console.log("User created successfully");
  //           Swal.fire({
  //             title: "Successfuly!",
  //             text: "User Added Successfuly!",
  //             icon: "success"
  //           });
  //           setTotaluser(localStorage.getItem("totaluser"));
  //         }
  //       } catch (error) {
  //         console.error(error.message);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: error.message
  //         });
  //       }

  //       setModalOpen(false);
  //       setuserModalOpen(prev => !prev)
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "Password Does Not Match"
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "All Fields are Required"
  //     });
  //   }
  // };
  const handleSubmituser = async (e) => {
    e.preventDefault();
    console.log("Form data submitted");

    const { name, password, confirmPassword, username, mobilenumber } =
      formData;

    if (name && password && confirmPassword && username) {
      if (password === confirmPassword) {
        console.log("Form submitted:", formData);
        try {
          const response = await createTeamUser(formData);
          console.log(response, "Response in create new user");

          if (response.message === "✅ Team created successfully!") {
            console.log("User created successfully");
            Swal.fire({
              title: "Success!",
              text: "User Added Successfully!",
              icon: "success",
            });

            // Update Totaluser in state and local storage

            setModalOpen(false);
            setusercreated(true);
            // setuserModalOpen((prev) => !prev);
          }
        } catch (error) {
          console.error(error.message);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password Does Not Match",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All Fields are Required",
      });
    }
  };

  const [Passwordreset, setPasswordreset] = useState({
    password: "",
    conformpassword: "",
  });
  const handlePasswordReset = async () => {
    if (Passwordreset.password !== Passwordreset.conformpassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match. Please try again.",
        icon: "error",
      });
      return;
    }
    console.log("Adminid", Adminid);

    const updatepassword = { password: Passwordreset.password };
    console.log("Passwordreset", updatepassword);
    const request = await updateAdmin(Adminid, updatepassword);
    console.log(request);
    setPasswordresetpopup(false);
    Swal.fire({
      title: "Successfuly!",
      text: "Password Reset Successfuly!",
      icon: "success",
    });
  };

  const handleDownload = () => {
    if (linkRef.current) {
      linkRef.current.click();
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
              <button
                onClick={handleDownload}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                <span className="flex flex-col items-center space-x-1">
                  <FaCloudDownloadAlt className="h-5 w-5" />
                  <span className="hidden md:inline">Download App</span>
                </span>
              </button>
              <a
                ref={linkRef}
                href={`${import.meta.env.VITE_APP_API_URL}/download/app`}
                download={"app"}
                style={{ display: "none" }}
              />

              {/* New Job Button - Desktop */}
              <button
                onClick={() => {
                  setModalOpen(true);
                  setuserModalOpen((prev) => !prev);
                }}
                className="cursor-pointer hidden md:inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                + New User
              </button>

              {/* User Profile - Desktop */}
              <div
                className="hidden md:flex items-center space-x-2 cursor-pointer"
                onClick={() => setactivecard(!activecard)}
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqf0Wx4wmsKfLYsiLdBx6H4D8bwQBurWhx5g&s"
                  alt="User profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600 text-sm">{Logusername}</span>
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
                onClick={() => {
                  setModalOpen(true);
                  setuserModalOpen((prev) => !prev);
                }}
                className="cursor-pointer w-full my-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium transition-colors"
              >
                + New User
              </button>

              <div
                className="flex md:hidden items-center space-x-2 cursor-pointer"
                onClick={() => setactivecard(!activecard)}
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqf0Wx4wmsKfLYsiLdBx6H4D8bwQBurWhx5g&s"
                  alt="User profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600 text-sm">{Logusername}</span>
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
                  {Logusername}
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
                    {/* {Loguseremail === null ? "Not Added" : Loguseremail } */}
                    {Logadminid}
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
                    {Loguserlimit != null ? Loguserlimit + " " : "Not Added"}
                    Users Limit
                  </span>
                </div>

                {/* <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
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
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => setlogoutpopup(true)}
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
                    onClick={() => setPasswordresetpopup(true)}
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
                onClick={() => {
                  setModalOpen(false);
                  setuserModalOpen((prev) => !prev);
                }}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
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
                    required
                    placeholder="Enter full name"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="mobilenumber"
                    pattern="\d{10}"
                    maxLength="10"
                    inputMode="numeric"
                    placeholder="Phone number"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token ID
                  </label>
                  <input
                    type="password"
                    name="tokenid"
                    readOnly
                    value="TokenID"
                    placeholder="Enter Token ID"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Create password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className=" cursor-pointer absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
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
                    required
                    placeholder="Confirm password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConformPasswordVisible(!conformpasswordVisible)
                    }
                    className="cursor-pointer absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
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
                    required
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={localStorage.getItem("channel_name")}
                    name="Channelid"
                    // placeholder="Channel ID"
                    // onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App ID
                  </label>
                  <input
                    type="password"
                    name="appid"
                    readOnly
                    value="appid"
                    placeholder="App ID"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div> */}
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 transform mt-4"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      )}

      {Adminlimitpopup && (
        <div
          id="popup-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg">
              <div
                onClick={() => setAdminlimitpopup(false)}
                className="p-6 text-center"
              >
                <svg
                  className="mx-auto mb-4 text-red-600 w-14 h-14"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  User Limit Reached
                </h3>
                <p className="mb-6 text-gray-600">
                  You have reached your limit to create a user. Please contact
                  your SuperUser.
                </p>
                <button
                  onClick={() => setAdminlimitpopup(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {Logoutpopup && (
        <div
          id="logout-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg">
              <button
                type="button"
                className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setlogoutpopup(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Do you want to logout?
                </h3>
                <div className="flex justify-center space-x-4">
                  <button
                    className="cursor-pointer px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => navigate("/adminlogin")} // Call your logout function
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setlogoutpopup(false)}
                    className="cursor-pointer px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {Passwordresetpopup && (
        <div
          id="password-reset-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg p-6">
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setPasswordresetpopup(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="text-center">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Reset Password
                </h3>

                {/* New Password Field */}
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setPasswordreset({
                        ...Passwordreset,
                        password: e.target.value,
                      })
                    }
                    placeholder="New Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) =>
                      setPasswordreset({
                        ...Passwordreset,
                        conformpassword: e.target.value,
                      })
                    }
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={handlePasswordReset}
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => setPasswordresetpopup(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
