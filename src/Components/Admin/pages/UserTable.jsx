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
import adminHooks from "../store/hook";
import Navbar from "./Navbar";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";


export default function UserTable() {
  const navigate = useNavigate();

  const {
    listTeamUsers,
    getTeamUserById,
    createTeamUser,
    deleteuser,
    updateTeamUser,
  } = adminHooks();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [deletepopup, setDeletepopup] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conformpasswordVisible, setConformPasswordVisible] = useState(false);

  const [users, setUsers] = useState([]);
  const [selecteduser, setselecteduser] = useState();
  const [Logadminid, setLogadminid] = useState("");
  const [userToToggle, setUserToToggle] = useState();
  const [lockUnlockPopup, setLockUnlockPopup] = useState(false);

  console.log(users, "user");
  useEffect(() => {
    setLogadminid(localStorage.getItem("admin_id"));
  }, [currentPage]);

  useEffect(() => {
    fetchlist();
  }, [currentPage, Logadminid]);

  const fetchlist = async () => {
    console.log("Logadminid", Logadminid);
    try {
      const pagesize = recordsPerPage;
      const offset = (currentPage - 1) * recordsPerPage; // Calculate offset based on current page
      const response = await listTeamUsers(Logadminid, pagesize, offset);
      setUsers(response);
      console.log("response", response.length);
      localStorage.setItem("totaluser", response.length);

      // If API returns total count, use it
      if (response.totalCount) {
        setTotalCount(response.totalCount);
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const [formData, setFormData] = useState({
    name: "",
    mobilenumber: "",
    username: "",
    tokenid: "",
    Channelid: "",
    mobilenumber: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (selecteduser) {
      setFormData({
        name: selecteduser.name || "",
        mobilenumber: selecteduser.mobilenumber || "",
        username: selecteduser.username || "",
        tokenid: selecteduser.tokenid,
        Channelid: selecteduser.Channelid,
        password: selecteduser.password,
        confirmPassword: selecteduser.password,
      });
    }
  }, [selecteduser]);

  const handleConfirmDelete = async () => {
    const response = await deleteuser(selecteduser.id); // ✅ Await the response
    console.log("Delete response:", response);
    fetchlist();
    setDeletepopup(false);
  };

  console.log("selecteduser", selecteduser); // ✅ This should now log the correct user ID
  const updateuser = async (e) => {
    e.preventDefault();
    console.log("selecteduser", selecteduser);
    console.log("formData", formData.password);
    if (formData?.password !== formData?.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Does Not Match",
      });
      return;
    }

    const response = await updateTeamUser(selecteduser.id, formData); // ✅ Await the response
    console.log("UPdate response:", response);
    fetchlist();
    setModalOpen(false);
  };
  const [usermodalOpen, setuserModalOpen] = useState(false);

  useEffect(() => {
    console.log("userModalOpen changed:", usermodalOpen);
    fetchlist();
  }, [usermodalOpen]);

  const toggleLockStatus = async (adminId, isLocked) => {
    console.log("userToToggle", userToToggle);
    console.log(adminId, userToToggle.status);
    try {
      const updateData = {
        status: userToToggle?.status ? 0 : 1,
      };
      console.log("updateData", updateData);
      await updateTeamUser(adminId, updateData);
      fetchlist();
      // listAdmin(recordsPerPage, (currentPage - 1) * recordsPerPage); // Refresh list
    } catch (error) {
      console.error("Error updating lock status:", error);
    }
  };
  return (
    <>
      <Navbar
        usermodalOpen={usermodalOpen}
        setuserModalOpen={setuserModalOpen}
      />
      <div className="container mx-auto p-3 md:w-4/5 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="relative md:w-1/3 w-full">
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-start text-sm font-semibold">
                      Username
                    </th>
                    <th className="px-6 py-3 text-start text-sm font-semibold">
                      Mobile Number
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
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.status ? (
                          <span>Active</span>
                        ) : (
                          <span>Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {user.mobilenumber}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setUserToToggle(user);
                            setLockUnlockPopup(true);
                          }}
                          className="cursor-pointer text-gray-600 hover:text-gray-800 transition"
                        >
                          {user.status ? (
                            <Unlock size={20} />
                          ) : (
                            <Lock size={20} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setselecteduser(user); // ✅ Set selected user ID
                            setModalOpen(true);
                          }}
                          className="cursor-pointer text-yellow-500 hover:text-yellow-700 transition"
                        >
                          <Edit size={20} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          // onClick={() => setDeletepopup(!deletepopup)}
                          onClick={() => {
                            setselecteduser(user);
                            setDeletepopup(true);
                          }}
                          className="cursor-pointer text-red-500 hover:text-red-700 transition"
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
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 hidden md:inline-block">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
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
              <h2 className="text-2xl font-bold text-gray-800">Update User</h2>
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

            <form className="space-y-4" onSubmit={updateuser}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter full name"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token ID
                  </label>
                  <input
                    type="text"
                    name="tokenid"
                    value={formData.tokenid}
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
                    value={formData.password}
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
                    value={
                      formData.confirmPassword !== undefined
                        ? formData.confirmPassword
                        : formData.password
                    }
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

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
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
                    value={sessionStorage
                      .getItem("channel_name")
                      .replace(/"/g, "")}
                    name="Channelid"
                    placeholder="Channel ID"
                    // onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    value={formData.mobilenumber}
                    name="mobilenumber"
                    placeholder="Phone number"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    name="appid"

                    placeholder="App ID"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div> */}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 transform mt-4"
              >
                Update User
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
                  This will permanently delete the item and cannot be recovered.
                  Are you sure you want to continue?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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

      {lockUnlockPopup && (
        <div
          id="lock-unlock-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg">
              <button
                type="button"
                className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setLockUnlockPopup(false)}
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
                  className={` mx-auto mb-4 ${
                    !userToToggle?.status ? "text-green-600" : "text-red-600"
                  } w-14 h-14`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      !userToToggle?.status
                        ? "M5 12h14M12 5v14M9 9l6 6M9 15l6-6"
                        : "M6 18L18 6M6 6l12 12"
                    }
                  />
                </svg>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  {!userToToggle?.status
                    ? "Unlock User Access"
                    : "Lock User Access"}
                </h3>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to{" "}
                  {!userToToggle?.status ? "unlock" : "lock"} the User{" "}
                  <span className="font-semibold">{!userToToggle?.status}</span>
                  ?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    className={`cursor-pointer px-6 py-2 text-white rounded-md transition-colors ${
                      !userToToggle?.status
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => {
                      toggleLockStatus(userToToggle.id, !userToToggle.locked);
                      setLockUnlockPopup(false);
                      // listAdmin(recordsPerPage, (currentPage - 1) * recordsPerPage);
                    }}
                  >
                    {!userToToggle?.status ? "Unlock" : "Lock"}
                  </button>
                  <button
                    onClick={() => setLockUnlockPopup(false)}
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
    </>
  );
}
