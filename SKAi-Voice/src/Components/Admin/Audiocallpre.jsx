import React, { useState } from 'react';
import image from '../../assets/startsession.webp';

export default function Audiocallpre() {
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    return (
        <div className="w-5/6 h-[70vh] mx-auto my-16  bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col">
            {!isSessionStarted ? (
                <>
                    {/* Initial View */}
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="relative w-full h-64 overflow-hidden">
                            <img
                                src={image}
                                alt="Session"
                                className="w-full h-full object-contain animate-zoomInOut"
                            />
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="p-6 text-center border-t border-blue-50">
                        <button
                            onClick={() => setIsSessionStarted(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 shadow-md"
                        >
                            Start Session
                        </button>
                    </div>
                </>
            ) : (
                /* Meeting View */
                <div className="flex-1 flex flex-row items-center justify-center p-8 gap-5 bg-blue-300">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Profile Initial */}
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-blue-500">R</span>
                            </div>

                            {/* Profile Info */}
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-800">Ritika Malve</h2>
                                <p className="text-blue-500 text-sm mt-1">Host</p>
                            </div>

                            {/* Audio Controls */}
                            <div className="flex space-x-4 w-full justify-center">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`p-3 rounded-full ${isMuted
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } transition-colors duration-200`}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {isMuted ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-off"><line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        )}
                                    </svg>
                                </button>

                                <button
                                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
                                    onClick={() => setIsSessionStarted(false)}
                                >
                                    <svg
                                        className="w-6 h-6 text-blue-500"
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
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Profile Initial */}
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-blue-500">R</span>
                            </div>

                            {/* Profile Info */}
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-800">Ritika Malve</h2>
                                <p className="text-blue-500 text-sm mt-1">Host</p>
                            </div>

                            {/* Audio Controls */}
                            <div className="flex space-x-4 w-full justify-center">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`p-3 rounded-full ${isMuted
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } transition-colors duration-200`}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {isMuted ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-off"><line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        )}
                                    </svg>
                                </button>

                                <button
                                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
                                    onClick={() => setIsSessionStarted(false)}
                                >
                                    <svg
                                        className="w-6 h-6 text-blue-500"
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
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Profile Initial */}
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-blue-500">R</span>
                            </div>

                            {/* Profile Info */}
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-800">Ritika Malve</h2>
                                <p className="text-blue-500 text-sm mt-1">Host</p>
                            </div>

                            {/* Audio Controls */}
                            <div className="flex space-x-4 w-full justify-center">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`p-3 rounded-full ${isMuted
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } transition-colors duration-200`}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {isMuted ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-off"><line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        )}
                                    </svg>
                                </button>

                                <button
                                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
                                    onClick={() => setIsSessionStarted(false)}
                                >
                                    <svg
                                        className="w-6 h-6 text-blue-500"
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes zoomInOut {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-zoomInOut {
          animation: zoomInOut 8s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}