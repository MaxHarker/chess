import React from 'react'
import './Square.css'

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
    onDragStart,
    pieces
}) {
    const className = `square 
        ${isLight ? 'light' : 'dark'} ${
        isHighlighted ? (isCapture ? 'highlight capture' : 'highlight') : ''
    }   ${isCheck ? 'check' : ''}`

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