import { useNavigate } from 'react-router-dom'
import './GameOver.css'

function GameOver({ status, onRestart }) {
    const navigate = useNavigate()

    const handleRestart = () => {
        onRestart()
        navigate('/game')
    }

    return (
        <div className="game-over-overlay">
            <div className="game-over-modal">
                <h1>
                    {status === 'checkmate' ? 'Checkmate' : 'Stalemate'}
                </h1>

                <button onClick={handleRestart}>
                    Play Again
                </button>
            </div>
        </div>
    )
}

export default GameOver