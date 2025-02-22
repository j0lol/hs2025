import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useOrientation } from '@uidotdev/usehooks'

function App() {
  const [count, setCount] = useState(0)
  const [orientation, setOrientation] = useState(0);

  window.addEventListener('deviceorientation', handleOrientation);

  function handleOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    // Do stuff...
    setOrientation([alpha, beta, gamma])
  }

  return (
    <>
      <h3>
        Orientation angle:
        {Object.keys(orientation).map((el) => {
            return (
              <p>{el}</p>
            );
          })}
      </h3>
    </>
  )
}

export default App
