import React, { useEffect, useRef, useState } from "react";
import appleIcon from "../assets/apple.png";
import { formatTime } from "../utils/formatTime";

function SongCard(props) {
  const { song, onExclusivePlay } = props;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onPlay = () => {
      onExclusivePlay(audio);
      setIsPlaying(true);
    };

    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    if (audio.readyState >= 1) {
      onLoadedMetadata();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onExclusivePlay, song.previewUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      onExclusivePlay(audio);
      audio.play();
    } else {
      audio.pause();
    }
  };

  const displayDuration =
    duration > 0
      ? duration
      : song.durationMs
        ? Math.min(song.durationMs / 1000, 30)
        : 0;

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        height: "400px",
        paddingTop: "10px",
        borderRadius: "10px",
        flexDirection: "column",
        backgroundColor: "black",
        justifyContent: "space-between",
      }}
    >
      <div>
        <img
          src={song.image}
          alt={song.title}
          width="90%"
          style={{ borderRadius: "10px" }}
        />
      </div>
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>{song.title}</div>

      <div style={{ paddingLeft: "8px", paddingRight: "8px" }}>
        <audio ref={audioRef} preload="metadata" style={{ display: "none" }}>
          <source src={song.previewUrl} type="audio/mpeg" />
        </audio>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
            style={{
              width: 36,
              height: 36,
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              background: "#fff",
              color: "#000",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <span
            style={{
              fontSize: "13px",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.02em",
              minWidth: "88px",
            }}
          >
            {formatTime(currentTime)} / {formatTime(displayDuration)}
          </span>
        </div>
      </div>

      <div style={{ paddingBottom: "12px" }}>
        <a
          href={song.appleUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open in Apple Music"
        >
          <img src={appleIcon} width="36" height="36" alt="Apple Music" />
        </a>
      </div>
    </div>
  );
}

export default SongCard;
