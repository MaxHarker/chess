import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initialGameState } from './logic/initialGameState.js'
import { hasLegalMoves, isKingInCheck } from './logic/chessLogic.js'

import { io } from 'socket.io-client'
const socket = io('https://chess-server-imx5.onrender.com')

import Chessboard from './components/Chessboard'
import GameOver from './components/GameOver'
import TitleScreen from './components/TitleScreen'
import PromotionModal from './components/PromotionModal'
import Matchmaking from './components/Matchmaking'

import move from './assets/move.mp3'
import capture from './assets/capture2.mp3'

function App() {
    const navigate = useNavigate()

    const [gameState, setGameState] = useState(initialGameState)
    const [roomId, setRoomID] = useState(null)
    const [playerColor, setPlayerColor] = useState(null)
    const [matchmaking, setMatchmaking] = useState(null)
    const [countdown, setCountdown] = useState(null)

    useEffect(() => {
        socket.on('matchFound', ({ roomId, color }) => {
            setRoomID(roomId)
            setPlayerColor(color)
            console.log(`Match found! Room ID: ${roomId}, You are playing as ${color}`)
        })

        socket.on('gameState', (state) => {
            setGameState(state)
        })

        socket.on('gameStart', ({ gameState, startTime }) => {
            console.log("Game starting!")
            setGameState(gameState)
            setMatchmaking('starting')

            const interval = setInterval(() => {
                const secondsLeft = Math.ceil((startTime - Date.now()) / 1000)

                if (secondsLeft <= 0) {
                    clearInterval(interval)
                    setCountdown(0)
                    setMatchmaking(null)
                } else {
                    setCountdown(secondsLeft)
                }
            }, 100)
        })

        socket.on('moveMade', ({ type }) => {
            const audio = new Audio(type === 'capture' ? capture : move)
            audio.play()
        })

        return () => {
            socket.off('connect', handleConnect)
            socket.off('gameState')
            socket.off('gameStart')
            socket.off('moveMade')
        }
    }, [roomId])

    function handlePromotion(piece) {
        socket.emit('promotePawn', {
            roomId,
            piece
        })
    }

    function handleRestart() {
        socket.disconnect()
        socket.connect()

        setGameState(initialGameState)
        setRoomID(null)
        setPlayerColor(null)

        navigate('/')
    }

    function handleConnect() {
        socket.emit('findMatch')
        setMatchmaking('searching')
        navigate('/game')
    }

    return (
        <Routes>
            <Route
                path="/"
                element={<TitleScreen handleConnect={handleConnect} />}
            />

            <Route
                path="/game"
                element={
                    <div className="game-container">
                        <Chessboard
                            gameState={gameState}
                            setGameState={setGameState}
                            socket={socket}
                            roomId={roomId}
                            playerColor={playerColor}
                        />

                        {matchmaking && <Matchmaking state={matchmaking} countdown={countdown} onCancel={handleRestart} />}

                        {(gameState.status === 'checkmate' || gameState.status === 'stalemate') && (
                            <GameOver 
                                status={gameState.status} 
                                winner={gameState.winner == playerColor ? 'win' : 'loss'}
                                onRestart={handleRestart}
                            />
                        )}

                        {gameState.pendingPromotion &&
                            gameState.pendingPromotion.color === playerColor && (
                                <PromotionModal
                                    color={gameState.pendingPromotion.color}
                                    onSelect={handlePromotion}
                                />
                            )}
                    </div>
                }
            />
        </Routes>
    )
}

export default App