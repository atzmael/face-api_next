import Layout from "../components/Layout";
import Webcam from "react-webcam";

// Face API imports
import * as faceapi from 'face-api.js';


const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex:1,
}

const containerStyle = {
    position: 'relative'
}


async function startRecognition() {
    console.log(faceapi.nets)
    const input = document.getElementById('myVideo');

    await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('/models')

    input.addEventListener('play', () => {
        // const canvas = faceapi.createCanvasFromMedia(input)
        // document.body.append(canvas)
        // canvas.style.position="absolute"
        const displaySize = { width: input.width, height: input.height }
        const canvas = document.getElementById('resultCanvas')
        faceapi.matchDimensions(canvas, displaySize)
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            console.log(detections)
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 100)
    })
}


startRecognition();


export default function webcam() {
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
      },
      [webcamRef]
    );

    return (
        <Layout>
            <p>Better to turn on your camera to use this feature ;)</p>
            <div id="webcam" style={containerStyle}>
                <Webcam id="myVideo" audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints} />
                <canvas id="resultCanvas" style={canvasStyle}></canvas>
            </div>
            <button onClick={capture}>Capture photo</button>
        </Layout>
    );
}

