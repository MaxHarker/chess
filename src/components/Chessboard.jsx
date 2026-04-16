import './Chessboard.css'

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

function Chessboard({
    board, setBoard,
    turn, setTurn,
    castlingRights, setCastlingRights,
    enPassantTarget, setEnPassantTarget,
    highlights, setHighlights
}) {

    const [selected, setSelected] = useState(null)

    function validMoves(piece, color, row, col, board) {
        switch (piece) {
            case 'pawn': {
                const pawnMoves = []

                const dir = color === 'white' ? -1 : 1
                const startRow = color === 'white' ? 6 : 1
                const enemy = color === 'white' ? 'black' : 'white'

                if (!board[row + dir][col]) {
                    pawnMoves.push([row + dir, col])

                    if (row === startRow && !board[row + 2 * dir][col]) {
                        pawnMoves.push([row + 2 * dir, col])
                    }
                }

                for (const dc of [-1, 1]) {
                    const r = row + dir
                    const c = col + dc

                    if (board[r]?.[c] && board[r][c].startsWith(enemy)) {
                        pawnMoves.push([r, c])
                    }
                }

                if (
                    enPassantTarget &&
                    enPassantTarget.color === color &&
                    Math.abs(col - enPassantTarget.col) === 1 &&
                    row === enPassantTarget.row - dir
                ) {
                    pawnMoves.push([enPassantTarget.row, enPassantTarget.col])
                }

                return pawnMoves
            }

            case 'rook': {
                const moves = []
                const dirs = [[1,0],[-1,0],[0,1],[0,-1]]

                for (const [dr, dc] of dirs) {
                    let r = row + dr
                    let c = col + dc

                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board[r][c]) {
                            moves.push([r, c])
                        } else {
                            if (!board[r][c].startsWith(color)) {
                                moves.push([r, c])
                            }
                            break
                        }
                        r += dr
                        c += dc
                    }
                }

                return moves
            }

            case 'bishop': {
                const moves = []
                const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]]

                for (const [dr, dc] of dirs) {
                    let r = row + dr
                    let c = col + dc

                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board[r][c]) {
                            moves.push([r, c])
                        } else {
                            if (!board[r][c].startsWith(color)) {
                                moves.push([r, c])
                            }
                            break
                        }
                        r += dr
                        c += dc
                    }
                }

                return moves
            }

            case 'knight': {
                const moves = []
                const dirs = [
                    [2,1],[2,-1],[-2,1],[-2,-1],
                    [1,2],[1,-2],[-1,2],[-1,-2]
                ]

                for (const [dr, dc] of dirs) {
                    const r = row + dr
                    const c = col + dc

                    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board[r][c] || !board[r][c].startsWith(color)) {
                            moves.push([r, c])
                        }
                    }
                }

                return moves
            }

            case 'queen':
                return [
                    ...validMoves('rook', color, row, col, board),
                    ...validMoves('bishop', color, row, col, board)
                ]

            case 'king': {
                const moves = []
                const dirs = [
                    [1,0],[-1,0],[0,1],[0,-1],
                    [1,1],[1,-1],[-1,1],[-1,-1]
                ]

                for (const [dr, dc] of dirs) {
                    const r = row + dr
                    const c = col + dc

                    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board[r][c] || !board[r][c].startsWith(color)) {
                            moves.push([r, c])
                        }
                    }
                }

                if (color === 'white') {
                    if (castlingRights.white.kingside && !board[7][5] && !board[7][6]) {
                        moves.push([7, 6]);
                    }
                    if (castlingRights.white.queenside && !board[7][1] && !board[7][2] && !board[7][3]) {
                        moves.push([7, 2]);
                    }
                }
                if (color === 'black') {
                    if (castlingRights.black.kingside && !board[0][5] && !board[0][6]) {
                        moves.push([0, 6]);
                    }
                    if (castlingRights.black.queenside && !board[0][1] && !board[0][2] && !board[0][3]) {
                        moves.push([0, 2]);
                    }
                }

                return moves
            }
        }
    }

    const tryMove = (fromRow, fromCol, toRow, toCol) => {
        const piece = board[fromRow][fromCol]
        if (!piece) return false

        const [color, type] = piece.split('_')

        const moves = validMoves(type, color, fromRow, fromCol, board)
        const isValid = moves.some(([r, c]) => r === toRow && c === toCol)

        if (!isValid) return false

        const newBoard = board.map(r => r.slice())
        let newEnPassantTarget = null

        newBoard[toRow][toCol] = piece
        newBoard[fromRow][fromCol] = null

        const isEnPassant =
            type === 'pawn' &&
            enPassantTarget &&
            toRow === enPassantTarget.row &&
            toCol === enPassantTarget.col &&
            enPassantTarget.color === turn

        if (isEnPassant) {
            const captureRow = color === 'white' ? toRow + 1 : toRow - 1
            newBoard[captureRow][toCol] = null
        }

        if (type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
            newEnPassantTarget = {
                row: (fromRow + toRow) / 2,
                col: fromCol,
                color: color === 'white' ? 'black' : 'white'
            }
        }

        if (type === 'king') {
            if (color === 'white' && fromCol === 4 && toCol === 6) {
                newBoard[7][5] = newBoard[7][7]
                newBoard[7][7] = null
            }
            if (color === 'white' && fromCol === 4 && toCol === 2) {
                newBoard[7][3] = newBoard[7][0]
                newBoard[7][0] = null
            }
            if (color === 'black' && fromCol === 4 && toCol === 6) {
                newBoard[0][5] = newBoard[0][7]
                newBoard[0][7] = null
            }
            if (color === 'black' && fromCol === 4 && toCol === 2) {
                newBoard[0][3] = newBoard[0][0]
                newBoard[0][0] = null
            }
        }

        const newRights = { ...castlingRights }

        if (type === 'king') {
            newRights[color].kingside = false
            newRights[color].queenside = false
        }

        if (type === 'rook') {
            if (color === 'white') {
                if (fromRow === 7 && fromCol === 0) newRights.white.queenside = false
                if (fromRow === 7 && fromCol === 7) newRights.white.kingside = false
            } else {
                if (fromRow === 0 && fromCol === 0) newRights.black.queenside = false
                if (fromRow === 0 && fromCol === 7) newRights.black.kingside = false
            }
        }

        setBoard(newBoard)
        setCastlingRights(newRights)
        setEnPassantTarget(newEnPassantTarget)
        setHighlights([])
        setTurn(turn === 'white' ? 'black' : 'white')

        return true
    }

    const handleSquareClick = (row, col) => {
        const piece = board[row][col]

        if (!selected) {
            if (!piece) return

            const [color, type] = piece.split('_')
            if (color !== turn) return

            const moves = validMoves(type, color, row, col, board)
            setSelected({ row, col, moves })
            setHighlights(moves)
            return
        }

        const moved = tryMove(selected.row, selected.col, row, col)

        if (moved) {
            setSelected(null)
            return
        }

        if (piece) {
            const [color, type] = piece.split('_')

            if (color === turn) {
                const moves = validMoves(type, color, row, col, board)
                setSelected({ row, col, moves })
                setHighlights(moves)
                return
            }
        }

        setSelected(null)
        setHighlights([])
    }

    const handleDragStart = (e, row, col) => {
        const piece = board[row][col]
        if (!piece) return

        const [color, type] = piece.split('_')
        if (color !== turn) {
            e.preventDefault()
            return
        }

        const moves = validMoves(type, color, row, col, board)
        setSelected({ row, col, moves })
        setHighlights(moves)


        e.dataTransfer.setData(
            'text/plain',
            JSON.stringify({ row, col })
        )
    }

    const handleDrop = (e, toRow, toCol) => {
        e.preventDefault()

        const data = JSON.parse(e.dataTransfer.getData('text/plain'))
        tryMove(data.row, data.col, toRow, toCol)

        setSelected(null)
    }

    return (
        <div className="chessboard">
            {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {

                    const isLight = (rowIndex + colIndex) % 2 === 0
                    const isHighlighted = highlights.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                    )

                    const isCapture =
                        board[rowIndex][colIndex] &&
                        !board[rowIndex][colIndex].startsWith(turn)

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`square ${isLight ? 'light' : 'dark'} ${
                                isHighlighted ? (isCapture ? 'highlight capture' : 'highlight') : ''
                            }`}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                        >
                            {piece && (
                                <img
                                    src={pieces[piece.split('_')[0]][piece.split('_')[1]]}
                                    alt={piece}
                                    draggable="true"
                                    onDragStart={(e) =>
                                        handleDragStart(e, rowIndex, colIndex)
                                    }
                                />
                            )}
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default Chessboard