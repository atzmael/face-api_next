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
    const input = document.getElementById('myVideo')
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    await faceapi.nets.faceExpressionNet.loadFromUri('/models')

    const displaySize = { width: input.width, height: input.height }
    // resize the overlay canvas to the input dimensions
    const canvas = document.getElementById('resultCanvas')
    faceapi.matchDimensions(canvas, displaySize)

    /* Display face expression results */
    const detectionsWithExpressions = await faceapi
        .detectAllFaces(input)
        .withFaceLandmarks()
        .withFaceExpressions()
    // resize the detected boxes and landmarks in case your displayed image has a different size than the original
    const resizedResults = faceapi.resizeResults(detectionsWithExpressions, displaySize)
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvas, resizedResults)
    // draw a textbox displaying the face expressions with minimum probability into the canvas
    const minProbability = 0.05
    faceapi.draw.drawFaceExpressions(canvas, resizedResults, minProbability)
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

