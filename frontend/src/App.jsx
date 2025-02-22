import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const connection = useRef(0)

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:3000')
    connection.current = webSocket;
  }, [])

  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");
  const [acc, setAcc] = useState(false)
  const [breaking, setBreaking] = useState(false);

  function handleMotionEvent(event) {

    // console.log("handle motion event", event);
    

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    setX(x);
    setY(y);
    setZ(z);

    const data = {
      x: x,
      y: y,
      z: z,
      acc: acc,
      breaking: breaking
    }

    if (connection.current) {
      try {
        connection.current.send(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleActivate() {
    setAcc(true);
  }

  function handleDeactivate() {
    setAcc(false);
  }

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotionEvent, true);
  }, [x, y, z]);

  return (
    <div className="App">
      <div className="pedals">
        <div className="brake">
          <img src="src/assets/brakepedal.png" alt=""/>
        </div>
        <div className="accelerate" onMouseDown={handleActivate} onMouseLeave={handleDeactivate} onMouseUp={handleDeactivate}>
          <img src="src/assets/gaspedal.png" alt="" />
        </div>
      </div>

      {/* <h1>Device Motion</h1> */}
      
      {/* <div>
        X - {x} Y - {y} Z - {z}
      </div>
      <button onMouseDown={handleActivate} onMouseUp={handleDeactivate} onMouseLeave={handleDeactivate}>Accelerate</button>
      <button>Break</button> */}
      </div>
  )
}

export default App
