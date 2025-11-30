import { gameStore } from './game.js';
import { PIECE, isValidMove } from './rules.js';

const boardEl = document.getElementById('board');
let selectedCell = null;

// SVG Icons
const ICONS = {
    KNYAZ: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#ffb300" stroke="#5d4037" stroke-width="3"/>
        <path d="M30 60 L30 40 L50 20 L70 40 L70 60 Z" fill="#fff8e1" stroke="#5d4037" stroke-width="2"/>
        <circle cx="30" cy="35" r="5" fill="#d32f2f"/>
        <circle cx="70" cy="35" r="5" fill="#d32f2f"/>
        <circle cx="50" cy="15" r="5" fill="#d32f2f"/>
    </svg>`,
    DEFENDER: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#f5f5f5" stroke="#5d4037" stroke-width="3"/>
        <circle cx="50" cy="50" r="15" fill="#9e9e9e" stroke="#5d4037" stroke-width="2"/>
        <path d="M50 10 L50 90 M10 50 L90 50" stroke="#5d4037" stroke-width="2"/>
    </svg>`,
    ATTACKER: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#212121" stroke="#d32f2f" stroke-width="3"/>
        <path d="M30 30 L70 70 M70 30 L30 70" stroke="#d32f2f" stroke-width="4"/>
    </svg>`
};

export function initBoard() {
    gameStore.subscribe(render);
}

function render(state) {
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
