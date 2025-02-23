// you can't have ten pm without npm 

import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';
import ControlsDesktop from './ControlsDesktop';
import ControlsMobile from './ControlsMobile';

function App() {

  const [device, setDevice] = useState();
  
  useEffect(() => {
    if (isMobile) {
      setDevice("Mobile");
    } else {
      setDevice("Desktop");
    }

  

  }, [])

  useEffect(() => {
    console.log('Device :: ', device);
  }, [device])
  return (
    <>
      {(device == "Desktop") ? <ControlsDesktop /> : <ControlsMobile />}
    </>
  )
}

export default App
