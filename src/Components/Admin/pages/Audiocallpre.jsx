import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import Navbar from "./Navbar";
import image from "../../../assets/startsession.webp";

// Agora App ID - with null check and default value
// Add a default empty string to avoid null
const API_URL = `${import.meta.env.VITE_APP_API_URL}/call`; // Your backend API URL

export default function Audiocallpre() {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [meetingName, setMeetingName] = useState("Team Meeting");
  const [appId, setAppId] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState(
    localStorage.getItem("admin_name") || "Admin"
  );
  const [adminId, setAdminId] = useState(
    localStorage.getItem("admin_id") || ""
  );
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const [channelNameis, setChannelNameis] = useState("");
  const [app_certificateis, setAppCertificateis] = useState("");

  useEffect(() => {
    const channelNameValue = sessionStorage.getItem("channel_name") || "";
    const appCertificateValue = sessionStorage.getItem("app_certificate") || "";
    const appIdValue = sessionStorage.getItem("app_id");
    // const APP_ID = sessionStorage.getItem("app_id")
    setAppId(appIdValue);

    // Alert if app_id is missing
    if (!appIdValue) {
      console.error("App ID is missing in sessionStorage");
      setError("Agora App ID is missing. Please check your configuration.");
    }

    const userId = localStorage.getItem("admin_id") || "";
    const userName = localStorage.getItem("admin_name") || "Admin";
    setAdminName(userName);
    setAdminId(userId);
    setChannelNameis(channelNameValue);
    setAppCertificateis(appCertificateValue);
  }, []);

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
    client.current.on("user-info-updated", handleUserInfoUpdated);

    return () => {
      cleanupSession();
      client.current.off("user-published", handleUserPublished);
      client.current.off("user-left", handleUserLeft);
      client.current.off("user-info-updated", handleUserInfoUpdated);
    };
  }, []);

  // Set up volume indicator listener once session starts
  useEffect(() => {
    if (!isSessionStarted) return;
    // Enable the audio volume indicator
    client.current.enableAudioVolumeIndicator();
    console.log("Audio volume indicator enabled.");

    // Listen for volume indicator events
    client.current.on("volume-indicator", (volumes) => {
      console.log("Volume indicator event:", volumes);
      const SPEAKING_THRESHOLD = 50; // Adjust threshold as needed
      volumes.forEach(({ uid, level }) => {
        console.log(
          `User ${uid} level: ${level} - speaking: ${level > SPEAKING_THRESHOLD
          }`
        );
        setParticipants((prev) =>
          prev.map((p) => {
            if (p.uid === uid) {
              return { ...p, isSpeaking: level > SPEAKING_THRESHOLD };
            }
            return p;
          })
        );
      });
    });

    return () => {
      client.current.off("volume-indicator");
    };
  }, [isSessionStarted]);

  // Polling effect to check if the user has been kicked
  useEffect(() => {
    if (!isSessionStarted) return;

    const interval = setInterval(async () => {
      try {
        // Call backend to check participant status
        const response = await axios.get(
          `${API_URL}/meetings/check-participant-status/${channelNameis}/${localUidRef.current}`
        );
        // If the response indicates the user has been kicked, clean up the session.
        if (response.data.kicked) {
          alert("You have been removed from the meeting by the admin.");
          cleanupSession();
        }
      } catch (error) {
        console.error("Error checking participant status:", error);
      }
    }, 4000); // Check every 4 seconds

    return () => clearInterval(interval);
  }, [isSessionStarted, channelNameis]);

  // Handle user info updates (like username)
  const handleUserInfoUpdated = (uid, msg) => {
    console.log("User info updated:", uid, msg);
    if (msg.userName) {
      userNamesRef.current[uid] = msg.userName;
      setParticipants((prev) =>
        prev.map((p) => (p.uid === uid ? { ...p, name: msg.userName } : p))
      );
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    console.log("User published:", user);
    await client.current.subscribe(user, mediaType);

    if (mediaType === "audio") {
      user.audioTrack.play();
      remoteUserAudioStates.current[user.uid] = {
        audioTrack: user.audioTrack,
        enabled: true,
      };

      const userName = userNamesRef.current[user.uid] || `User ${user.uid}`;
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

      fetchUserMetadata(user.uid);
    }
  };

  // Fetch user metadata from your backend
  const fetchUserMetadata = async (uid) => {
    try {
      const response = await axios.get(
        `${API_URL}/meetings/user-info${channelNameis}/${uid}`
      );
      if (response.data && response.data.userName) {
        userNamesRef.current[uid] = response.data.userName;
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
    console.log("User left:", user);
    if (remoteUserAudioStates.current[user.uid]) {
      delete remoteUserAudioStates.current[user.uid];
    }
    setParticipants((prev) => prev.filter((p) => p.uid !== user.uid));
  };

  const startSession = async () => {
    setLoading(true);
    setError("");

    // Check if App ID is available
    if (!appId) {
      setError("Agora App ID is missing. Please check your configuration.");
      setLoading(false);
      return;
    }

    try {
      // Create meeting on backend (if needed)
      const response = await axios.post(`${API_URL}/meetings/create`, {
        meetingName: meetingName,
        adminName: `${adminName}`,
        id: sessionStorage.getItem("adminid") || adminId,
      });

      const { channelName, token, adminUid } = response.data;
      setChannelName(channelNameis || channelName);
      localUidRef.current = adminUid;

      // Remove the setClientRole call - not compatible with RTC mode
      // client.current.setClientRole("host"); // REMOVED THIS LINE

      await client.current.join(
        appId,
        channelName || channelNameis,
        token,
        adminUid
      );

      userNamesRef.current[adminUid] = adminName;

      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      await client.current.publish([localAudioTrack.current]);

      setParticipants([
        {
          uid: adminUid,
          name: `${adminName}`,
          isLocal: true,
          isAdmin: true,
          isSpeaking: false,
          isMuted: false,
        },
      ]);

      // Record the session start time
      setSessionStartTime(new Date());
      setIsSessionStarted(true);
      console.log("Session started successfully");
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

  const saveCallHistory = async (callDurationMinutes) => {
    try {
      // Format current date as YYYY-MM-DD
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const historyData = {
        name: adminName || "Unknown User",
        date: formattedDate,
        calltime: callDurationMinutes,
        userid: adminId,
      };

      console.log("Saving call history:", historyData);

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/superadmin/savehistory`,
        historyData
      );
      console.log("Call history saved successfully");
    } catch (error) {
      console.error("Error saving call history:", error);
    }
  };

  const cleanupSession = async () => {
    console.log("Cleaning up session...");
    // setLeft(true);

    try {
      // Calculate call duration if session was started
      if (isSessionStarted && sessionStartTime) {
        const endTime = new Date();
        const durationMs = endTime - sessionStartTime;
        const durationMinutes = durationMs / (1000 * 60); // Convert ms to minutes

        // Save call history to the API
        await saveCallHistory(durationMinutes);
      }

      await axios.post(`${API_URL}/meetings/update`, {
        isActive: false,
        channelName: channelNameis,
      });
      console.log("Meeting ended on server.");

      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
        localAudioTrack.current = null;
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

  const toggleMute = async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
      setParticipants((prev) =>
        prev.map((p) => (p.isLocal ? { ...p, isMuted: !isMuted } : p))
      );
    }
  };

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

  const kickParticipant = async (uid) => {
    try {
      const isAdmin = participants.find((p) => p.isLocal)?.isAdmin === true;
      if (!isAdmin) {
        console.error("Only admin can kick participants");
        return;
      }

      await axios.post(`${API_URL}/meetings/kick-participant`, {
        channelName: channelNameis,
        participantUid: uid,
        adminUid: localUidRef.current,
        app_certificateis,
      });

      setParticipants((prev) => prev.filter((p) => p.uid !== uid));

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
    <>
      {!isSessionStarted && <Navbar />}

      {isSessionStarted && (
        <div className="px-10 flex space-x-4 w-full justify-end mt-5">
          <button
            className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
            onClick={() => {
              console.log("Ending session...");
              cleanupSession();
            }}
          >
            End Session
          </button>
        </div>
      )}

      <div className="w-full md:w-5/6 h-[70vh] mx-auto mt-15 mb-2 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col">
        {!isSessionStarted ? (
          <>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={image}
                  alt="Session"
                  className="w-full h-full object-contain animate-zoomInOut"
                />
              </div>
            </div>
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
            <div className="flex-1 flex flex-col p-8 bg-blue-300">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-white">{meetingName}</h2>
                <p className="text-blue-100">Active Call</p>
                <p className="text-blue-100">
                  Channel: {channelName || channelNameis}
                </p>
              </div>

              <div className="flex flex-row overflow-x-auto gap-5 justify-center">
                {participants
                  .filter((p) => !p.isLocal)
                  .map((participant) => (
                    <div
                      key={participant.uid}
                      className={`bg-white rounded-2xl shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl border border-blue-100 ${participant.isSpeaking ? "blink" : ""
                        }`}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-blue-500">
                            {participant?.name || "?"} 
                          </span>
                        </div>
                        <div className="text-center">
                          {/* <h2 className="text-xl font-semibold text-gray-800">
                            {participant?.name || `User ${participant.uid}`}
                          </h2> */}
                          <div className="flex items-center space-x-4 mt-4">
                            <button
                              onClick={() =>
                                toggleParticipantMute(participant.uid)
                              }
                              className={`text-white py-2 px-4 rounded ${participant.isMuted
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                              {participant.isMuted ? (<svg
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
                              </svg>) : (<svg
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
                              </svg>)}
                            </button>
                            {participants.find((p) => p.isLocal)?.isAdmin && (
                              <button
                                onClick={() => kickParticipant(participant.uid)}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                                title="Kick participant from the session"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full justify-center">
                          <div
                            className={`w-4 h-4 rounded-full ${participant.isMuted
                              ? "bg-red-500"
                              : "bg-green-500"
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
          .blink {
            animation: blinkAnimation 1s infinite;
            border: 2px solid red !important;
          }
          @keyframes blinkAnimation {
            0% {
              border-color: red;
            }
            50% {
              border-color: yellow;
            }
            100% {
              border-color: red;
            }
          }
        `}</style>
      </div>

      {isSessionStarted && (
        <div className="flex space-x-4 w-full justify-center">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted
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
        </div>
      )}
    </>
  );
}
