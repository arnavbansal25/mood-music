import axios from "axios";
import SongCard from "./SongCard";
import * as faceapi from "face-api.js";
import WebcamModal from "./WebcamModal";
import { Bars } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { Button, Box, Paper, Grid } from "@mui/material";

var geolocation = require("geolocation");


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: "10px",
}));

function MainComponent() {
  const [loader, setShowLoader] = useState(false);
  const [songs, setSongs] = useState([]);
  const [showSongs, setShowSongs] = useState(false);

  const [webcamModal, setWebcamModal] = useState(false);
  const [emotion, setEmotion] = useState();
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState();
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };
    !modelsLoaded && loadModels();

    !location &&
      geolocation.getCurrentPosition(function (err, position) {
        if (err) throw err;
        setLocation(position.coords.latitude + "," + position.coords.longitude);
      });

    location &&
      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&aqi=no`
        )
        .then((response) => {
          setWeather(response.data.current.condition.text);
        });
  }, [location]);

  useEffect(() => {
    emotion && recommendSongs(emotion);
  }, [emotion]);

  const recommendSongs = (mood) => {
    setEmotion(mood);
    setShowLoader(true);
    setShowSongs(true);
    if (!weather) {
      alert("Detecting weather...");
      return;
    }

    // Shazam API
    const options = {
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: {
        term: mood + " " + weather,
        locale: "en-US",
        offset: "0",
        limit: "20",
      },
      headers: {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_MUSIC_API_KEY,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setShowLoader(false);
        setSongs(response.data.tracks.hits);
      })
      .catch(function (error) {
        setShowLoader(false);
        console.error(error);
      });
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "white" }}>Mood Music</h1>

      <div style={{ marginBttom: "30px" }}>
        {[
          { emotion: "happy", emoji: "😀", text: "Happy" },
          { emotion: "sleepy", emoji: "😴", text: "Sleepy" },
          { emotion: "angry", emoji: "😠", text: "Angry" },
          { emotion: "neutral", emoji: "😶", text: "Neutral" },
          { emotion: "fear", emoji: "😨", text: "Feared" },
          { emotion: "surprise", emoji: "😲", text: "Surprised" },
          { emotion: "sad", emoji: "😔", text: "Sad" },
        ].map((item) => (
          <Button
            style={{ fontSize: "40px" }}
            onClick={() => recommendSongs(item.emotion)}
          >
            {item.emoji}
          </Button>
        ))}
      </div>

      <Button variant="contained" onClick={() => setWebcamModal(true)}>
        Play my mood!
      </Button>

      {/* Open Webcam and Capture emotion */}
      {webcamModal ? (
        <WebcamModal
          webcamModal={webcamModal}
          closeWebcamModal={() => setWebcamModal(false)}
          setEmotion={setEmotion}
          modelsLoaded={modelsLoaded}
        />
      ) : (
        <></>
      )}

      <div style={{ marginTop: "20px" }}>
        {emotion ? (
          <div style={{ color: "white" }}>Mood : {emotion}</div>
        ) : (
          <></>
        )}
        {weather ? (
          <div style={{ color: "white" }}>Weather : {weather}</div>
        ) : (
          <></>
        )}
        {loader ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <Bars
              height="80"
              width="80"
              color="#fff"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : showSongs ? (
          <Box sx={{ marginTop: "10px", padding: "20px" }}>
            <Grid
              container
              spacing={3}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {songs &&
                songs.map((item, index) => (
                  <Grid item xs={4} md={2} key={index}>
                    <Item>
                      <SongCard song={item} />
                    </Item>
                  </Grid>
                ))}
            </Grid>
          </Box>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default MainComponent;
