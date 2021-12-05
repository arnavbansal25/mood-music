import React from 'react';
import './App.css';
import { Button, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SongCard from './SongCard';
import WebcamModal from './WebcamModal';
import * as faceapi from 'face-api.js';
import { key1 } from './keys';

var geolocation = require('geolocation')

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '10px',
}));

function App() {

  // const [songs, setSongs] = React.useState(JSON.parse(localStorage.getItem('newSongs')));
  const [songs, setSongs] = React.useState([]);
  const [showSongs, setShowSongs] = React.useState(false);

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
      // console.log("Coordinates: ", position.coords.latitude, position.coords.longitude);
    })

    location && axios.get("http://api.weatherapi.com/v1/current.json?key=9daf1b5e91b44082aea161904212910&q=" + location + "&aqi=no")
      .then((response) => {
        setWeather(response.data.current.condition.text);
        // console.log("Weather: ", response.data.current.condition.text);
      })
  }, [location]);

  React.useEffect(() => {
    emotion && recommendSongs(emotion);
  }, [emotion])

  const recommendSongs = (mood) => {
    setShowSongs(true);
    if (!weather) {
      alert("Detecting weather...");
      return;
    }

    // console.log("String: ", mood + " " + weather);

    // Shazam API
    const options = {
      method: 'GET',
      url: 'https://shazam.p.rapidapi.com/search',
      params: { term: mood + " " + weather, locale: 'en-US', offset: '0', limit: '20' },
      headers: {
        'x-rapidapi-host': 'shazam.p.rapidapi.com',
        'x-rapidapi-key': key1
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data.tracks.hits);
      setSongs(response.data.tracks.hits);
      // localStorage.setItem('newSongs', JSON.stringify(response.data));
    }).catch(function (error) {
      console.error(error);
    });



    // USNA API
    // const options = {
    //   method: 'GET',
    //   url: 'https://unsa-unofficial-spotify-api.p.rapidapi.com/search',
    //   params: { query: mood + " " + weather, count: '20', type: 'tracks' },
    //   headers: {
    //     'x-rapidapi-host': 'unsa-unofficial-spotify-api.p.rapidapi.com',
    //     'x-rapidapi-key': '9a977e5dc7msh69a15b5a87d8d6cp138cdfjsnfe53b0f3bcc5'
    //   }
    // };

    // axios.request(options).then(function (response) {
    //   console.log(response.data.Results);
    //   setSongs(response.data.Results);
    //   localStorage.setItem('songs', JSON.stringify(response.data.Results));
    // }).catch(function (error) {
    //   console.error(error);
    // });
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

      <Button variant="contained" onClick={() => setWebcamModal(true)}>
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

      <div style={{ marginTop: '20px' }}>
        {emotion ?
          <div style={{ color: 'white' }}>You seem {emotion} today!</div>
          :
          <>
          </>
        }
        {weather ?
          <div style={{ color: 'white' }}>Weather at your loaction is {weather}!</div>
          :
          <>
          </>
        }
        {showSongs ?
          <Box sx={{ marginTop: '10px', padding: '20px' }}>
            <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
              {songs && songs.map((item, index) => (
                <Grid item xs={4} md={2} key={index}>
                  <Item>
                    <SongCard song={item} />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
          :
          <>
          </>
        }

      </div>
    </div>
  );
}

export default App;

