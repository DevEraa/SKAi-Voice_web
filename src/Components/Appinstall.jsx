import React from 'react';
import { FaDownload, FaMobileAlt, FaStar } from 'react-icons/fa';
import app1 from '../assets/Images/app1.png';
import app2 from '../assets/Images/app2.png';
import app3 from '../assets/Images/app3.png';
import logo from '../assets/logo.jpg';
// import APK from '../assets/skaiclientlock.apk'

const AppInstallCard = () => {

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* App Header */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={logo}
                    alt="Transload App Icon"
                    className="w-20 h-20 rounded-lg"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">Skai Voice</h1>

                </div>
            </div>

            {/* Screenshots Scroll */}
            <div className="flex gap-4 overflow-x-auto my-6 pb-2 ">
                <img
                    key={app1}
                    src={app3}
                    alt={`Screenshot`}
                    className="w-32 h-64 rounded-lg border border-gray-200"
                />
                <img
                    key={app1}
                    src={app1}
                    alt={`Screenshot`}
                    className="w-32 h-64 rounded-lg border border-gray-200"
                />
                <img
                    key={app1}
                    src={app2}
                    alt={`Screenshot`}
                    className="w-32 h-64 rounded-lg border border-gray-200"
                />


            </div>

            {/* Download Button */}

            <button onClick={() => window.open("/skaiclientlock.apk")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg
                 flex items-center justify-center gap-2 transition-colors">
                <FaDownload />  Download APK
            </button>




        </div>
    );
};

export default AppInstallCard;