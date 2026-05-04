import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './GameOver.css'
import loss from '../assets/loss.mp3'
import win from '../assets/win.mp3'
import draw from '../assets/draw.mp3'

function GameOver({ status, winner, onRestart }) {
    const navigate = useNavigate()

    useEffect(() => {
        const audio = new Audio(winner === 'win' ? win : winner === 'loss' ? loss : draw)
        audio.play()
    }, [])

    return (
        <div className="game-over-overlay">
            <div className={`game-over-modal ${winner}`}>
                <h1>
                    {status === 'checkmate' ? 'Checkmate' : 'Stalemate'}
                </h1>

                <p className={`result-text ${winner}`}>
                    {status === 'stalemate'
                        ? 'Draw'
                        : winner === 'win'
                        ? 'You Win!'
                        : 'You Lose'}
                </p>

                <button onClick={onRestart}>
                    Play Again
                </button>
            </div>
        </div>
    )
}

export default GameOver