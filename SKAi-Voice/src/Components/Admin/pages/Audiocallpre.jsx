import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import image from "../../../assets/startsession.webp";

// Agora App ID
const APP_ID = "e9d4b556259a45f18121742537c185ad";
const API_URL = "http://localhost:3000/v1/call"; // Your backend API URL

export default function Audiocallpre() {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [meetingName, setMeetingName] = useState("Team Meeting");
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localUidRef = useRef(null);

  useEffect(() => {
    // Initialize Agora client
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Set up event listeners for user joining and leaving
    client.current.on("user-published", handleUserPublished);
    client.current.on("user-left", handleUserLeft);

    return () => {
      endSession();
      client.current.off("user-published", handleUserPublished);
      client.current.off("user-left", handleUserLeft);
    };
  }, []);

  const handleUserPublished = async (user, mediaType) => {
    await client.current.subscribe(user, mediaType);
    if (mediaType === "audio") {
      user.audioTrack.play();
    }

    // Update participants list
    setParticipants((prev) => {
      if (!prev.some((p) => p.uid === user.uid)) {
        return [
          ...prev,
          {
            uid: user.uid,
            name: `Team Member ${user.uid - 2000}`,
            isSpeaking: false,
            isMuted: false,
          },
        ];
      }
      return prev;
    });
  };

  const handleUserLeft = (user) => {
    setParticipants((prev) => prev.filter((p) => p.uid !== user.uid));
  };

  const startSession = async () => {
    setLoading(true);
    setError("");

    try {
      // Create meeting on backend
      const response = await axios.post(`${API_URL}/meetings/create`, {
        meetingName: meetingName,
        adminName: "John Doe",
      });

      const { channelName, token, adminUid } = response.data;
      setChannelName(channelName);
      localUidRef.current = adminUid;

      // Configure Agora client role
      client.current.setClientRole("host");

      // Join the Agora channel
      await client.current.join(APP_ID, channelName, token, adminUid);

      // Create local audio track
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      await client.current.publish([localAudioTrack.current]);

      // Add admin to participants list
      setParticipants([
        {
          uid: adminUid,
          name: "John Doe (You)",
          isLocal: true,
          isAdmin: true,
          isSpeaking: false,
          isMuted: false,
        },
      ]);

      setIsSessionStarted(true);
    } catch (error) {
      console.error("Error starting session:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to start session"
      );
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (localAudioTrack.current) {
      localAudioTrack.current.stop();
      localAudioTrack.current.close();
    }

    if (client.current && isSessionStarted) {
      // Update meeting status in backend
      if (channelName) {
        try {
          await axios.post(`${API_URL}/meetings/update`, {
            isActive: false,
            channelName: channelName,
          });
        } catch (error) {
          console.error("Error updating meeting status:", error);
        }
      }

      await client.current.leave();
    }

    setIsSessionStarted(false);
    setParticipants([]);
    setChannelName("");
  };

  const toggleMute = async () => {
    if (localAudioTrack.current) {
      isMuted
        ? await localAudioTrack.current.setMuted(false)
        : await localAudioTrack.current.setMuted(true);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full md:w-5/6 h-[70vh] mx-auto my-16 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col">
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
              onClick={startSession}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 shadow-md"
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Session"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </>
      ) : (
        /* Meeting View */
        <div className="flex-1 flex flex-col p-8 bg-blue-300">
          {/* Meeting Header */}
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-white">{meetingName}</h2>
            <p className="text-blue-100">Active Call</p>
          </div>

          {/* Participants Section */}
          <div className="flex flex-row overflow-x-auto gap-5 justify-center">
            {/* Local User */}
            <div className="bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100">
              <div className="flex flex-col items-center space-y-4">
                {/* Profile Initial */}
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-500">J</span>
                </div>

                {/* Profile Info */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    John Doe
                  </h2>
                  <p className="text-blue-500 text-sm mt-1">Local User</p>
                </div>

                {/* Audio Controls */}
                <div className="flex space-x-4 w-full justify-center">
                  <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full ${
                      isMuted
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } transition-colors duration-200`}
                  >
                    {isMuted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mic-off"
                      >
                        <line x1="2" x2="22" y1="2" y2="22" />
                        <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
                        <path d="M5 10v2a7 7 0 0 0 12 5" />
                        <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mic"
                      >
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                      </svg>
                    )}
                  </button>

                  <button
                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
                    onClick={endSession}
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

            {/* Other Participants */}
            {participants
              .filter((p) => !p.isLocal)
              .map((participant) => (
                <div
                  key={participant.uid}
                  className="bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100"
                >
                  <div className="flex flex-col items-center space-y-4">
                    {/* Profile Initial */}
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-500">
                        {participant.name.charAt(0)}
                      </span>
                    </div>

                    {/* Profile Info */}
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {participant.name}
                      </h2>
                      <p className="text-blue-500 text-sm mt-1">
                        {participant.isMuted ? "Muted" : "Active"}
                      </p>
                    </div>

                    {/* Audio Status */}
                    <div className="flex space-x-4 w-full justify-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          participant.isMuted ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes zoomInOut {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-zoomInOut {
          animation: zoomInOut 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
