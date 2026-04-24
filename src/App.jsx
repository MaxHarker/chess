import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initialGameState } from './logic/initialGameState'
import Chessboard from './components/Chessboard'
import GameOver from './components/GameOver'
import TitleScreen from './components/TitleScreen'
import { hasLegalMoves, isKingInCheck } from './logic/chessLogic'

function App() {
    const [gameState, setGameState] = useState(initialGameState)

    useEffect(() => {
        if (gameState.status !== 'playing') return

        const turn = gameState.turn

        const hasMoves = hasLegalMoves(turn, gameState)
        const inCheck = isKingInCheck(turn, gameState)

        if (!hasMoves && inCheck) {
            setGameState(prev => ({
                ...prev,
                status: 'checkmate'
            }))
        }

        if (!hasMoves && !inCheck) {
            setGameState(prev => ({
                ...prev,
                status: 'stalemate'
            }))
        }
    }, [gameState.board, gameState.turn])

    const restartGame = () => {
        setGameState(initialGameState)
    }

    const isGameOver =
        gameState.status === 'checkmate' ||
        gameState.status === 'stalemate'

    return (
        <Routes>
            {/* 🎬 Title Screen */}
            <Route
                path="/"
                element={<TitleScreen />}
            />

            {/* ♟️ Game Screen */}
            <Route
                path="/game"
                element={
                    <div className="game-container">
                        <Chessboard
                            gameState={gameState}
                            setGameState={setGameState}
                        />

                        {isGameOver && (
                            <GameOver
                                status={gameState.status}
                                onRestart={restartGame}
                            />
                        )}
                    </div>
                }
            />
        </Routes>
    )
}

export default App