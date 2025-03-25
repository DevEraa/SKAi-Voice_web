import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
import { Eye, EyeOff } from 'lucide-react';
import {
    NavLink
} from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        adminLimit: '',
        password: '',
        confirmPassword: '',
        appId: '',
        tokenId: '',
        channelId: '',
        phoneNumber: '',
        username: ''
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [conformpasswordVisible, setConformPasswordVisible] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <nav className="sticky top-0 px-4 py-4 flex justify-between shadow-md items-center bg-white z-50">
                <a className="text-3xl font-bold leading-none" href="#">
                    <img src={logo} alt="" width={70} />
                </a>
                <div className="lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="navbar-burger flex items-center text-blue-600 p-3">
                        <svg
                            className="block h-4 w-4 fill-current"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Mobile menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
                <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
                    <li>
                        <NavLink
                            to="/superadmindashboard"
                            className={({ isActive }) =>
                                isActive ? "text-sm text-blue-600 font-bold " : " text-sm text-gray-400 hover:text-gray-500"
                            }
                        >
                            Home
                        </NavLink>

                    </li>
                    <li className="text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            className="w-4 h-4 current-fill"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                        </svg>
                    </li>
                    <li onClick={() => setModalOpen(true)}>
                        <a
                            className={modalOpen ? "text-sm text-blue-600 font-bold" : "text-sm text-gray-400 hover:text-gray-500"}
                        >
                            Add Admin
                        </a>

                    </li>
                    <li className="text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            className="w-4 h-4 current-fill"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                        </svg>
                    </li>
                    <li>
                        <NavLink
                            to="/callhistory"
                            className={({ isActive }) =>
                                isActive ? "text-sm text-blue-600 font-bold " : " text-sm text-gray-400 hover:text-gray-500"
                            }
                        >
                            Call History
                        </NavLink>
                    </li>


                </ul>
                <a
                    className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
                    onClick={() => navigate('/')}
                >
                    Log out
                </a>
            </nav>
            <div className={`navbar-menu relative z-50 ${isOpen ? '' : 'hidden'}`}>
                <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25" onClick={() => setIsOpen(false)}
                />
                <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
                    <div className="flex items-center mb-8">
                        <a className="mr-auto text-3xl font-bold leading-none" href="#">
                            <img src={logo} alt="" width={100} />
                        </a>
                        <button className="navbar-close" onClick={() => setIsOpen(false)}>
                            <svg
                                className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
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
                    <div>
                        <ul>
                            <li className="mb-1">
                                <NavLink
                                    to="/superadmindashboard"
                                    className={({ isActive }) =>
                                        isActive ? "text-sm text-blue-600 font-bold " : " text-sm text-gray-400 hover:text-gray-500"
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="mb-1" onClick={() => setModalOpen(true)}>
                                <a
                                    className="block py-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    href="#"
                                >
                                    Add Admin
                                </a>
                            </li>
                            <li className="mb-1">
                                <NavLink
                                    to="/callhistory"
                                    className={({ isActive }) =>
                                        isActive ? "text-sm text-blue-600 font-bold " : " text-sm text-gray-400 hover:text-gray-500"
                                    }
                                >
                                    Call History
                                </NavLink>
                            </li>


                        </ul>
                    </div>
                    <div className="mt-auto">
                        <div className="pt-6" onClick={() => navigate('/')}>

                            <a
                                className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl"

                            >
                                Log Out
                            </a>
                        </div>
                        <p className="my-4 text-xs text-center text-gray-400">
                            {/* <span>Desing by DevEaa Copyright © 2025</span> */}
                        </p>
                    </div>
                </nav>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px] max-w-[95%] border border-gray-100 animate-scaleIn">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Admin</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter full name"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Limit</label>
                                    <input
                                        type="number"
                                        name="adminLimit"
                                        placeholder="Set admin limit"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                                        {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type={conformpasswordVisible ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setConformPasswordVisible(!conformpasswordVisible)}
                                        className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {conformpasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                                    <input
                                        type="text"
                                        name="appId"
                                        placeholder="Enter app ID"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
                                    <input
                                        type="text"
                                        name="tokenId"
                                        placeholder="Token ID"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel ID</label>
                                    <input
                                        type="text"
                                        name="channelId"
                                        placeholder="Channel ID"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Phone number"
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 transform mt-4"
                            >
                                Add Admin
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>

    )
}
