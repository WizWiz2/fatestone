let boardEl = null;
let selectedCell = null;

function initBoard() {
    boardEl = document.getElementById('board');
    gameStore.subscribe(render);
}

function render(state) {
    if (!boardEl) return;
    boardEl.innerHTML = '';
    const { board, turn, winner } = state;

    // Render Cells
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r;
            cell.dataset.c = c;

            // Special squares
            if (r === 4 && c === 4) cell.classList.add('throne');
            if ((r === 0 || r === 8) && (c === 0 || c === 8)) cell.classList.add('corner');

            // Piece
            const pieceVal = board[r][c];
            if (pieceVal !== PIECE.EMPTY) {
                const piece = document.createElement('div');
                piece.className = 'piece';

                if (pieceVal === PIECE.KNYAZ) piece.innerHTML = ICONS.KNYAZ;
                else if (pieceVal === PIECE.DEFENDER) piece.innerHTML = ICONS.DEFENDER;
                else if (pieceVal === PIECE.ATTACKER) piece.innerHTML = ICONS.ATTACKER;

                if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
                    piece.classList.add('selected');
                }

                cell.appendChild(piece);
            }

            // Highlight valid moves
            if (selectedCell) {
                if (isValidMove(board, selectedCell.r, selectedCell.c, r, c, turn)) {
                    cell.classList.add('highlight');
                    cell.onclick = () => handleMove(r, c);
                }
            }

            // Selection click
            if (!cell.onclick) {
                cell.onclick = () => handleSelect(r, c, pieceVal, turn);
            }

            boardEl.appendChild(cell);
        }
    }
}

function handleSelect(r, c, pieceVal, turn) {
    if (gameStore.state.status !== 'PLAYING') return;

    if (pieceVal !== PIECE.EMPTY) {
        const isAttackerTurn = turn === PIECE.ATTACKER;
        const isAttackerPiece = pieceVal === PIECE.ATTACKER;
        const isDefenderPiece = pieceVal === PIECE.DEFENDER || pieceVal === PIECE.KNYAZ;

        if ((isAttackerTurn && isAttackerPiece) || (!isAttackerTurn && isDefenderPiece)) {
            selectedCell = { r, c };
            render(gameStore.state);
        }
    } else {
        // Deselect if clicking empty space (unless it's a valid move, handled above)
        selectedCell = null;
        render(gameStore.state);
    }
}

function handleMove(r, c) {
    if (selectedCell) {
        const fromR = selectedCell.r;
        const fromC = selectedCell.c;
        selectedCell = null; // Clear selection first to prevent render glitch
        gameStore.move(fromR, fromC, r, c);
    }
}

window.initBoard = initBoard;
