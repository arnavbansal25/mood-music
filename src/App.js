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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {

  const webcamRef = React.useRef(null);
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [image, setImage] = React.useState();
  const [songs, setSongs] = React.useState(["a", "b", "c", "d", "e", "f", "g", "h"]);

  const imgRef = React.useRef(null);

  const [webcamModal, setWebcamModal] = React.useState(false);
  const [emotion, setEmotion] = React.useState();

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("qq", imageSrc);
      // setImage(imageSrc);

      var img1 = document.getElementById("file1");

      console.log("tt", imgRef.current.currentSrc);
    },
    [webcamRef]
  );

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

  const handleMood = (mood) => {
    console.log("ddd", mood);

    const options = {
      method: 'GET',
      url: 'https://unsa-unofficial-spotify-api.p.rapidapi.com/search',
      params: { query: mood, count: '20', type: 'tracks' },
      headers: {
        'x-rapidapi-host': 'unsa-unofficial-spotify-api.p.rapidapi.com',
        'x-rapidapi-key': '9a977e5dc7msh69a15b5a87d8d6cp138cdfjsnfe53b0f3bcc5'
      }
    };

    // axios.request(options).then(function (response) {
    //   console.log(response.data.Results);
    //   setSongs(response.data.Results);
    // }).catch(function (error) {
    //   console.error(error);
    // });
  }

  const draw = (canvas) => {
    const ctx = canvas.getContext('2d');
    var img = imgRef.current;
    ctx.drawImage(img, 0, 0, img.width, img.height,
      0, 0, canvas.width, canvas.height)
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
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('happy')}>😀</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('sleepy')}>😴</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('angry')}>😠</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('neutral')}>😶</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('fear')}>😨</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('surprise')}>😲</Button>
        <Button style={{ fontSize: '40px' }} onClick={() => handleMood('sad')}>😔</Button>
      </div>

      <Button variant="contained" onClick={CaptureMood}>
        Play my mood!
      </Button>

      {/* Open Webcam and Capture emotion */}
      <WebcamModal
        webcamModal={webcamModal}
        setEmotion={setEmotion}
        handleCLose={() => setWebcamModal(false)}
      />

      <div>
        {/* <Box sx={{ flexGrow: 1, marginTop: '20px', padding: '20px' }}>
          <Grid container spacing={2}>
            {songs && songs.map(item => (
              <>
                <Grid item xs={3} md={2}>
                  <Item>
                    <SongCard song={item} />
                  </Item>
                </Grid>
              </>
            ))}
          </Grid>
        </Box> */}
      </div>
    </div>
  );
}

export default App;

