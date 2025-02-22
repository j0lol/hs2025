import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useOrientation } from '@uidotdev/usehooks'

function App() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");

  function handleMotionEvent(event) {
    console.log("handle motion event", event);

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    setX(x);
    setY(y);
    setZ(z);
  }

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotionEvent, true);
  }, [x, y, z]);

  return (
    <div className="App">
      <h1>Device Motion</h1>
      <div>
        X - {x} Y - {y} Z - {z}
      </div>
    </div>
  );
}

export default App
