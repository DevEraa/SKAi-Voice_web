import React, {useState} from 'react'
import Navbar from './Navbar';
import { Search, Lock, Unlock, Edit, Trash2, FileText, Eye } from "lucide-react";
export default function CallHistory() {

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;

    const [users, setUsers] = useState([
        {Name:"Nayan", Date: "20 March 2025", Cost: "45", Time: "20 min" },
        {Name:"Nayan", Date: "20 March 2025", Cost: "45", Time: "20 min" },
        {Name:"Nayan", Date: "20 March 2025", Cost: "45", Time: "20 min" },
        {Name:"Nayan", Date: "20 March 2025", Cost: "45", Time: "20 min" },
        {Name:"Nayan", Date: "20 March 2025", Cost: "45", Time: "20 min" },
        {Name:"Nayan", Date: "20 March 2025", Cost: "45", Time: "20 min" },
    ]);

    const toggleLock = (index) => {
        setUsers(users.map((user, i) => i === index ? { ...user, locked: !user.locked } : user));
    };

    const filteredUsers = users.filter(user =>
        user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Cost.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Time.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);

    return (
        <>
            <Navbar />
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
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <div className="min-w-full inline-block align-middle">
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                    <th className="px-6 py-3 text-start text-sm font-semibold">Name</th>
                                        <th className="px-6 py-3 text-start text-sm font-semibold">Date</th>
                                        <th className="px-6 py-3 text-start text-sm font-semibold">Time</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold">Cost</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300 bg-white">
                                    {currentRecords.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-100 transition">
                                              <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.Name}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.Date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 ">{user.Time}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center">{user.Cost}</td>

                                            <td className="px-6 py-4 text-center">
                                                <button className="text-red-500 hover:text-red-700 transition">
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
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50">
                        Previous
                    </button>
                    <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>

        </>
    )
}
