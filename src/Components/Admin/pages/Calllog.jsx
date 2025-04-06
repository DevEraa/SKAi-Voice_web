import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Search, Trash2 } from "lucide-react";

export default function Calllog() {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [selectedRecordings, setSelectedRecordings] = useState([]);
    const [playing, setPlaying] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [teams, setTeams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [deletePopup, setDeletePopup] = useState(false);
    const [selectedFileToDelete, setSelectedFileToDelete] = useState(null);
    const [multiDeleteMode, setMultiDeleteMode] = useState(false);

    useEffect(() => {
        const id = localStorage.getItem("admin_id");
        console.log("id",id)
        fetch(`https://demoapi.deveraa.com/v1/add/recordings/recordings/admin/${id}`)
            .then(res => res.json())
            .then(data => {
                const uniqueTeams = [];
                const seen = new Set();
                data.recordings?.forEach(item => {
                    if (item.teamName && !seen.has(item.teamId)) {
                        seen.add(item.teamId);
                        uniqueTeams.push({ id: item.teamId, name: item.teamName });
                    }
                });
                setTeams(uniqueTeams);
            })
            .catch(err => console.error("Error fetching team names:", err));
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            const id = localStorage.getItem("admin_id");
            console.log("id",id)
            fetch(`https://demoapi.deveraa.com/v1/add/recordings/recordings/admin/${id}`)
                .then(response => response.json())
                .then(data => {
                    const filtered = data.recordings?.filter(
                        (rec) => rec.teamId === selectedTeam.id
                    );
                    setRecordings(filtered || []);
                    setSelectedRecordings([]);
                })
                .catch(error => console.error('Error fetching recordings:', error));
        }
    }, [selectedTeam]);

    const handlePlay = (index) => {
        setPlaying(playing === index ? null : index);
    };

    const handleConfirmDelete = async () => {
        let filesToDelete = [];
        if (multiDeleteMode) {
            filesToDelete = selectedRecordings;
        } else if (selectedFileToDelete) {
            filesToDelete = [selectedFileToDelete];
        }

        try {
            const response = await fetch("https://demoapi.deveraa.com/v1/add/recordings/recordings/delete-from-url", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    superadminname: "admin@123",
                    files: filesToDelete.map(file => ({
                        url: file.url,
                        teamId: file.teamId,
                        filename: file.filename
                    }))
                })
            });

            const result = await response.json();
            if (result.success) {
                setRecordings(prev =>
                    prev.filter(r => !filesToDelete.some(f => f.filename === r.filename))
                );
                setSelectedRecordings([]);
                setDeletePopup(false);
                setMultiDeleteMode(false);
            } else {
                console.error("Delete failed:", result.message);
            }
        } catch (err) {
            console.error("Error deleting files:", err);
        }
    };

    const handleCheckboxChange = (recording) => {
        setSelectedRecordings(prev =>
            prev.some(r => r.filename === recording.filename)
                ? prev.filter(r => r.filename !== recording.filename)
                : [...prev, recording]
        );
    };

    const handleSelectAll = () => {
        const visible = paginatedData;
        const allSelected = visible.every(r =>
            selectedRecordings.some(s => s.filename === r.filename)
        );

        if (allSelected) {
            setSelectedRecordings(prev =>
                prev.filter(r => !visible.some(v => v.filename === r.filename))
            );
        } else {
            const newSelections = visible.filter(r =>
                !selectedRecordings.some(s => s.filename === r.filename)
            );
            setSelectedRecordings(prev => [...prev, ...newSelections]);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = selectedTeam
        ? recordings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : filteredTeams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = selectedTeam
        ? Math.ceil(recordings.length / itemsPerPage)
        : Math.ceil(filteredTeams.length / itemsPerPage);

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        setCurrentPage(1);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-3 md:w-4/5 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    {selectedTeam && (
                        <button
                            onClick={() => {
                                setSelectedTeam(null);
                                setRecordings([]);
                                setCurrentPage(1);
                            }}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Back to All Teams
                        </button>
                    )}

                    <h1 className='text-xl font-semibold py-2'>
                        {selectedTeam ? `Team: ${selectedTeam.name}` : "All Teams"}
                    </h1>

                    <div className="relative md:w-1/3 w-full">
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                {selectedTeam && selectedRecordings.length > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={() => {
                                setMultiDeleteMode(true);
                                setDeletePopup(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            <Trash2 size={18} /> Delete Selected ({selectedRecordings.length})
                        </button>
                    </div>
                )}

                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                {selectedTeam && (
                                    <th className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={paginatedData.every(r => selectedRecordings.some(s => s.filename === r.filename))}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                <th className="px-6 py-3 text-start text-sm font-semibold">
                                    {selectedTeam ? " File Name" : "Team Name"}
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold">
                                    {selectedTeam ? "Recording" : "Actions"}
                                </th>
                                <th className="px-6 py-3 text-start text-sm font-semibold mx-auto flex justify-center">
                                    {selectedTeam && "Delete"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300 bg-white">
                            {!selectedTeam ? (
                                paginatedData.map((team) => (
                                    <tr
                                        key={team.id}
                                        className="hover:bg-gray-100 transition cursor-pointer"
                                        onClick={() => handleTeamSelect(team)}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                            {team.name}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-blue-500 hover:text-blue-700 transition">
                                                View Recordings
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                paginatedData.map((recording, index) => (
                                    <tr key={index} className="hover:bg-gray-100 transition">
                                        <td className="px-4 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecordings.some(r => r.filename === recording.filename)}
                                                onChange={() => handleCheckboxChange(recording)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                            {recording.filename || "Not Available"}
                                        </td>
                                        <td className="px-6 py-4 text-center flex items-center justify-center gap-4">
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
                                        <td>
                                            <button
                                                className="text-red-500 hover:text-red-700 transition flex justify-center mx-auto"
                                                onClick={() => {
                                                    setSelectedFileToDelete(recording);
                                                    setMultiDeleteMode(false);
                                                    setDeletePopup(true);
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2 flex-wrap">
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Popup */}
            {deletePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-white rounded-lg shadow-lg">
                            <button
                                type="button"
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => {
                                    setDeletePopup(false);
                                    setMultiDeleteMode(false);
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="p-6 text-center">
                                <svg className="mx-auto mb-4 text-red-600 w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                    Confirm Deletion
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    {multiDeleteMode
                                        ? `You are about to delete ${selectedRecordings.length} recordings. This action cannot be undone.`
                                        : `This will permanently delete the selected recording. Are you sure?`}
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Confirm Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeletePopup(false);
                                            setMultiDeleteMode(false);
                                        }}
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
