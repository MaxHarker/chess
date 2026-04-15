import { useState } from 'react'
import './App.css'
import Chessboard from './components/Chessboard'

function App() {
  const startingBoard = [
    ['black_rook', 'black_knight', 'black_bishop', 'black_queen', 'black_king', 'black_bishop', 'black_knight', 'black_rook'],
    Array(8).fill('black_pawn'),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill('white_pawn'),
    ['white_rook', 'white_knight', 'white_bishop', 'white_queen', 'white_king', 'white_bishop', 'white_knight', 'white_rook']
  ]

  const [board, setBoard] = useState(() => startingBoard)
  const [turn, setTurn] = useState('white')
  const [castlingRights, setCastlingRights] = useState({
    white: {kingside: true, queenside: true}, 
    black: {kingside: true, queenside: true}
  })
  const [enPassantTarget, setEnPassantTarget] = useState(null)

  return (
    <>
      <Chessboard board={board} setBoard={setBoard} turn={turn} setTurn={setTurn} castlingRights={castlingRights} setCastlingRights={setCastlingRights} enPassantTarget={enPassantTarget} setEnPassantTarget={setEnPassantTarget} />
    </>
  )
}

export default App
