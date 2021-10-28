import React from 'react';
import { Button, Modal, Typography, Box, Paper, Grid } from '@mui/material';
import Face from './Face';
import * as faceapi from 'face-api.js';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '640px',
    bgcolor: 'black',
    borderRadius: 5,
    p: 2,
};

function WebcamModal(props) {

    const { webcamModal, setEmotion, closeWebcamModal, modelsLoaded } = props;

    const videoRef = React.useRef(null);
    const videoHeight = 480;
    const videoWidth = 640;
    const canvasRef = React.useRef();

    React.useEffect(() => {
        if (modelsLoaded) {
            startVideo();
        }
    }, [modelsLoaded]);

    const startVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error("error:", err);
            });
    };

    const handleVideoOnPlay = () => {
        console.log("video playing");

        setInterval(async () => {
            if (webcamModal && canvasRef && canvasRef.current) {
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                const displaySize = {
                    width: videoWidth,
                    height: videoHeight
                }

                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
                canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

                // if (detections && detections[0] && detections[0].expressions) {
                //     console.log("qq", detections);
                //     for (var i in detections[0].expressions) {
                //         console.log("ee", i["angry"])
                //     }
                // }
                console.log("ee", detections);
            }
        }, 100)

    }

    const handleClose = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        closeWebcamModal();
    }

    return (
        <>
            <Modal
                open={webcamModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                modelsLoaded ?
                                    <>
                                        <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                                    </>
                                    :
                                    <div style={{ color: 'white' }}>loading...</div>
                            }
                        </div>
                    </div>
                </Box>
            </Modal>

        </>
    )
}

export default WebcamModal;