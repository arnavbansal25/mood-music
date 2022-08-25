import React from "react";
import shazamIcon from "../assets/shazam.png";
import appleIcon from "../assets/apple.png";

function SongCard(props) {
  const { song } = props;

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
          src={song.track.share.image}
          width="90%"
          style={{ borderRadius: "10px" }}
        />
      </div>
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {song.track.share.subject}
      </div>

      <div>
        <audio controls style={{ width: "90%", height: "30px" }}>
          <source src={song.track.hub.actions[1].uri} />
        </audio>
      </div>

      <div>
        <a
          href={song.track.share.href}
          target="_black"
          style={{ marginRight: "20px" }}
        >
          <img src={shazamIcon} width="30px" height="30px" />
        </a>
        <a href={song.track.hub.options[0].actions[0].uri} target="_black">
          <img src={appleIcon} width="30px" height="30px" />
        </a>
      </div>
    </div>
  );
}

export default SongCard;
