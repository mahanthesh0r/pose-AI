import { Container, Row, Col } from "reactstrap";
import React, { useEffect, useRef, useState } from "react";
import ml5 from "ml5";
import useInterval from '@use-it/interval';
import Tree from "./assets/images/tree-01.svg";
import Footer from "./Footer";
import Webcam from "react-webcam";
import "./App.css"
import { useCountdownTimer } from 'use-countdown-timer';
import { CountdownCircleTimer } from 'react-countdown-circle-timer' 
import * as tmPose from '@teachablemachine/pose';
import * as tf from '@tensorflow/tfjs';

import metadata from './assets/images/model/metadata.json';
import poseImg from './assets/images/pose2.png'






let classifier, model, maxPredictions, webcam, ctx, brain, pose, poseLabel;
const URL = 'https://teachablemachine.withgoogle.com/models/NzHqB2xUN/';





function App() {

  const videoRef = useRef();
  const webcamRef = useRef();
  const [start, setStart] = useState(true);
  const [result, setResult] = useState([]);
  var modelJson = require('./modelv2/model2.json');

  // const [isVisible, setIsVisible] = useState(true);
  
  // const useCountDown = (start: number) => {
  //   const [counter, setCounter] = useState(start);
  //   useEffect(() => {
  //     if (counter === 0) {
  //       return;
  //     }
  //     setTimeout(() => {
  //       setCounter(counter - 1);
  //     }, 1000);
  //   }, [counter]);
  //   return counter;
  // };

  

  useEffect(async () => {
    // classifier = ml5.poseNet("./model/model.json", () => {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true, audio: false })
    //     .then((stream) => {
    //       // webcamRef.current.srcObject = stream;
    //       // webcamRef.current.play();
    //       //setLoaded(true);
    //     });
    // });


    // classifier = ml5.poseNet(webcamRef, "./model/model.json")
    // const modelURL = URL + 'model.json';
    // const metadataURL = URL + 'metadata.json';
    // model = await tmPose.load(modelURL, metadataURL);
    // maxPredictions = model.getTotalClasses();
    // console.log(maxPredictions)
    // const video = webcamRef.current.video;
    // console.log(await model.estimatePose())
    // classifier.on('pose', (results) => {
    //   console.log(results)
    // });
    
    setInterval(() => {
      predict(model);
    }, 10000);
  }, []);

  // useInterval(() => {
  //   if (classifier && start) {
  //     // classifier.classify(videoRef.current, (error, results) => {
  //     //   if (error) {
  //     //     console.error(error);
  //     //     return;
  //     //   }
  //     //   setResult(results);
  //        predict();
        
  //     //   //  console.log(results[0].label)
  //     //   //  console.log(results[0].confidence)
  //     //   //  setResult(results);
         
         
  //     // });
  //     classifier.on('pose', (results) => {
  //       console.log(results)
  //     })
  //   }
  //    predict(model);
  // }, 5000);

  const predict = async (model) => {
    console.log("here")
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ){
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      
       // Set video width
       webcamRef.current.video.width = videoWidth;
       webcamRef.current.video.height = videoHeight;

       const poseNet = ml5.poseNet(video, modelLoaded);

       poseNet.on('pose', (results) => {
            //console.log(results)
           gotPoses(results);
       })

       let options = {
        inputs: 34,
        outputs: 4,
        task: 'classification',
        debug: true
      };

        brain = ml5.neuralNetwork(options);

       
       const modelInfo = {
        model: "https://aipose.s3.ap-south-1.amazonaws.com/model2.json",
        metadata: 'https://aipose.s3.ap-south-1.amazonaws.com/model_meta2.json',
        weights: 'https://aipose.s3.ap-south-1.amazonaws.com/model.weights2.bin',
      };
       brain.load(modelInfo, brainLoaded);
      

// Prediction #1: run input through posenet
// estimatePose can take in an image, video or canvas html element
// console.log(video)

// var videocam =  document.getElementById('cam')
//  console.log(await model.estimatePose(webcamRef.current.video))

// const { pose, posenetOutput } = await model.estimatePose(video);
// // Prediction 2: run input through teachable machine classification model
// const prediction = await model.predict(posenetOutput);

// for (let i = 0; i < maxPredictions; i++) {
//   const classPrediction =
//       prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
//   console.log(classPrediction);
// }
    }

// finally draw the poses
// drawPose(pose);
}

function modelLoaded() {
  console.log('Model Loaded!');
}

function brainLoaded() {
  console.log("brain loaded")
  classifyPose();
}

function classifyPose(){
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
      //console.log(inputs)
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results != undefined && results[0].confidence > 0.2) {
    poseLabel = results[0].label.toUpperCase();
    console.log(poseLabel)
  }
  //console.log(results[0].confidence);
  classifyPose();
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    //console.log(pose)
    //skeleton = poses[0].skeleton;
  }
}

  const divStyle ={
    background: "#d4ebf2",
    height: "100vh"
  };

  const Footer = () => (
    <footer className="footer">
      <p>Some footer nonsense</p>
    </footer>
  );  

 

//   const Example = () => {
//   const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
//     timer: 1000 * 5,
//   });
//   return (
//     <React.Fragment>

//       <div> {countdown} </div>
//       <button onClick={start}>Reset</button>
//       {isRunning ? (
//         <button onClick={pause}>Pause</button>
//       ) : (
//         <button onClick={start}>Start</button>
        
//       )}
//     </React.Fragment>
//   );
// };

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Too lale...</div>;
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

  return (
    <div className="App" style={divStyle}>
      <Container>
      <h1 className="display-3" style={{ textAlign: "center"}}>Pose AI</h1>
      <Row style={{marginTop:"50px"}}>
      <Col xs="6" >
         <h1 style={{textAlign: "center"}}> webcam view</h1>
        {/* <video
         ref={videoRef}
         style={{transform: "scale(-1, 1", border: "5px solid #85C1E9", borderRadius: "25px"}}
         width="600"
         height="450"
         /> */}

        <Webcam 
        id="cam"
        ref={webcamRef}
        style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "10px",
        left: 0,
        right: 0,
        textAlign: "center",
        zindex: 9,
        width: 640,
        height: 480,
        transform: "scale(-1,1)"
        }}
      />
        
      </Col>

      <Col xs="6" style={{textAlign:"center"}}>
      <h1 className="display-6" style={{fontWeight:"500"}}> Tree Pose</h1>
      <img src={Tree} alt="test" style={{height:"250px" }} />
      {/* <h1 className="display-2" style={{marginTop:"20px"}}> <Example /> </h1> */}
      <div style={{alignItems:"center", justifyContent:"center", display:"flex", marginTop:"10px"}}>
      <CountdownCircleTimer
          isPlaying
          duration={10}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [false, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      
      
      </Col>

      </Row>


      </Container>

    <Footer />
    </div>
  );
}


export default App;
