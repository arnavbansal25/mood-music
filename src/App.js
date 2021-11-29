import React from 'react';
import './App.css';
import { Button, Modal, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SongCard from './SongCard';
import Canvas from './Canvas';
import reactDom from 'react-dom';
import Face from './Face';
import WebcamModal from './WebcamModal';
import * as faceapi from 'face-api.js';

var geolocation = require('geolocation')

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '10px',
}));

function App() {

  const webcamRef = React.useRef(null);
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [songs, setSongs] = React.useState(JSON.parse(localStorage.getItem('songs')));
  // const [songs, setSongs] = React.useState(['a','b','c','d','e','f','g','h']);


  const [webcamModal, setWebcamModal] = React.useState(false);
  const [emotion, setEmotion] = React.useState();
  const [weather, setWeather] = React.useState();
  const [location, setLocation] = React.useState();
  const [modelsLoaded, setModelsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    }
    !modelsLoaded && loadModels();

    !location && geolocation.getCurrentPosition(function (err, position) {
      if (err) throw err
      setLocation(position.coords.latitude + "," + position.coords.longitude)
      // console.log(position.coords.latitude, position.coords.longitude);
    })

    location && axios.get("http://api.weatherapi.com/v1/current.json?key=9daf1b5e91b44082aea161904212910&q=" + location + "&aqi=no")
      .then((response) => {
        setWeather(response.data.current.condition.text);
        // console.log("rrr", response.data.current.condition.text);
      })

    console.log("rr", JSON.parse(localStorage.getItem('songs')));
  }, [location]);


  const CaptureMood = () => {
    // capture();
    setWebcamModal(true);
    // setCameraOpen(true);

    // const options = {
    //   method: 'GET',
    //   url: 'https://unsa-unofficial-spotify-api.p.rapidapi.com/search',
    //   params: { query: 'happy', count: '20', type: 'tracks' },
    //   headers: {
    //     'x-rapidapi-host': 'unsa-unofficial-spotify-api.p.rapidapi.com',
    //     'x-rapidapi-key': 'ffdb09b357msh282510067bc8ffdp129959jsn7551015ac368'
    //   }
    // };

    // axios.request(options).then(function (response) {
    //   console.log(response.data);
    // }).catch(function (error) {
    //   console.error(error);
    // });
  }

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const recommendSongs = (mood) => {
    if (!weather) {
      alert("Detecting weather...");
      return;
    }

    console.log("ddd", `${mood} ${weather}`, mood + " " + weather);

    const options = {
      method: 'GET',
      url: 'https://unsa-unofficial-spotify-api.p.rapidapi.com/search',
      params: { query: mood + " " + weather, count: '20', type: 'tracks' },
      headers: {
        'x-rapidapi-host': 'unsa-unofficial-spotify-api.p.rapidapi.com',
        'x-rapidapi-key': '9a977e5dc7msh69a15b5a87d8d6cp138cdfjsnfe53b0f3bcc5'
      }
    };

    // axios.request(options).then(function (response) {
    //   console.log(response.data.Results);
    //   setSongs(response.data.Results);
    //   localStorage.setItem('songs', JSON.stringify(response.data.Results));
    // }).catch(function (error) {
    //   console.error(error);
    // });
  }

  const draw = (canvas) => {
    const ctx = canvas.getContext('2d');

    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // ctx.fillStyle = 'green'
    // ctx.beginPath()
    // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
    // ctx.fill()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'white' }}>Mood Music</h1>


      <div style={{ marginBttom: '30px' }}>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('happy')}>😀</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('sleepy')}>😴</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('angry')}>😠</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('neutral')}>😶</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('fear')}>😨</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('surprise')}>😲</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => recommendSongs('sad')}>😔</Button>
      </div>

      <Button variant="contained" onClick={CaptureMood}>
        Play my mood!
      </Button>

      {/* Open Webcam and Capture emotion */}
      {
        webcamModal ?
          <WebcamModal
            webcamModal={webcamModal}
            closeWebcamModal={() => setWebcamModal(false)}
            setEmotion={setEmotion}
            modelsLoaded={modelsLoaded}
          />
          :
          <>
          </>
      }

      <div style={{marginTop: '20px'}}>
        {emotion ?
          <span style={{ color: 'white' }}>You seem happy today!</span>
          :
          <>
          </>
        }
        <Box sx={{ flexGrow: 1, marginTop: '20px', padding: '20px' }}>
          <Grid container spacing={3}>
            {songs && songs.map((item, index) => (
              <Grid item xs={4} md={2} key={index}>
                <Item>
                  <SongCard song={item} />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default App;

