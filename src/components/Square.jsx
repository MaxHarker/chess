import React from 'react'
import './Square.css'

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

function Square({
    row,
    col,
    piece,
    isLight,
    isHighlighted,
    isCapture,
    isCheck,
    onClick,
    onDrop,
    onDragOver,
    onDragStart
}) {
    const className = `square 
        ${isLight ? 'light' : 'dark'} ${
        isHighlighted ? (isCapture ? 'highlight capture' : 'highlight') : ''
    } ${isCheck ? 'check' : ''}`

    return (
        <div
            className={className}
            onClick={() => onClick(row, col)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, row, col)}
        >
            {piece && (
                <img
                    src={pieces[piece.split('_')[0]][piece.split('_')[1]]}
                    alt={piece}
                    draggable="true"
                    onDragStart={(e) => onDragStart(e, row, col)}
                />
            )}
        </div>
    )
}

export default Square