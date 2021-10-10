import React from "react";
import * as faceapi from 'face-api.js';

function Face(props) {

    const { cameraOpen } = props;

    const videoRef = React.useRef(null);
    const videoHeight = 480;
    const videoWidth = 640;
    const canvasRef = React.useRef();
    const [modelLoading, setModalLoading] = React.useState(true);

    React.useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(startVideo);
        }
        loadModels();
    }, [videoRef]);

    const startVideo = () => {
        setModalLoading(false);
        console.log("eee", cameraOpen);
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
        console.log("load end");
        setInterval(async () => {
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
            const displaySize = {
                width: videoWidth,
                height: videoHeight
            }

            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

            // if (detections && detections[0] && detections[0].expressions) {
            //     console.log("qq", detections);
            //     for (var i in detections[0].expressions) {
            //         console.log("ee", i["angry"])
            //     }
            // }
            console.log("ee", detections);
        }, 100)
    }

    return (

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {
                modelLoading ?
                    <div style={{ color: 'white' }}>loading...</div>
                    :
                    <>
                        <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                    </>
            }
        </div>
    );
};

export default Face;