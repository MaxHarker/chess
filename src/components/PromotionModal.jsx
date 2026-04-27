import './PromotionModal.css'
import whiteQueen from '../assets/whiteQueen.png'
import whiteRook from '../assets/whiteRook.png'
import whiteBishop from '../assets/whiteBishop.png'
import whiteKnight from '../assets/whiteKnight.png'

import blackQueen from '../assets/blackQueen.png'
import blackRook from '../assets/blackRook.png'
import blackBishop from '../assets/blackBishop.png'
import blackKnight from '../assets/blackKnight.png'

function PromotionModal({ color, onSelect }) {
    const pieces = ['queen', 'rook', 'bishop', 'knight']

    const pieceImages = {
        white: {
            queen: whiteQueen,
            rook: whiteRook,
            bishop: whiteBishop,
            knight: whiteKnight,
        },
        black: {
            queen: blackQueen,
            rook: blackRook,
            bishop: blackBishop,
            knight: blackKnight,
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Choose promotion</h2>

                <div className="options">
                    {pieces.map(piece => (
                        <button
                            key={piece}
                            onClick={() => onSelect(piece)}
                            className="piece-option"
                        >
                            <img
                                src={pieceImages[color][piece]}
                                alt={piece}
                            />
                            <span>{piece}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PromotionModal