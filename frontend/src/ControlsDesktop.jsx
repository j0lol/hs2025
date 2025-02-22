import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isMobile } from 'react-device-detect';

export default function ControlsDesktop() {

    const connection = useRef();
    const [device, setDevice] = useState("mouse (around the dot)");

    useEffect(() => {
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

    function calcAngleDegrees(x, y) {
        return (Math.atan2(y, x) * 180) / Math.PI;
      }

    function handleMouseMove(event) {
        let x = event.movementX;
        let y = event.movementY;
        let newDir = (Math.atan2(y, x) * 180) / Math.PI;

        setDir(newDir);
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

            if (connection.current.readyState != 0) {
                try {
                    connection.current.send(JSON.stringify(data));
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
                "id": 0,
                "content": dir
            }
        };

        if (connection.current) {
            if (connection.current.readyState != 0) {
                connection.current.send(JSON.stringify(data));
            }
        }
        // if (connection.current) {
        //     try {
        //         connection.current.send(JSON.stringify(data));
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }

        // setTimeout(300, () => {
        //     console.log('useEffect')
        //     if (dir != 0) {
        //         setDir(0);
        //     }
        // })
    }, [dir])

    return (
        <div className="App">
            {dir}
            <h1>Use your {device} to steer the car!</h1>
            <div className="pedals">
                <div className="brake" onMouseDown={handlePressBrake} onMouseLeave={handleReleaseBrake} onMouseUp={handleReleaseBrake}>
                <img src="src/assets/brakepedal.png" alt=""/>
                </div>
                <div className="accelerate" onMouseDown={handleActivate} onMouseLeave={handleDeactivate} onMouseUp={handleDeactivate}>
                <img src="src/assets/gaspedal.png" alt="" />
                </div>
            </div>
        </div>
    )
}