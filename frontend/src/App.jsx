import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useOrientation } from '@uidotdev/usehooks'

function App() {
  const [count, setCount] = useState(0)
  const orientation = useOrientation();


  return (
    <>
      <h3>
        Orientation angle:
        {Object.keys(orientation).map((key) => {
            return (
              <tr key={key}>
                <th>{key}</th>
                <td>{orientation[key]}</td>
              </tr>
            );
          })}
      </h3>
    </>
  )
}

export default App
