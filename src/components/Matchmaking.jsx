import './Matchmaking.css'

function Matchmaking({ state, countdown, onCancel }) {
    return (
        <div className="matchmaking-overlay">
            <div className="matchmaking-modal">
                {state === 'searching' && <h1>Waiting for opponent...</h1>}

                {state === 'starting' && (
                    <h1>Starting game in {countdown}...</h1>
                )}
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default Matchmaking