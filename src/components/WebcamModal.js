import React from 'react';
import { Modal,  Box } from '@mui/material';
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
    var interval = 0;

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
        var angry = 0;
        var disgusted = 0;
        var fearful = 0;
        var happy = 0;
        var neutral = 0;
        var sad = 0;
        var surprised = 0;
        var total_frames = 0;

        interval = setInterval(async () => {
            if (total_frames >= 50) {
                clearInterval(interval);
                var emoVal = Math.max(angry, disgusted, fearful, happy, neutral, sad, surprised);
                if(emoVal === angry) {
                    setEmotion("angry");
                }
                else if(emoVal === disgusted) {
                    setEmotion("disgusted");
                }
                else if(emoVal === fearful) {
                    setEmotion("fearful");
                }
                else if(emoVal === happy) {
                    setEmotion("happy");
                }
                else if(emoVal === neutral) {
                    setEmotion("neutral");
                }
                else if(emoVal === sad) {
                    setEmotion("sad");
                }
                else if(emoVal === surprised) {
                    setEmotion("surprised");
                }

                videoRef && videoRef.current && videoRef.current.pause();
                videoRef && videoRef.current && videoRef.current.srcObject.getTracks()[0].stop();
                closeWebcamModal();
            }

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

                detections && detections.map((item) => {
                    angry += item.expressions.angry/2;
                    disgusted += item.expressions.disgusted/2;
                    fearful += item.expressions.fearful/2;
                    happy += item.expressions.happy/2;
                    neutral += item.expressions.neutral/2;
                    sad += item.expressions.sad/2;
                    surprised += item.expressions.surprised/2;
                })
                total_frames += 1;
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