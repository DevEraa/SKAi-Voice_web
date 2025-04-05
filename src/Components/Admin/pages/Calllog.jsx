import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Search } from "lucide-react";

export default function Calllog() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [playing, setPlaying] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    console.log("user", selectedUser)
    // Sample users data - replace with actual API call
    const [users] = useState([
        { id: 84, name: "Nayan", totalDuration: "23 min" },
        { id: 58, name: "Alice", totalDuration: "15 min" },
        { id: 59, name: "Bob", totalDuration: "30 min" }
    ]);

    useEffect(() => {

        if (selectedUser) {
            fetch(`https://demoapi.deveraa.com/v1/add/recordings/recordings/admin/${selectedUser}`)
                .then(response => response.json())
                .then(data => setRecordings(data.recordings))
                .catch(error => console.error('Error fetching recordings:', error));
        }
    }, [selectedUser]);

    const handlePlay = (index) => {
        setPlaying(playing === index ? null : index);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-3 md:w-4/5 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    <h1 className='text-xl font-semibold py-2'>
                        {selectedUser ? `User: ${users.find(u => u.id === selectedUser)?.name}` : "All Users"}
                    </h1>

                    <div className="relative md:w-1/3 w-full">
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
                                        <th className="px-6 py-3 text-start text-sm font-semibold">
                                            {selectedUser ? "Recording Name" : "User Name"}
                                        </th>
                                        <th className="px-6 py-3 text-start text-sm font-semibold">
                                            {selectedUser ? "Duration" : "Total Duration"}
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold">
                                            {selectedUser ? "Recording" : "Actions"}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300 bg-white">
                                    {!selectedUser ? (
                                        filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-100 transition cursor-pointer"
                                                onClick={() => setSelectedUser(user.id)}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {user.totalDuration}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 transition"
                                                        onClick={() => setSelectedUser(user.id)}
                                                    >
                                                        View Recordings
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        recordings?.map((recording, index) => (
                                            <tr key={index} className="hover:bg-gray-100 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {recording.filename}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {/* Duration would typically come from API */}
                                                    {Math.floor(Math.random() * 10) + 1} min
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 transition"
                                                        onClick={() => handlePlay(index)}
                                                    >
                                                        Play
                                                    </button>
                                                    {playing === index && (
                                                        <audio controls autoPlay className="mt-2">
                                                            <source src={recording.url} type="audio/mp3" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedUser && (
                    <button
                        onClick={() => {
                            setSelectedUser(null);
                            setRecordings([]);
                        }}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Back to All Users
                    </button>
                )}
            </div>
        </>
    );
}