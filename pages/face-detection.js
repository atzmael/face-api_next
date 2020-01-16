import Layout from "../components/Layout";

// Face API imports
import * as faceapi from 'face-api.js';

const imgStyle = {
    width: '100%'
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
    const input = document.getElementById('myImg')
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
        console.log(detectionsWithExpressions)
    // resize the detected boxes and landmarks in case your displayed image has a different size than the original
    const resizedResults = faceapi.resizeResults(detectionsWithExpressions, displaySize)
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvas, resizedResults)
    // draw a textbox displaying the face expressions with minimum probability into the canvas
    const minProbability = 0.05
    faceapi.draw.drawFaceExpressions(canvas, resizedResults, minProbability)
}

startRecognition();

export default function FaceDetection() {
    return (
        <Layout>
            <p>Better to turn on your camera to use this feature ;)</p>
            <div id="faceDetection" style={containerStyle}>
                <img style={imgStyle} id="myImg" src="/img/example.jpg" />
                <canvas id="resultCanvas" style={canvasStyle}></canvas>
            </div>
        </Layout>
    );
}