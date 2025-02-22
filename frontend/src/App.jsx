import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';
import ControlsDesktop from './ControlsDesktop';

function App() {

  return (
    <>
      <ControlsDesktop />
    </>
  )
}

export default App
