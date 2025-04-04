import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import superadminApp from "../store/hook";
import { Search, Lock, Unlock, Edit, Trash2, FileText, Eye } from "lucide-react";
export default function CallHistory() {
    const { adminhistory, deleteadminhistory } = superadminApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deletepopup, setDeletepopup] = useState(false);
    const [userToDelete, setuserToDelete] = useState();
    const [selectedUser, setSelectedUser] = useState(null);
    const recordsPerPage = 8;

    const [users, setUsers] = useState([]);
    const [aggregatedUsers, setAggregatedUsers] = useState([]);


    const aggregateUsers = (history) => {
        const userMap = new Map();
        history.forEach(record => {
            if (!userMap.has(record.name)) {
                userMap.set(record.name, {
                    name: record.name,
                    totalTime: 0,
                    totalCost: 0
                });
            }
            const user = userMap.get(record.name);
            user.totalTime += Number(record.calltime);
            user.totalCost += Number(record.cost);
        });
        return Array.from(userMap.values());
    };

    // Get unique users for the initial list
    const getUniqueUsers = (history) => {
        const unique = Array.from(new Set(history.map(item => item.name)))
            .map(name => {
                return history.find(item => item.name === name);
            });
        return unique;
    };

    const toggleLock = (index) => {
        setUsers(users.map((user, i) => i === index ? { ...user, locked: !user.locked } : user));
    };

    // Filter users based on view mode
    const filteredUsers = selectedUser
        ? users.filter(user => user.name === selectedUser)
        : aggregatedUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);



    useEffect(() => {
        const fetchlist = async () => {
            try {
                const response = await adminhistory();
                setUsers(response.Histoty);
                setAggregatedUsers(aggregateUsers(response.Histoty));
            } catch (error) {
                console.log(error);
            }
        };
        fetchlist();
    }, [deletepopup]);

    const deletehistory = (id) => {
        console.log(id);
        setuserToDelete(id)
        setDeletepopup(true);
    }

    const Deleteadminbyid = async () => {
        console.log(typeof (userToDelete));
        const id = userToDelete;
        const deletehistory = await deleteadminhistory(id);
        console.log(deletehistory)
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6 w-full md:w-4/5">

                <div className="flex items-center justify-between mb-4">
                    {selectedUser === null && (
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                    )}


                    {selectedUser && (
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="ml-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Back to All Users
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <div className="min-w-full inline-block align-middle">
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-start text-sm font-semibold">Name</th>
                                        {selectedUser ? (
                                            <>
                                                <th className="px-6 py-3 text-start text-sm font-semibold">Date</th>
                                                <th className="px-6 py-3 text-start text-sm font-semibold">Time</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold">Cost</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold">Delete</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3 text-start text-sm font-semibold">Total Time</th>
                                                <th className="px-6 py-3 text-start text-sm font-semibold">Total Cost</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold">View</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300 bg-white">
                                    {currentRecords.map((user, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-100 transition"
                                            onClick={() => !selectedUser && setSelectedUser(user.name)}
                                            style={{ cursor: !selectedUser ? 'pointer' : 'default' }}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 text-nowrap">
                                                {user.name}
                                            </td>
                                            {selectedUser ? (
                                                <>
                                                    <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                                                        {user.date}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                                                        {`${parseFloat(user.calltime).toFixed(2)} Min`}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center text-nowrap">
                                                        {/* {user.cost} */}
                                                        {`$ ${parseFloat(user.cost).toFixed(2)}`}
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
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                                                        {/* {user.totalTime} */}
                                                        {`${parseFloat(user.totalTime).toFixed(2)} Min`}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                                                        {`$ ${parseFloat(user.totalCost).toFixed(2)}`}
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
        </>
    )
}
