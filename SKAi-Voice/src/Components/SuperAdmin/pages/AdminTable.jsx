import React, { useEffect, useState } from "react";
import {
  Search,
  Lock,
  Unlock,
  Edit,
  Trash2,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import superadminApp from "../store/hook";

export default function Table() {
  const { listAdmin, deleteAdmin, getAdminById, updateAdmin } = superadminApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conformpasswordVisible, setConformPasswordVisible] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchlist();
  }, [currentPage]); // Re-fetch when page changes

  const fetchlist = async () => {
    try {
      const pagesize = recordsPerPage;
      const offset = (currentPage - 1) * recordsPerPage; // Calculate offset based on current page
      const response = await listAdmin(pagesize, offset);
      setUsers(response);

      // If API returns total count, use it
      if (response.totalCount) {
        setTotalCount(response.totalCount);
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLock = (index) => {
    setUsers(
      users.map((user, i) =>
        i === index ? { ...user, locked: !user.locked } : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on total count (if available) or current data length
  const totalPages = totalCount
    ? Math.ceil(totalCount / recordsPerPage)
    : Math.ceil(filteredUsers.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const [formData, setFormData] = useState({
    email: "",
    adminlimits: "",
    password: "",
    confirmPassword: "",
    app_id: "",
    token_id: "",
    channel_name: "",
    username: "",
  });

  const handleEditClick = async (user) => {
    const fullUserDetails = await getAdminById(user.id);
    setFormData({
      email: fullUserDetails.email || "",
      adminlimits: fullUserDetails.adminlimits || "",
      password: "",
      confirmPassword: "",
      app_id: fullUserDetails.app_id || "",
      token_id: fullUserDetails.token_id || "",
      channel_name: fullUserDetails.channel_name || "",
      username: fullUserDetails.username || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [deletepopup, setDeletepopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Prepare data for update
      const updateData = { ...formData };

      // Only include password if it's not empty
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      // Remove unnecessary fields
      delete updateData.confirmPassword;

      await updateAdmin(user.id, updateData);

      // Refresh the list
      fetchlist();

      // Close modal
      setModalOpen(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDeleteClick = (user) => {
    // deleteAdmin(user.id);
    setUserToDelete(user);
    setDeletepopup(true);
  };

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 w-4/5">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <div className="min-w-full inline-block align-middle">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-start text-sm font-semibold">
                      Username
                    </th>
                    <th className="px-6 py-3 text-start text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Admin Limits
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Lock/Unlock
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Update
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  {currentRecords.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {user.username}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-800">
                        {user.email}
                      </td> */}
                      <td className="px-6 py-4 text-center text-sm text-gray-800">
                        {user.adminlimits}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleLock(index)}
                          className="text-gray-600 hover:text-gray-800 transition"
                        >
                          {user.locked ? (
                            <Unlock size={20} />
                          ) : (
                            <Lock size={20} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-yellow-500 hover:text-yellow-700 transition"
                        >
                          <Edit size={20} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNextPage}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px] max-w-[95%] border border-gray-100 animate-scaleIn">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Update Admin</h2>
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
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      App ID
                    </label>
                    <input
                      type="text"
                      name="app_id"
                      value={formData.app_id}
                      placeholder="Enter app ID"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token ID
                    </label>
                    <input
                      type="text"
                      name="token_id"
                      value={formData.token_id}
                      placeholder="Token ID"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Limit
                    </label>
                    <input
                      type="number"
                      name="adminlimits"
                      value={formData.adminlimits}
                      placeholder="Set admin limit"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Channel Name
                    </label>
                    <input
                      type="text"
                      name="channel_name"
                      value={formData.channel_name}
                      placeholder="Channel Name"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Create password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  />
                </div>

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

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={conformpasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
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

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Update Admin
              </button>
            </form>
          </div>
        </div>
      )}

      {deletepopup && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg">
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setDeletepopup(false)}
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
                  Confirm Permanent Deletion
                </h3>
                <p className="mb-6 text-gray-600">
                  This will permanently delete the admin{" "}
                  <span className="font-semibold">
                    {userToDelete?.username}
                  </span>{" "}
                  and cannot be recovered. Are you sure you want to continue?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    // onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => {
                      deleteAdmin(userToDelete.id);
                      setDeletepopup(false);
                      listAdmin(
                        recordsPerPage,
                        (currentPage - 1) * recordsPerPage
                      );
                    }}
                  >
                    Delete Permanently
                  </button>
                  <button
                    onClick={() => setDeletepopup(false)}
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
}
