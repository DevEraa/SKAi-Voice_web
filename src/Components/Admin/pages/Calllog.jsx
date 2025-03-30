import React, { useState } from 'react';
import Navbar from './Navbar';
import { Search } from "lucide-react";

export default function Calllog() {
    const users = [
        { Name: "John Doe", CallDuration: "10 min", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { Name: "Jane Smith", CallDuration: "5 min", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { Name: "Alice Johnson", CallDuration: "8 min", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    ];

    const [playing, setPlaying] = useState(null);

    const handlePlay = (index) => {
        setPlaying(index);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-3 md:w-4/5 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    <h1 className='text-xl font-semibold py-2'>User : Nayan </h1>
                    <div className="relative md:w-1/3 w-full">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
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
                                        <th className="px-6 py-3 text-start text-sm font-semibold">Call Duration</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold">Recording</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300 bg-white">
                                    {users.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-100 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.Name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{user.CallDuration}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 transition"
                                                    onClick={() => handlePlay(index)}
                                                >
                                                    Play
                                                </button>
                                                {playing === index && (
                                                    <audio controls autoPlay className="mt-2">
                                                        <source src={user.audio} type="audio/mp3" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
