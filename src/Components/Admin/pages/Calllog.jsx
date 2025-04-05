import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Search } from "lucide-react";

export default function Calllog() {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [playing, setPlaying] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [teams, setTeams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetch('https://demoapi.deveraa.com/v1/add/recordings/recordings/admin/84')
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
            fetch(`https://demoapi.deveraa.com/v1/add/recordings/recordings/admin/84`)
                .then(response => response.json())
                .then(data => {
                    const filtered = data.recordings?.filter(
                        (rec) => rec.teamId === selectedTeam.id
                    );
                    setRecordings(filtered || []);
                })
                .catch(error => console.error('Error fetching recordings:', error));
        }
    }, [selectedTeam]);

    const handlePlay = (index) => {
        setPlaying(playing === index ? null : index);
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
        setCurrentPage(1); // Reset pagination on view change
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
                

                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <div className="min-w-full inline-block align-middle">
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-start text-sm font-semibold">
                                            {selectedTeam ? "Name" : "Team Name"}
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold">
                                            {selectedTeam ? "Recording" : "Actions"}
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
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 transition"
                                                        onClick={() => handleTeamSelect(team)}
                                                    >
                                                        View Recordings
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        paginatedData.map((recording, index) => (
                                            <tr key={index} className="hover:bg-gray-100 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {recording.teamName || "Not Available"}
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
        </>
    );
}
