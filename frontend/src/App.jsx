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
  const [device, setDevice] = useState();

  useEffect(() => {
    let webSocket = new WebSocket('wss://bak.hs2025.vps.j0.lol', 'protocolOne');
        connection.current = webSocket;
        if (isMobile) {
            setDevice("mobile device")
        }
        else {
          setDevice("mouse")
        }
  },  [])
  let [render, setRender] = useState()


  useEffect(() => {
    console.log('Device :: ', device);
  }, [device])
  return (
    <>
      {(device == "mouse") ? <ControlsDesktop setDevice={setDevice} device={device} connection={connection}/> : <ControlsMobile setDevice={setDevice} device={device} connection={connection}/>}
    </>
  )
}

export default App
