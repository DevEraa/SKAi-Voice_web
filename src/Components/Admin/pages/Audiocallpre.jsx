import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import image from "../../../assets/startsession.webp";

// Agora App ID\

const APP_ID = sessionStorage.getItem("app_id"); // Your Agora App ID
// Channel name from session storage
// const APP_CERTIFICATE = sessionStorage.getItem("app_certificate"); // Your Agora App Certificate
const API_URL = `${import.meta.env.VITE_APP_API_URL}/call`; // Your backend API URL
// const channelName = sessionStorage.getItem("channel_name"); // Channel name from session storage

export default function Audiocallpre() {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [meetingName, setMeetingName] = useState("Team Meeting");
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [left, setLeft] = useState(false);
  const adminname = localStorage.getItem("admin_name");
  const channelNameis = sessionStorage.getItem("channel_name")
    ? sessionStorage.getItem("channel_name").replace(/"/g, "")
    : "";
  // console.log("channelNameis", channelNameis);

  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localUidRef = useRef(null);
  const remoteUserAudioStates = useRef({});
  const userNamesRef = useRef({}); // Store user names mapped to UIDs

  useEffect(() => {
    // Initialize Agora client
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Set up event listeners for user joining and leaving
    client.current.on("user-published", handleUserPublished);
    client.current.on("user-left", handleUserLeft);

    // Set up event listener for user-info-updated
    client.current.on("user-info-updated", handleUserInfoUpdated);

    return () => {
      cleanupSession();
      client.current.off("user-published", handleUserPublished);
      client.current.off("user-left", handleUserLeft);
      client.current.off("user-info-updated", handleUserInfoUpdated);
    };
  }, []);

  // Handle user info updates (like username)
  const handleUserInfoUpdated = (uid, msg) => {
    console.log("User info updated:", uid, msg);
    if (msg.userName) {
      userNamesRef.current[uid] = msg.userName;

      // Update the participants list with the new username
      setParticipants((prev) =>
        prev.map((p) => (p.uid === uid ? { ...p, name: msg.userName } : p))
      );
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    console.log("User published:", user);

    await client.current.subscribe(user, mediaType);

    if (mediaType === "audio") {
      // Play the audio
      user.audioTrack.play();

      // Store reference to track the remote user's audio enabled state
      remoteUserAudioStates.current[user.uid] = {
        audioTrack: user.audioTrack,
        enabled: true,
      };

      // Check if we have a stored name for this user
      const userName = userNamesRef.current[user.uid] || `User ${user.uid}`;

      // Update participants list if not already added
      setParticipants((prev) => {
        if (!prev.some((p) => p.uid === user.uid)) {
          return [
            ...prev,
            {
              uid: user.uid,
              name: userName,
              isSpeaking: false,
              isMuted: false,
            },
          ];
        }
        return prev;
      });

      // Request user metadata (this could include username)
      fetchUserMetadata(user.uid);
    }
  };

  console.log("participants", participants);
  // console.log()

  // Fetch user metadata from your backend
  const fetchUserMetadata = async (uid) => {
    try {
      const response = await axios.get(
        `${API_URL}/meetings/user-info/${channelNameis}/${uid}`
      );
      if (response.data && response.data.userName) {
        userNamesRef.current[uid] = response.data.userName;

        // Update the participants list with the fetched username
        setParticipants((prev) =>
          prev.map((p) =>
            p.uid === uid ? { ...p, name: response.data.userName } : p
          )
        );
      }
    } catch (error) {
      console.error("Error fetching user metadata:", error);
    }
  };

  const handleUserLeft = (user) => {
    // Clean up remote user's track reference
    if (remoteUserAudioStates.current[user.uid]) {
      delete remoteUserAudioStates.current[user.uid];
    }
    // Remove user from participants list
    setParticipants((prev) => prev.filter((p) => p.uid !== user.uid));
  };

  const startSession = async () => {
    setLoading(true);
    setError("");

    try {
      // Create meeting on backend (if needed)
      const response = await axios.post(`${API_URL}/meetings/create`, {
        meetingName: meetingName,
        adminName: `${adminname}`,
        id: sessionStorage.getItem("adminid"),
      });

      const { channelName, token, adminUid } = response.data;
      setChannelName(channelNameis);
      localUidRef.current = adminUid;

      // Configure Agora client role
      client.current.setClientRole("host");

      // Join the Agora channel
      await client.current.join(APP_ID, channelName, token, adminUid);

      // Set the admin name in the userNames reference
      userNamesRef.current[adminUid] = adminname;

      // Create local audio track
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      await client.current.publish([localAudioTrack.current]);

      // Add admin to participants list
      setParticipants([
        {
          uid: adminUid,
          name: `${adminname}`,
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

  // Cleanup function for ending the session (for the admin/local user)
  const cleanupSession = async () => {
    console.log("Cleaning up session...");
    setLeft(true);

    try {
      // First, notify the server that the meeting is no longer active
      await axios.post(`${API_URL}/meetings/update`, {
        isActive: false,
        channelName: channelNameis,
      });
      console.log("Meeting ended on server.");

      // Then clean up local resources
      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
      }

      if (client.current && isSessionStarted) {
        await client.current.leave();
      }

      setIsSessionStarted(false);
      setParticipants([]);
      remoteUserAudioStates.current = {};
      userNamesRef.current = {};
    } catch (error) {
      console.error("Error ending meeting:", error);
    }
  };

  // Toggle mute for the local audio track
  const toggleMute = async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.setMuted(!isMuted);
      setIsMuted(!isMuted);

      // Update local participant's mute state in the UI
      setParticipants((prev) =>
        prev.map((p) => (p.isLocal ? { ...p, isMuted: !isMuted } : p))
      );
    }
  };

  // Toggle remote participant mute state locally (only affects your playback)
  const toggleParticipantMute = (uid) => {
    const participant = participants.find((p) => p.uid === uid);
    if (!participant) return;

    const newMuteState = !participant.isMuted;
    setParticipants((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, isMuted: newMuteState } : p))
    );

    const remoteTrack = remoteUserAudioStates.current[uid]?.audioTrack;
    if (remoteTrack) {
      if (newMuteState) {
        remoteTrack.stop();
      } else {
        remoteTrack.play();
      }
      remoteUserAudioStates.current[uid].enabled = !newMuteState;
    }
  };

  // New function to kick a participant from the session
  const kickParticipant = async (uid) => {
    try {
      // Check if the current user is the admin
      const isAdmin = participants.find((p) => p.isLocal)?.isAdmin === true;

      if (!isAdmin) {
        console.error("Only admin can kick participants");
        return;
      }

      // Implement API call to kick participant
      await axios.post(`${API_URL}/meetings/kick-participant`, {
        channelName: channelNameis,
        participantUid: uid,
        adminUid: localUidRef.current,
      });

      // Remove participant from local state
      setParticipants((prev) => prev.filter((p) => p.uid !== uid));

      // Clean up any references to the participant
      if (remoteUserAudioStates.current[uid]) {
        delete remoteUserAudioStates.current[uid];
      }

      if (userNamesRef.current[uid]) {
        delete userNamesRef.current[uid];
      }

      console.log(`Participant ${uid} has been kicked`);
    } catch (error) {
      console.error("Error kicking participant:", error);
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
        <>
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
              onClick={() => {
                console.log("Ending session...");
                cleanupSession();
              }}
            >
              leave
            </button>
          </div>
          <div className="flex-1 flex flex-col p-8 bg-blue-300">
            {/* Meeting Header */}
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-white">{meetingName}</h2>
              <p className="text-blue-100">Active Call</p>
              <p className="text-blue-100">Channel: {channelName}</p>
            </div>

            {/* Participants Section */}
            <div className="flex flex-row overflow-x-auto gap-5 justify-center">
              {/* Local User */}

              {/* Other Participants */}
              {participants
                .filter((p) => !p.isLocal)
                .map((participant) => (
                  <div
                    key={participant.uid}
                    className={`bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100`}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      {/* Profile Initial */}
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-500">
                          {participant?.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>

                      {/* Profile Info */}
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {participant?.name || `User ${participant.uid}`}
                        </h2>
                        <div className="flex items-center space-x-4 mt-4">
                          <button
                            onClick={() =>
                              toggleParticipantMute(participant.uid)
                            }
                            className={`text-white py-2 px-4 rounded ${
                              participant.isMuted
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {participant.isMuted ? "Unmute" : "Mute"}
                          </button>

                          {/* Show kick button only if local user is admin */}
                          {participants.find((p) => p.isLocal)?.isAdmin && (
                            <button
                              onClick={() => kickParticipant(participant.uid)}
                              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                              title="Kick participant from the session"
                            >
                              Kick
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Audio Status */}
                      <div className="flex items-center space-x-2 w-full justify-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            participant.isMuted ? "bg-red-500" : "bg-green-500"
                          }`}
                        />
                        <span className="text-sm text-gray-500">
                          {participant.isMuted ? "Muted" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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
