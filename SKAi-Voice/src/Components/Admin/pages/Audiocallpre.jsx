import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import image from "../../../assets/startsession.webp";

// Agora App ID
const APP_ID = "e9d4b556259a45f18121742537c185ad";
const API_URL = `${import.meta.env.VITE_APP_API_URL}/call`; // Your backend API URL

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
        <>
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } transition-colors duration-200`}
          >
            {isMuted ? (
              <span className="text-white">Unmute</span>
            ) : (
              <span className="text-white">Mute</span>
            )}
          </button>
          <button
            onClick={endSession}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 shadow-md"
          >
            end session
          </button>
          <div className="flex-1 flex flex-col p-8 bg-blue-300">
            {/* Meeting Header */}

            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-white">{meetingName}</h2>
              <p className="text-blue-100">Active Call</p>
            </div>

            {/* Participants Section */}
          </div>
        </>
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
