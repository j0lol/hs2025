import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';

export default function ControlsDesktop(props) {
    
    const [device, setDevice] = useState("mouse");
    const [dir, setDir] = useState(0);
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [z, setZ] = useState("");
    const [acc, setAcc] = useState(false)
    const [braking, setBraking] = useState(false);

    useEffect(() => {
        window.addEventListener("keydown", (handleKeyDown));
        window.addEventListener("keyup", (handleKeyUp));
    }, [braking, acc])

    useEffect(() => {

        const noSelectElements = document.querySelectorAll(".no-select");
        noSelectElements.forEach((element) => {
            element.style.webkitUserSelect = "none";
            element.style.mozUserSelect = "none";
            element.style.msUserSelect = "none";
            element.style.userSelect = "none";
          });

        
        
    }, [])

    function calcAngleDegrees(x, y) {
        return (Math.atan2(y, x) * 180) / Math.PI;
      }

    function handleMouseMove(event) {
        let x = event.movementX;
        let y = event.movementY;
        let newDir = (Math.atan2(y, x) * 180) / Math.PI;

        setDir(newDir);
    }
    
    function handleKeyDown(event) {
        const key = event.code
        if (key == "KeyA") {
            setBraking(true);
        } else if (key=="KeyD") {
            setAcc(true);
        }
    }

    function handleKeyUp(event) {
        const key = event.code
        if (key == "KeyA") {
            setBraking(false);
        } else if (key=="KeyD") {
            setAcc(false);
        }
    }

    function handleMotionEvent(event) {

        if (isMobile) {
            
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
                braking: braking
            }

            // console.log('[handleMotionEvent] :: ', JSON.stringify(data))
            if (props.connection.current.readyState != 0) {
                try {
                    if (props.device == "mouse") {
                        props.connection.current.send(JSON.stringify(data));
                    }
                } catch (error) {
                    console.error(error);
                }
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
        window.addEventListener("mousemove", handleMouseMove, true);
    }, [x, y, z]);

    useEffect(() => {
        
        let data = {
            "Accelerometer": {
                "gas_pedal": acc,
                "brake_pedal": braking,
                "id": 0,
                "content": dir
            }
        };

        if (props.connection.current) {


            if (props.connection.current.readyState != 0) {
                if (props.device == "mouse") {
                    props.connection.current.send(JSON.stringify(data));
                }
            }
        }
    }, [dir, acc, braking])

    return (
        <div className="App no-select" >
            <div>
                {dir}
            </div>
            <img src="src/assets/arrow.png" alt="" style={{
                objectFit: 'cover',
                width:'3rem',
                transform: 'rotate('+(90+dir)+'deg)'
                }}/>
            <h1>Use your {device} to steer the car!</h1>
            <div className="pedals">
                <div className="brake" onMouseDown={handlePressBrake} onMouseLeave={handleReleaseBrake} onMouseUp={handleReleaseBrake}
                style={{
                    transform: braking ? `translateY(30px)` : `translateY(0px)`
                }}
                >
                <img src="src/assets/brakepedal.png" alt="" draggable="false"/>
                </div>
                <div className="accelerate" onMouseDown={handleActivate} onMouseLeave={handleDeactivate} onMouseUp={handleDeactivate} 
                style={{
                    transform: acc ? `translateY(30px)` : `translateY(0px)`
                }}>
                <img src="src/assets/gaspedal.png" alt="" draggable="false" />
                </div>
            </div>
            <button onClick={()=>{props.setDevice("mobile")}}>Switch to Gyroscope</button>
        </div>
    )
}