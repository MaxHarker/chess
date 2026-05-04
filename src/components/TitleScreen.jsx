import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './TitleScreen.css'

function TitleScreen({ setRoomID, setMatchmaking }) {
    const navigate = useNavigate()

    useEffect(() => {
        console.log("ROUTE CHANGE: HOME")
    }, [])

    return (
        <div className="title-screen">
            <h1>Chess</h1>

            <button onClick={() => {
                const newRoomID = 'test-room'
                setRoomID(newRoomID)
                setMatchmaking('searching')
                navigate('/game')
            }}>
                Start Game
            </button>
            <h3>Version 1.1.5</h3>
        </div>
    )
}

export default TitleScreen