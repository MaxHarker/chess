import './Chessboard.css'

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
    white : {pawn: whitePawn, rook: whiteRook, knight: whiteKnight, bishop: whiteBishop, queen: whiteQueen, king: whiteKing},
    black : {pawn: blackPawn, rook: blackRook, knight: blackKnight, bishop: blackBishop, queen: blackQueen, king: blackKing}
}

function Chessboard({board, setBoard, turn, setTurn, castlingRights, setCastlingRights, enPassantTarget, setEnPassantTarget}) {

    function validMoves(piece, color, row, col, board) {
        switch (piece){
            case 'pawn': {
                const pawnMoves = [];

                const dir = color === 'white' ? -1 : 1;
                const startRow = color === 'white' ? 6 : 1;
                const enemy = color === 'white' ? 'black' : 'white';

                if (!board[row + dir][col]) {
                    pawnMoves.push([row + dir, col]);

                    if (row === startRow && !board[row + 2 * dir][col]) {
                        pawnMoves.push([row + 2 * dir, col]);
                    }
                }

                for (const dc of [-1, 1]) {
                    const r = row + dir;
                    const c = col + dc;

                    if (
                        board[r]?.[c] &&
                        board[r][c].startsWith(enemy)
                    ) {
                        pawnMoves.push([r, c]);
                    }
                }

                if (
                    enPassantTarget &&
                    enPassantTarget.color === color &&
                    Math.abs(col - enPassantTarget.col) === 1 &&
                    row === enPassantTarget.row - dir
                ) {
                    pawnMoves.push([enPassantTarget.row, enPassantTarget.col]);
                }

                return pawnMoves;
            }
                
            case 'rook': {
                const rookMoves = [];

                const directions = [
                    [1, 0],   // down
                    [-1, 0],  // up
                    [0, 1],   // right
                    [0, -1],  // left
                ];

                for (const [dr, dc] of directions) {
                    let r = row + dr;
                    let c = col + dc;

                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board[r][c]) {
                            rookMoves.push([r, c]);
                        } 
                        else {
                            if (!board[r][c].startsWith(color)) {
                                rookMoves.push([r, c]);
                            }
                            break;
                        }

                        r += dr;
                        c += dc;
                    }
                }
                return rookMoves;
            }
            case 'bishop': {
                const bishopMoves = [];
                const directions = [
                    [1, 1],   // down-right
                    [1, -1],  // down-left
                    [-1, 1],  // up-right
                    [-1, -1], // up-left
                ];

                for (const [dr, dc] of directions) {
                    let r = row + dr;
                    let c = col + dc;

                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board[r][c]) {
                            bishopMoves.push([r, c]);
                        } 
                        else {
                            if (!board[r][c].startsWith(color)) {
                                bishopMoves.push([r, c]);
                            }
                            break;
                        }

                        r += dr;
                        c += dc;
                    }
                }
                return bishopMoves;
            }
            case 'knight': {
                const knightMoves = [];
                const moves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2]
                ];
                for (const [dr, dc] of moves) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (!board[newRow][newCol] || !board[newRow][newCol].startsWith(color)) {
                            knightMoves.push([newRow, newCol]);
                        }
                    }
                }
                return knightMoves;
            }
            case 'queen': {
                const rookLike = validMoves('rook', color, row, col, board);
                const bishopLike = validMoves('bishop', color, row, col, board);
                return [...rookLike, ...bishopLike];
            }
            case 'king': {
                const kingMoves = [];
                const moves = [
                    [1, 0], [-1, 0], [0, 1], [0, -1],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                for (const [dr, dc] of moves) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (!board[newRow][newCol] || !board[newRow][newCol].startsWith(color)) {
                            kingMoves.push([newRow, newCol]);
                        }
                    }
                }
                if (color === 'white') {
                    if (castlingRights.white.kingside && !board[7][5] && !board[7][6]) {
                        kingMoves.push([7, 6]);
                    }
                    if (castlingRights.white.queenside && !board[7][1] && !board[7][2] && !board[7][3]) {
                        kingMoves.push([7, 2]);
                    }
                }
                if (color === 'black') {
                    if (castlingRights.black.kingside && !board[0][5] && !board[0][6]) {
                        kingMoves.push([0, 6]);
                    }
                    if (castlingRights.black.queenside && !board[0][1] && !board[0][2] && !board[0][3]) {
                        kingMoves.push([0, 2]);
                    }
                }
                return kingMoves;
            }
        }
    }

    const handleDragStart = (e, row, col) => {
        const piece = board[row][col];
        if (!piece) return;
        const [color, type] = piece.split('_');
        if (color !== turn) {
            e.preventDefault();
            return;
        }
        
        e.dataTransfer.setData('text/plain', JSON.stringify({ row, col }));
        const dragImg = e.target.cloneNode(true);
        dragImg.style.position = 'absolute';
        dragImg.style.top = '-1000px';
        dragImg.style.left = '-1000px';
        dragImg.style.width = '48px';
        dragImg.style.height = '48px';
        document.body.appendChild(dragImg);
        e.dataTransfer.setDragImage(dragImg, 24, 24);
        setTimeout(() => document.body.removeChild(dragImg), 0);
    };

    const handleDrop = (e, targetRow, targetCol) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { row: fromRow, col: fromCol } = data;

        const piece = board[fromRow][fromCol];
        if (!piece) return;
        const [color, type] = piece.split('_');
        if (color !== turn) return;

        const moves = validMoves(type, color, fromRow, fromCol, board);
        const isValidMove = moves.some(([r, c]) => r === targetRow && c === targetCol);
        if (!isValidMove) return;

        const newBoard = board.map(row => row.slice());
        let newEnPassantTarget = null;
        newBoard[targetRow][targetCol] = piece;
        newBoard[fromRow][fromCol] = null;

        const isEnPassant =
            type === 'pawn' &&
            enPassantTarget &&
            targetRow === enPassantTarget.row &&
            targetCol === enPassantTarget.col &&
            enPassantTarget.color === turn;
        
        if (isEnPassant) {
            const captureRow = color === 'white' ? targetRow + 1 : targetRow - 1;
            newBoard[captureRow][targetCol] = null;
        }

        if (type === 'pawn' && Math.abs(targetRow - fromRow) === 2) {
            newEnPassantTarget = {
                row: (fromRow + targetRow) / 2,
                col: fromCol,
                color: color === 'white' ? 'black' : 'white'
            };
        }

        if (type === 'king') {
            // White kingside
            if (color === 'white' && fromRow === 7 && fromCol === 4 && targetRow === 7 && targetCol === 6) {
                newBoard[7][5] = newBoard[7][7];
                newBoard[7][7] = null;
            }

            // White queenside
            if (color === 'white' && fromRow === 7 && fromCol === 4 && targetRow === 7 && targetCol === 2) {
                newBoard[7][3] = newBoard[7][0];
                newBoard[7][0] = null;
            }

            // Black kingside
            if (color === 'black' && fromRow === 0 && fromCol === 4 && targetRow === 0 && targetCol === 6) {
                newBoard[0][5] = newBoard[0][7];
                newBoard[0][7] = null;
            }

            // Black queenside
            if (color === 'black' && fromRow === 0 && fromCol === 4 && targetRow === 0 && targetCol === 2) {
                newBoard[0][3] = newBoard[0][0];
                newBoard[0][0] = null;
            }
        }

        const newRights = { ...castlingRights };

        if (type === 'king') {
            newRights[color].kingside = false;
            newRights[color].queenside = false;
        }

        if (type === 'rook') {
            if (color === 'white') {
                if (fromRow === 7 && fromCol === 0) newRights.white.queenside = false;
                if (fromRow === 7 && fromCol === 7) newRights.white.kingside = false;
            }
            if (color === 'black') {
                if (fromRow === 0 && fromCol === 0) newRights.black.queenside = false;
                if (fromRow === 0 && fromCol === 7) newRights.black.kingside = false;
            }
        }
        setCastlingRights(newRights);
        setBoard(newBoard);
        setEnPassantTarget(newEnPassantTarget);
        turn === 'white' ? setTurn('black') : setTurn('white');
    }

    return (
        <div className="chessboard">
            {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                return (
                    <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`square ${isLight ? 'light' : 'dark'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                    >
                    {piece && (
                        <img
                        src={pieces[piece.split('_')[0]][piece.split('_')[1]]}
                        alt={piece}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
                        />
                    )}
                    </div>
                );
                })
            )}
        </div>
        )
}

export default Chessboard