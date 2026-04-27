import './PromotionModal.css'

function PromotionModal({ color, onSelect }) {
    const pieces = ['queen', 'rook', 'bishop', 'knight']

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Choose promotion</h2>

                <div className="options">
                    {pieces.map(piece => (
                        <button
                            key={piece}
                            onClick={() => onSelect(piece)}
                        >
                            {piece}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PromotionModal