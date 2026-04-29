import './Chessboard.css'
import Square from './Square'
import { useState } from 'react'

import whitePawn from '../assets/whitePawn.png'
import whiteRook from '../assets/whiteRook.png'
import whiteKnight from '../assets/whiteKnight.png'
import whiteBishop from '../assets/whiteBishop.png'
import whiteQueen from '../assets/whiteQueen.png'
import whiteKing from '../assets/whiteKing.png'

import blackPawn from '../assets/blackPawn.png'
import blackRook from '../assets/blackRook.png'
import blackKnight from '../assets/blackKnight.png'
import blackBishop from '../assets/blackBishop.png'
import blackQueen from '../assets/blackQueen.png'
import blackKing from '../assets/blackKing.png'

import move from '../assets/move.mp4'
import capture from '../assets/capture2.mp4'

import { validMoves, tryMove, legalMoves, isKingInCheck, findKing, hasLegalMoves } from '../logic/chessLogic'

const pieces = {
    white: {
        pawn: whitePawn,
        rook: whiteRook,
        knight: whiteKnight,
        bishop: whiteBishop,
        queen: whiteQueen,
        king: whiteKing
    },
    black: {
        pawn: blackPawn,
        rook: blackRook,
        knight: blackKnight,
        bishop: blackBishop,
        queen: blackQueen,
        king: blackKing
    }
}


function Chessboard({ gameState, setGameState }) {

    const highlights = gameState.selected ? gameState.selected.moves : []

    const inCheck = isKingInCheck(gameState.turn, gameState)

    const kingPos = inCheck
        ? findKing(gameState.turn, gameState.board)
        : null

    const handleSquareClick = (row, col) => {
        if (gameState.status !== 'playing') return
        const piece = gameState.board[row][col]

        // CASE 1: clicking same selected square → deselect
        if (gameState.selected && gameState.selected.row === row && gameState.selected.col === col) {
            setGameState({ ...gameState, selected: null })
            return
        }

        // CASE 2: clicking another piece (ALWAYS allow re-selection first)
        if (piece) {
            const [color, type] = piece.split('_')

            if (color === gameState.turn) {
                const moves = legalMoves(
                    type,
                    color,
                    row,
                    col,
                    gameState
                )

                setGameState({ ...gameState, selected: { row, col, moves } })
                return
            }
        }

        // CASE 3: if something is selected → try move
        if (gameState.selected) {
            const newState = tryMove(
                gameState.selected.row,
                gameState.selected.col,
                row,
                col,
                gameState
            )

            if (newState) {
                setGameState({ ...newState, selected: null })
                gameState.board[row][col] ? new Audio(capture).play() : new Audio(move).play()
            }
            return
        }
        return
    }

    const handleDragStart = (e, row, col) => {
        if (gameState.status !== 'playing') return
        
        const piece = gameState.board[row][col]
        if (!piece) return

        const [color, type] = piece.split('_')
        if (color !== gameState.turn) {
            e.preventDefault()
            return
        }

        const moves = legalMoves(
            type,
            color,
            row,
            col,
            gameState
        )

        setGameState({ ...gameState, selected: { row, col, moves } })

        e.dataTransfer.setData(
            'text/plain',
            JSON.stringify({ row, col })
        )
    }

    const handleDrop = (e, toRow, toCol) => {
        e.preventDefault()

        const data = JSON.parse(e.dataTransfer.getData('text/plain'))

        const newState = tryMove(
            data.row,
            data.col,
            toRow,
            toCol,
            gameState
        )

        if (newState) {
            setGameState({ ...newState, selected: null })
            gameState.board[toRow][toCol] ? new Audio(capture).play() : new Audio(move).play()
        }
    }

    return (
        <div className="chessboard">
            {gameState.board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {

                    const isLight = (rowIndex + colIndex) % 2 === 0

                    const isHighlighted = highlights.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                    )

                    const isCapture =
                        piece &&
                        !piece.startsWith(gameState.turn)
                        
                    const isCheckSquare =
                        inCheck &&
                        kingPos &&
                        kingPos[0] === rowIndex &&
                        kingPos[1] === colIndex

                    return (
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            row={rowIndex}
                            col={colIndex}
                            piece={piece}
                            isLight={isLight}
                            isHighlighted={isHighlighted}
                            isCapture={isCapture}
                            isCheck={isCheckSquare}
                            onClick={handleSquareClick}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onDragStart={handleDragStart}
                            pieces={pieces}
                        />
                    )
                })
            )}
        </div>
    )
}

export default Chessboard