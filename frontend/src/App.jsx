// you can't have ten pm without npm 

import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';
import ControlsDesktop from './ControlsDesktop';
import ControlsMobile from './ControlsMobile';

function App() {


  const connection = useRef();

  useEffect(() => {
    let webSocket = new WebSocket('ws://localhost:3000', 'protocolOne');
        connection.current = webSocket;
        if (isMobile) {
            setDevice("mobile device")
        }
  })
  const [device, setDevice] = useState();
  let [render, setRender] = useState()



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
      {(device == "Desktop") ? <ControlsDesktop setDevice={setDevice} device={device} connection={connection}/> : <ControlsMobile setDevice={setDevice} device={device} connection={connection}/>}
    </>
  )
}

export default App
