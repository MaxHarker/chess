import { useNavigate } from 'react-router-dom'
import './TitleScreen.css'

function TitleScreen() {
    const navigate = useNavigate()

    return (
        <div className="title-screen">
            <h1>Chess</h1>

            <button onClick={() => navigate('/game')}>
                Start Game
            </button>
            <h3>Version 1.0.4</h3>
        </div>
    )
}

export default TitleScreen