import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSAudioPlayer = ({ url, shouldPlay }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!url || !shouldPlay) return;
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      video.play();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play();
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, shouldPlay]);

  return (
    shouldPlay && (
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", height: "40px" }} // minimal UI like audio
      />
    )
  );
};

export default HLSAudioPlayer;
