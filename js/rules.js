const BOARD_SIZE = 9;
const PIECE = {
    EMPTY: 0,
    ATTACKER: 1,
    DEFENDER: 2,
    KNYAZ: 3
};

function getInitialBoard() {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(PIECE.EMPTY));

    // Attackers (16)
    const attackers = [
        [3, 0], [4, 0], [5, 0], [4, 1],
        [3, 8], [4, 8], [5, 8], [4, 7],
        [0, 3], [0, 4], [0, 5], [1, 4],
        [8, 3], [8, 4], [8, 5], [7, 4]
    ];
    attackers.forEach(([r, c]) => board[r][c] = PIECE.ATTACKER);

    // Defenders (8)
    const defenders = [
        [4, 2], [4, 3], [4, 5], [4, 6],
        [2, 4], [3, 4], [5, 4], [6, 4]
    ];
    defenders.forEach(([r, c]) => board[r][c] = PIECE.DEFENDER);

    // Knyaz
    board[4][4] = PIECE.KNYAZ;

    return board;
}

function isValidMove(board, fromR, fromC, toR, toC, turn) {
    if (board[toR][toC] !== PIECE.EMPTY) return false;
    if (fromR !== toR && fromC !== toC) return false; // Diagonal check

    // Check path is clear
    const dr = Math.sign(toR - fromR);
    const dc = Math.sign(toC - fromC);
    let r = fromR + dr;
    let c = fromC + dc;
    while (r !== toR || c !== toC) {
        if (board[r][c] !== PIECE.EMPTY) return false;
        r += dr;
        c += dc;
    }

    const isKnyaz = board[fromR][fromC] === PIECE.KNYAZ;

    // Corner check: Only Knyaz can land on corners
    if (isCorner(toR, toC) && !isKnyaz) return false;

    // Throne check: Only Knyaz can land on Throne (4,4)
    // Exception: If Knyaz leaves throne, can he return? Usually yes.
    // Can others pass through? No (blocked by piece usually).
    // Can others land? No.
    if (toR === 4 && toC === 4 && !isKnyaz) return false;

    return true;
}

function isCorner(r, c) {
    return (r === 0 || r === BOARD_SIZE - 1) && (c === 0 || c === BOARD_SIZE - 1);
}

function isThrone(r, c) {
    return r === 4 && c === 4;
}

function checkWin(board, turn) {
    // Check Knyaz escape
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === PIECE.KNYAZ && isCorner(r, c)) {
                return 'DEFENDER_WIN';
            }
        }
    }

    // Check Knyaz capture
    let kR = -1, kC = -1;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === PIECE.KNYAZ) {
                kR = r; kC = c; break;
            }
        }
    }

    if (kR === -1) return 'ATTACKER_WIN'; // Captured

    // Check if Attackers have no moves? (Stalemate usually loss for current player, but rare)

    return null;
}

window.BOARD_SIZE = BOARD_SIZE;
window.PIECE = PIECE;
window.getInitialBoard = getInitialBoard;
window.isValidMove = isValidMove;
window.isCorner = isCorner;
window.isThrone = isThrone;
window.checkWin = checkWin;
