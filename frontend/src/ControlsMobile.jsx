
import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';

export default function ControlsMobile(props) {

    const [device, setDevice] = useState("device");

    const playerID = useRef();


    useEffect(() => {
        
        const noSelectElements = document.querySelectorAll(".no-select");
        noSelectElements.forEach((element) => {
            element.style.webkitUserSelect = "none";
            element.style.mozUserSelect = "none";
            element.style.msUserSelect = "none";
            element.style.userSelect = "none";
          });

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

            if (
                DeviceMotionEvent &&
                typeof DeviceMotionEvent.requestPermission === "function"
              ) {
                DeviceMotionEvent.requestPermission();
              }

            // (optional) Do something after API prompt dismissed.
            window.addEventListener( "devicemotion", handleMotionEvent);

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
                "id": playerID.current.value ? parseInt(playerID.current.value): 0,
                "content": x
            }   
        };

        // console.log('[handleMotionEvent] :: ', JSON.stringify(data))
        if (props.connection.current.readyState != 0) {
            try {
                if (props.device == "mobile device") {

                    props.connection.current.send(JSON.stringify(data));
                }
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
        
    }, [x, y, z, dir, acc, braking]);

    return (

        <div className="App no-select" >
            {x} <br></br>
            {y} <br></br>
            {z} <br></br>
            <h1>Use your {device} to steer the car!</h1>
            <input type="text" ref={playerID} />
            <div className="pedals">
                <div className="brake" onTouchStart={handlePressBrake} onTouchEnd={handleReleaseBrake} onTouchCancel={handleReleaseBrake} onContextMenu={(e)=>{e.preventDefault}}>
                    <h1>Brake</h1>
                    <img src="src/assets/brakepedal.png" alt="" draggable="false" onContextMenu={(e)=>{e.preventDefault}}/>
                </div>
                <div className="accelerate" onTouchStart={handleActivate} onTouchCancel={handleDeactivate} onContextMenu={(e)=>{e.preventDefault}}>
                    <h1>Accelerate</h1>
                    <img src="src/assets/gaspedal.png" alt="" draggable="false" onContextMenu={(e)=>{e.preventDefault}}/>
                </div>

            </div>

            <button onClick={handleStart}>Start</button>
        </div>
    )

}