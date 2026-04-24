export function validMoves(
    piece,
    color,
    row,
    col,
    gameState
) {
    const { board, enPassantTarget, castlingRights } = gameState

    function getSlidingMoves(dirs, row, col, color, board) {
        const moves = []

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

        case 'knight': {
            const knightMoves = []
            const dirs = [
                [2,1],[2,-1],[-2,1],[-2,-1],
                [1,2],[1,-2],[-1,2],[-1,-2]
            ]

            for (const [dr, dc] of dirs) {
                const r = row + dr
                const c = col + dc

                if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                    if (!board[r][c] || !board[r][c].startsWith(color)) {
                        knightMoves.push([r, c])
                    }
                }
            }

            return knightMoves
        }

        case 'king': {
            const kingMoves = []
            const dirs = [
                [1,0],[-1,0],[0,1],[0,-1],
                [1,1],[1,-1],[-1,1],[-1,-1]
            ]

            for (const [dr, dc] of dirs) {
                const r = row + dr
                const c = col + dc

                if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                    if (!board[r][c] || !board[r][c].startsWith(color)) {
                        kingMoves.push([r, c])
                    }
                }
            }

            if (color === 'white') {
                if (castlingRights.white.kingside && !board[7][5] && !board[7][6]) {
                    kingMoves.push([7, 6])
                }
                if (castlingRights.white.queenside && !board[7][1] && !board[7][2] && !board[7][3]) {
                    kingMoves.push([7, 2])
                }
            }

            if (color === 'black') {
                if (castlingRights.black.kingside && !board[0][5] && !board[0][6]) {
                    kingMoves.push([0, 6])
                }
                if (castlingRights.black.queenside && !board[0][1] && !board[0][2] && !board[0][3]) {
                    kingMoves.push([0, 2])
                }
            }

            return kingMoves
        }

        case 'rook':
            return getSlidingMoves(
                [[1,0],[-1,0],[0,1],[0,-1]],
                row,
                col,
                color,
                board
            )

        case 'bishop':
            return getSlidingMoves(
                [[1,1],[1,-1],[-1,1],[-1,-1]],
                row,
                col,
                color,
                board
            )

        case 'queen':
            return getSlidingMoves(
                [
                    [1,0],[-1,0],[0,1],[0,-1], // rook dirs
                    [1,1],[1,-1],[-1,1],[-1,-1] // bishop dirs
                ],
                row,
                col,
                color,
                board
            )
    }
}

export function tryMove(
    fromRow,
    fromCol,
    toRow,
    toCol,
    gameState
) {
    const {
        board,
        turn,
        castlingRights,
        enPassantTarget
    } = gameState

    const piece = board[fromRow][fromCol]
    if (!piece) return null

    const [color, type] = piece.split('_')

    const moves = legalMoves(
        type,
        color,
        fromRow,
        fromCol,
        gameState
    )

    const isValid = moves.some(([r, c]) => r === toRow && c === toCol)
    if (!isValid) return null

    // --- MOVE PIECE ---
    const newBoard = board.map(r => r.slice())
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = null

    // --- EN PASSANT ---
    let newEnPassantTarget = null
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

    // --- CASTLING ---
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

    // --- CASTLING RIGHTS ---
    const newRights = {
        white: { ...castlingRights.white },
        black: { ...castlingRights.black }
    }

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

    // --- RETURN NEW STATE ---
    return {
        ...gameState,
        board: newBoard,
        castlingRights: newRights,
        enPassantTarget: newEnPassantTarget,
        selected: null,
        turn: turn === 'white' ? 'black' : 'white'
    }
}

export function findKing(color, board){
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === `${color}_king`) {
                return [r, c]
            }
        }
    }
    return null
}

export function isKingInCheck(color, gameState) {
    const { board } = gameState
    let kingPosition = findKing(color, board)
    if (!kingPosition) return false

    const [kingRow, kingCol] = kingPosition
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c]
            if (piece && piece.split('_')[0] !== color) {
                const [enemyColor, enemyType] = piece.split('_')
                const moves = validMoves(enemyType, enemyColor, r, c, gameState)
                if (moves.some(([mr, mc]) => mr === kingRow && mc === kingCol)) {
                    return true
                }
            }
        }
    }
    return false
}

export function legalMoves(
    piece,
    color,
    row,
    col,
    gameState
) {
    const moves = validMoves(piece, color, row, col, gameState)

    return moves.filter(([toRow, toCol]) => {
        // simulate move
        const newBoard = gameState.board.map(r => r.slice())
        newBoard[toRow][toCol] = newBoard[row][col]
        newBoard[row][col] = null

        const newState = {
            ...gameState,
            board: newBoard
        }

        return !isKingInCheck(color, newState)
    })
}

export function hasLegalMoves(color, gameState) {
    const { board } = gameState

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c]
            if (!piece || !piece.startsWith(color)) continue

            const [, type] = piece.split('_')

            const moves = validMoves(type, color, r, c, gameState)

            for (const [toRow, toCol] of moves) {
                const newBoard = board.map(row => row.slice())
                newBoard[toRow][toCol] = piece
                newBoard[r][c] = null

                const newState = {
                    ...gameState,
                    board: newBoard
                }
                // if this move escapes check → not checkmate
                if (!isKingInCheck(color, newState, validMoves)) {
                    return true
                }
            }
        }
    }

    return false
}