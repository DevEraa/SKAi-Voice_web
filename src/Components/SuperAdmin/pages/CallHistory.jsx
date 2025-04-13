import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import superadminApp from "../store/hook";
import {
  Search,
  Lock,
  Unlock,
  Edit,
  Trash2,
  FileText,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

export default function CallHistory() {
  const {
    adminhistory,
    deleteadminhistory,
    deleteAllRecordings,
    adminDropdown,
  } = superadminApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletepopup, setDeletepopup] = useState(false);
  const [userToDelete, setuserToDelete] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const recordsPerPage = 8;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDetailIds, setSelectedDetailIds] = useState([]);
  const [deletebydatepopup, setdeletebydatepopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [aggregatedUsers, setAggregatedUsers] = useState([]);
  const [adminValues, setAdminValues] = useState([]);

  useEffect(() => {
    const res = adminDropdown();
    res.then((res) => {
      setAdminValues(res);
    });
  }, []);



  console.log("adminValues", selectedUser);

  const aggregateUsers = (history) => {
    const userMap = new Map();

    history.forEach((record) => {
      if (!userMap.has(record.name)) {
        userMap.set(record.name, {
          name: record.name,
          totalTime: 0,
          totalCost: 0,
        });
      }

      const user = userMap.get(record.name);

      let seconds = 0;

      // Match and convert "min=1, sec=54" format
      const match = record.calltime.match(/min=(\d+),\s*sec=(\d+)/);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        seconds = min * 60 + sec;
      } else {
        // Try parsing if calltime is just seconds
        const raw = parseInt(record.calltime.replace(/\D/g, ''), 10);
        seconds = isNaN(raw) ? 0 : raw;
      }

      user.totalTime += seconds;
      user.totalCost += parseFloat(record.cost) || 0;
    });

    return Array.from(userMap.values());
  };


  // Filter users based on view mode
  const filteredUsers = selectedUser
    ? users.filter((user) => user.name === selectedUser)
    : aggregatedUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const fetchlist = async () => {
    try {
      const response = await adminhistory();
      setUsers(response.Histoty);
      setAggregatedUsers(aggregateUsers(response.Histoty));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchlist();
  }, [deletepopup]);

  const deletehistory = (id) => {
    console.log(id);
    setuserToDelete(id);
    setDeletepopup(true);
  };

  const Deleteadminbyid = async () => {
    console.log(userToDelete, "usertodelete");
    const id = userToDelete;
    const deletehistory = await deleteadminhistory(id);
    console.log(deletehistory);
    Swal.fire({
      title: "Successfull !",
      text: "Delete successfully",
      icon: "success",
    });
    fetchlist();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
  };

  const deletehstory = async () => {
    if (!startDate || !endDate) {
      alert("Please select both from and to dates.");
      return;
    }
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    console.log("first", {
      superadminname: "admin@123",
      fromDate: formattedStart,
      toDate: formattedEnd,
      selectedUser: selectedUser || "all",
    });

    try {
      const response = deleteAllRecordings({
        superadminname: "admin@123",
        fromDate: formattedStart,
        toDate: formattedEnd,
        selectedUser: selectedUser || "all",
      });
      fetchlist();
      Swal.fire({
        title: "Successfull !",
        text: "Delete successfully",
        icon: "success",
      });
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.log("data", data);
      console.error(err);
      alert("Error deleting recordings.");
    }
  };

  const multipledelete = async () => {
    try {
      await Promise.all(selectedDetailIds.map((id) => deleteadminhistory(id)));
      fetchlist();
      // alert("Selected records deleted.");
      Swal.fire({
        title: "Successfull !",
        text: "Delete successfully",
        icon: "success",
      });
      setSelectedDetailIds([]);
    } catch (err) {
      console.error(err);
      alert("Error deleting selected records.");
    }
  };

  const formatCallTime = (calltime) => {
    if (!calltime) return '0 sec';

    // If it's already in "min=X, sec=Y" format
    const match = calltime.match(/min=(\d+),\s*sec=(\d+)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return `${minutes > 0 ? `${minutes} min ` : ''}${seconds} sec`;
    }

    // If it's a raw second value (e.g., "114 Sec" or just "114")
    const rawSeconds = parseInt(calltime.replace(/\D/g, ''), 10);
    const minutes = Math.floor(rawSeconds / 60);
    const seconds = rawSeconds % 60;

    return `${minutes > 0 ? `${minutes} min ` : ''}${seconds} sec`;
  };

  const formatSecondsToMinSec = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins} min ` : ''}${secs} sec`;
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6 w-full md:w-4/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Select Admin
              </label>
              <select
                className="p-2 border rounded-md text-sm"
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                }}
                value={selectedUser}
              >
                <option value="all">All</option>
                {adminValues.map((admin) => (
                  <option key={admin.id} value={admin.name}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            onClick={() => setdeletebydatepopup(true)}
          >
            Delete by Date
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          {/* {selectedUser === null && (
           
          )} */}
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

          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="ml-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back to All Users
            </button>
          )}

          {selectedUser && selectedDetailIds.length > 0 && (
            <div className="mb-4">
              <button
                onClick={multipledelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete Selected ({selectedDetailIds.length})
              </button>
            </div>
          )}
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
                    {selectedUser ? (
                      <>
                        <th className="px-6 py-3 text-start text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-6 py-3 text-start text-sm font-semibold">
                          Time
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Delete
                        </th>
                        {selectedUser && (
                          <th className="px-6 py-3 text-center text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={
                                currentRecords.length > 0 &&
                                currentRecords.every((user) =>
                                  selectedDetailIds.includes(user.id)
                                )
                              }
                              onChange={(e) => {
                                const ids = e.target.checked
                                  ? currentRecords.map((u) => u.id)
                                  : [];
                                setSelectedDetailIds(ids);
                              }}
                            />
                          </th>
                        )}
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-start text-sm font-semibold">
                          Total Time
                        </th>
                        <th className="px-6 py-3 text-start text-sm font-semibold">
                          Total Cost
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          View
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  {currentRecords.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 transition"
                      onClick={() =>
                        !selectedUser && setSelectedUser(user.name)
                      }
                      style={{ cursor: !selectedUser ? "pointer" : "default" }}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 text-nowrap">
                        {user.name}
                      </td>
                      {selectedUser ? (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                            {user.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {formatCallTime(user.calltime)}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center text-nowrap">
                            {/* {user.cost} */}
                            {`$ ${parseFloat(user.cost)}`}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletehistory(user.id);
                              }}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                          {selectedUser && (
                            <td className="px-6 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedDetailIds.includes(user.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const updatedSelection = e.target.checked
                                    ? [...selectedDetailIds, user.id]
                                    : selectedDetailIds.filter(
                                      (id) => id !== user.id
                                    );
                                  setSelectedDetailIds(updatedSelection);
                                }}
                              />
                            </td>
                          )}
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {formatSecondsToMinSec(user.totalTime)}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                            {`$ ${parseFloat(user.totalCost)}`}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user.name);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition"
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

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
                className=" cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
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
              <div className="cursor-pointer p-6 text-center">
                <svg
                  className="cursor-pointer mx-auto mb-4 text-red-600 w-14 h-14"
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
                    {/* {userToDelete?.username} */}
                  </span>{" "}
                  and cannot be recovered. Are you sure you want to continue?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    // onClick={handleConfirmDelete}
                    className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => {
                      Deleteadminbyid();

                      setDeletepopup(false);
                    }}
                  >
                    Delete Permanently
                  </button>
                  <button
                    onClick={() => setDeletepopup(false)}
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

      {deletebydatepopup && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-lg">
              <button
                type="button"
                className=" cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setdeletebydatepopup(false)}
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
              <div className="cursor-pointer p-6 text-center">
                <svg
                  className="cursor-pointer mx-auto mb-4 text-red-600 w-14 h-14"
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
                  This will permanently delete the admin and whose user
                  recording and cannot be recovered. Are you sure you want to
                  continue?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    // onClick={handleConfirmDelete}
                    className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => {
                      deletehstory();
                      setdeletebydatepopup(false);
                    }}
                  >
                    Delete Permanently
                  </button>
                  <button
                    onClick={() => setdeletebydatepopup(false)}
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
