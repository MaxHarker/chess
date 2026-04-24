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
        </div>
    )
}

export default TitleScreen