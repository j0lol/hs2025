
import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';

export default function ControlsMobile(props) {

    const connection = useRef();
    const [device, setDevice] = useState("device");

    useEffect(() => {
        
        const noSelectElements = document.querySelectorAll(".no-select");
        noSelectElements.forEach((element) => {
            element.style.webkitUserSelect = "none";
            element.style.mozUserSelect = "none";
            element.style.msUserSelect = "none";
            element.style.userSelect = "none";
          });

        let webSocket = new WebSocket('ws://localhost:3000', 'protocolOne');
        connection.current = webSocket;
        if (isMobile) {
            setDevice("mobile device")
        }
    }, [])
    
    const [dir, setDir] = useState(0);
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [z, setZ] = useState("");
    const [acc, setAcc] = useState(false)
    const [braking, setBraking] = useState(false);

    function handleStart(event) {
        try {
            event.requestPermission()
            .then( response => {
            // (optional) Do something after API prompt dismissed.
            if ( response == "granted" ) {
                window.addEventListener( "devicemotion", handleMotionEvent);
            }
        })

        } catch {
            console.error('Cannot request permission')
        }
    }

    function handleMotionEvent(event) {
        
       
        var x = event.accelerationIncludingGravity.x;
        var y = event.accelerationIncludingGravity.y;
        var z = event.accelerationIncludingGravity.z;
        
        setX(x);
        setY(y);
        setZ(z);

        setDir(x);

        let data = {
            "Accelerometer": {
                "gas_pedal": acc,
                "brake_pedal": braking,
                "id": 0,
                "content": x
            }   
        };

        // console.log('[handleMotionEvent] :: ', JSON.stringify(data))
        if (connection.current.readyState != 0) {
            try {
                
                (props.device == "mobile device") && connection.current.send(JSON.stringify(data));connection.current.send(JSON.stringify(data));
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    function handlePressBrake() {
        setBraking(true);
    }

    function handleReleaseBrake() {
        setBraking(false);
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
        <div className="App no-select" >
            {x} <br></br>
            {y} <br></br>
            {z} <br></br>
            <h1>Use your {device} to steer the car!</h1>
            <div className="pedals">
                <div className="brake" onMouseDown={handlePressBrake} onMouseLeave={handleReleaseBrake} onMouseUp={handleReleaseBrake} >
                <img src="src/assets/brakepedal.png" alt="" draggable="false"/>
                </div>
                <div className="accelerate" onMouseDown={handleActivate} onMouseLeave={handleDeactivate} onMouseUp={handleDeactivate} >
                <img src="src/assets/gaspedal.png" alt="" draggable="false" />
                </div>
            </div>
        <button onClick={handleStart}>Start</button>
        </div>
    )

}