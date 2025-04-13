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
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const deviceMonitorTimerRef = useRef(null);
  const availableDevicesRef = useRef([]);
  const isBluetoothConnectedRef = useRef(false);

  // Function to update available audio devices and auto-select Bluetooth when available
  const updateAudioDevices = async () => {
    try {
      console.log("Checking for audio devices...");

      // Get updated list of microphones
      const devices = await AgoraRTC.getMicrophones();
      availableDevicesRef.current = devices;

      // Check if we have any bluetooth device
      const bluetoothDevice = devices.find(
        (device) =>
          device.label.toLowerCase().includes("bluetooth") ||
          device.label.toLowerCase().includes("airpods") ||
          device.label.toLowerCase().includes("headset")
      );

      const wasBluetoothConnected = isBluetoothConnectedRef.current;
      isBluetoothConnectedRef.current = !!bluetoothDevice;

      // If a bluetooth device is found and it's different from the current selection
      if (bluetoothDevice && bluetoothDevice.deviceId !== selectedDeviceId) {
        console.log(`Bluetooth device found: ${bluetoothDevice.label}`);
        setSelectedDeviceId(bluetoothDevice.deviceId);

        // If session is active, switch to bluetooth device
        if (isSessionStarted && localAudioTrack.current) {
          console.log("Switching to bluetooth device during active session");
          await switchMicrophone(bluetoothDevice.deviceId);
        }
      }
      // Handle bluetooth disconnection - fallback to default device
      else if (
        wasBluetoothConnected &&
        !bluetoothDevice &&
        devices.length > 0
      ) {
        console.log(
          "Bluetooth disconnected, falling back to default microphone"
        );
        const defaultDevice = devices[0];
        setSelectedDeviceId(defaultDevice.deviceId);

        if (isSessionStarted && localAudioTrack.current) {
          console.log(`Switching to default device: ${defaultDevice.label}`);
          await switchMicrophone(defaultDevice.deviceId);
        }
      }
      // Initial setup with no bluetooth - use default device
      else if (!bluetoothDevice && devices.length > 0 && !selectedDeviceId) {
        console.log(`Setting default device: ${devices[0].label}`);
        setSelectedDeviceId(devices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting audio devices:", error);
    }
  };

  // Function to switch microphone during active session
  const switchMicrophone = async (deviceId) => {
    if (!isSessionStarted || !localAudioTrack.current) return;

    try {
      // Verify that the device actually exists before switching
      const devices = availableDevicesRef.current;
      const deviceExists = devices.some(
        (device) => device.deviceId === deviceId
      );

      if (!deviceExists) {
        console.warn(
          `Device ${deviceId} no longer exists, using default device`
        );
        // Use the first available device instead
        if (devices.length > 0) {
          deviceId = devices[0].deviceId;
        } else {
          console.error("No audio devices available");
          return;
        }
      }

      // Close the existing track
      localAudioTrack.current.stop();
      localAudioTrack.current.close();

      // Create a new track with the selected device
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: deviceId,
      });

      // Maintain the mute state
      if (isMuted) {
        await localAudioTrack.current.setMuted(true);
      }

      // Publish the new track
      await client.current.publish([localAudioTrack.current]);

      console.log(`Successfully switched to microphone: ${deviceId}`);
    } catch (error) {
      console.error("Error switching microphone:", error);
      // Try to recover by using any available device
      try {
        const devices = await AgoraRTC.getMicrophones();
        if (devices.length > 0) {
          console.log("Attempting recovery with first available device");
          localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: devices[0].deviceId,
          });

          if (isMuted) {
            await localAudioTrack.current.setMuted(true);
          }

          await client.current.publish([localAudioTrack.current]);
          setSelectedDeviceId(devices[0].deviceId);
        }
      } catch (recoveryError) {
        console.error("Failed to recover microphone:", recoveryError);
        setError("Microphone error. Please rejoin the session.");
      }
    }
  };

  // Initialize audio devices and set up device monitoring
  useEffect(() => {
    updateAudioDevices();

    // Set up periodic checking for device changes - more frequent checks during active session
    const checkInterval = isSessionStarted ? 2000 : 5000;
    deviceMonitorTimerRef.current = setInterval(
      updateAudioDevices,
      checkInterval
    );

    // Add event listener for device changes
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      clearInterval(deviceMonitorTimerRef.current);
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [isSessionStarted, selectedDeviceId]);

  // Handle device change events
  const handleDeviceChange = async () => {
    console.log("Device change event detected");
    // Wait a moment for the system to recognize the new devices
    setTimeout(updateAudioDevices, 500);
  };

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
          `User ${uid} level: ${level} - speaking: ${
            level > SPEAKING_THRESHOLD
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
      // Get current audio devices to ensure we have the latest
      await updateAudioDevices();

      // Ensure we have a device selected
      if (!selectedDeviceId && availableDevicesRef.current.length > 0) {
        setSelectedDeviceId(availableDevicesRef.current[0].deviceId);
      }

      // Create meeting on backend (if needed)
      const response = await axios.post(`${API_URL}/meetings/create`, {
        meetingName: meetingName,
        adminName: `${adminName}`,
        id: sessionStorage.getItem("adminid") || adminId,
      });

      const { channelName, token, adminUid } = response.data;
      setChannelName(channelNameis || channelName);
      localUidRef.current = adminUid;

      await client.current.join(
        appId,
        channelName || channelNameis,
        token,
        adminUid
      );

      userNamesRef.current[adminUid] = adminName;

      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: selectedDeviceId,
      });
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
      console.log(
        "Session started successfully with device:",
        selectedDeviceId
      );
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
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transform transition-all duration-300 hover:scale-105 shadow-md"
            onClick={() => {
              console.log("Ending session...");
              cleanupSession();
            }}
          >
            End Session
          </button>
        </div>
      )}

      <div className="w-full md:w-[95%] h-[80vh] mx-auto mt-2 mb-2 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col">
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transform transition-all duration-300 hover:scale-105 shadow-md"
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
              <div className="grid grid-cols-5  overflow-x-auto gap-5 justify-center">
                {participants
                  .filter((p) => !p.isLocal)
                  .map((participant) => (
                    <div
                      key={participant.uid}
                      className={`bg-white rounded-3xl shadow-lg p-6 w-50 transition-all duration-300 hover:shadow-xl border border-blue-100 ${
                        participant.isSpeaking ? "blink" : ""
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
                              className={`text-white py-2 px-4 rounded ${
                                participant.isMuted
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {participant.isMuted ? (
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
                            {participants.find((p) => p.isLocal)?.isAdmin && (
                              <button
                                onClick={() => kickParticipant(participant.uid)}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                                title="Kick participant from the session"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-x-icon lucide-x"
                                >
                                  <path d="M18 6 6 18" />
                                  <path d="m6 6 12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full justify-center">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              participant.isMuted
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

        {isSessionStarted && (
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
          .blink {
            position: relative;
            border: 4px solid #006400; /* Dark green */
            border-radius: 24px;
            padding: 20px;
            background: white;
            animation: borderBlink 1.5s infinite ease-in-out;
            transition: all 0.3s ease;
          }

          @keyframes borderBlink {
            0% {
              box-shadow: 0 0 0px #006400;
            }
            50% {
              box-shadow: 0 0 10px 4px #228b22; /* subtle glow */
            }
            100% {
              box-shadow: 0 0 0px #006400;
            }
          }
        `}</style>
      </div>
    </>
  );
} // End of Audiocallpre component
