import SongCard from "./SongCard";
import * as faceapi from "face-api.js";
import WebcamModal from "./WebcamModal";
import { Bars } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Box, Paper, Grid } from "@mui/material";
import { recommendTracks } from "../services/musicApi";
import { fetchCurrentWeather, getBrowserPosition } from "../services/weatherApi";

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
  const [weatherError, setWeatherError] = useState();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const activeAudioRef = useRef(null);

  const handleExclusivePlay = useCallback((audioElement) => {
    const current = activeAudioRef.current;
    if (current && current !== audioElement && !current.paused) {
      current.pause();
    }
    activeAudioRef.current = audioElement;
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };
    if (!modelsLoaded) {
      loadModels();
    }
  }, [modelsLoaded]);

  useEffect(() => {
    const weatherKey = process.env.REACT_APP_WEATHER_API_KEY;
    if (!weatherKey) {
      setWeatherError("Weather API key is missing. Add REACT_APP_WEATHER_API_KEY to .env");
      return;
    }

    let cancelled = false;

    const loadWeather = async () => {
      try {
        let coords;
        try {
          coords = await getBrowserPosition();
        } catch {
          coords = null;
        }

        const result = await fetchCurrentWeather(weatherKey, coords || {});
        if (!cancelled) {
          setWeather(result.description);
          setWeatherError(undefined);
        }
      } catch (err) {
        if (!cancelled) {
          setWeatherError("Could not load weather. Check your API key and connection.");
          console.error(err);
        }
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const recommendSongs = useCallback(
    async (mood) => {
      setShowSongs(true);

      if (!weather) {
        alert(
          weatherError ||
            "Still detecting weather… please wait a moment and try again."
        );
        return;
      }

      setShowLoader(true);
      setSongs([]);

      try {
        const { tracks } = await recommendTracks(mood, weather);
        setSongs(tracks);
        if (!tracks.length) {
          alert("No songs found for this mood and weather. Try another mood.");
        }
      } catch (error) {
        console.error(error);
        alert("Could not load song recommendations. Please try again.");
      } finally {
        setShowLoader(false);
      }
    },
    [weather, weatherError]
  );

  useEffect(() => {
    if (emotion) {
      recommendSongs(emotion);
    }
  }, [emotion, recommendSongs]);

  const moodButtons = [
    { emotion: "Happy", emoji: "😀" },
    { emotion: "Sad", emoji: "😔" },
    { emotion: "Surprised", emoji: "😲" },
    { emotion: "Fearful", emoji: "😨" },
    { emotion: "Angry", emoji: "😠" },
    { emotion: "Disgusted", emoji: "🤢" },
    { emotion: "Neutral", emoji: "😶" },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "white" }}>Mood Music</h1>

      <div
        style={{
          gap: "15px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {moodButtons.map((item, index) => (
          <div key={item.emotion}>
            <div>
              <Button
                style={{ fontSize: "40px" }}
                onClick={() => setEmotion(item.emotion)}
              >
                {item.emoji}
              </Button>
            </div>
            <div style={{ color: "lightblue" }}>{item.emotion}</div>
          </div>
        ))}
      </div>

      <Button variant="contained" onClick={() => setWebcamModal(true)}>
        Play my mood!
      </Button>

      {webcamModal ? (
        <WebcamModal
          webcamModal={webcamModal}
          closeWebcamModal={() => setWebcamModal(false)}
          setEmotion={setEmotion}
          modelsLoaded={modelsLoaded}
        />
      ) : null}

      <div style={{ marginTop: "20px" }}>
        {emotion ? (
          <div style={{ color: "white" }}>Mood : {emotion}</div>
        ) : null}
        {weather ? (
          <div style={{ color: "white" }}>Weather : {weather}</div>
        ) : weatherError ? (
          <div style={{ color: "#ffb4b4" }}>{weatherError}</div>
        ) : (
          <div style={{ color: "lightgray" }}>Detecting weather…</div>
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
              {songs.map((item) => (
                <Grid item xs={4} md={2} key={item.id}>
                  <Item>
                    <SongCard
                      song={item}
                      onExclusivePlay={handleExclusivePlay}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </div>
    </div>
  );
}

export default MainComponent;
