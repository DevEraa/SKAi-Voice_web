import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import superadminApp from "../store/hook";
import { Search, Trash2, Eye } from "lucide-react";

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

    // Aggregate users with total time and cost
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

    // ... (keep deletehistory and Deleteadminbyid functions same as before)

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6 w-full md:w-4/5">
                {/* Search and Back Button (keep same as before) */}

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
                                                        {user.calltime}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center text-nowrap">
                                                        {user.cost}
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
                                                        {user.totalTime}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 text-nowrap">
                                                        {user.totalCost}
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

                {/* Pagination and Delete Modal (keep same as before) */}
            </div>
        </>
    )
}