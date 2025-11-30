import { BOARD_SIZE, PIECE, isValidMove, isCorner, isThrone } from './rules.js';

export class AI {
    constructor(pieceType) {
        this.pieceType = pieceType; // Usually PIECE.ATTACKER
    }

    findBestMove(board) {
        const moves = this.getAllValidMoves(board);
        if (moves.length === 0) return null;

        let bestScore = -Infinity;
        let bestMoves = [];

        for (const move of moves) {
            const score = this.evaluateMove(board, move);
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (score === bestScore) {
                bestMoves.push(move);
            }
        }

        // Randomly pick one of the best moves to avoid loops
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    getAllValidMoves(board) {
        const moves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] === this.pieceType) {
                    // Check all 4 directions
                    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                    for (const [dr, dc] of directions) {
                        let nr = r + dr;
                        let nc = c + dc;
                        while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                            if (isValidMove(board, r, c, nr, nc, this.pieceType)) {
                                moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
                            }
                            // Stop if blocked (isValidMove handles logic, but for optimization we can break early if blocked by piece)
                            if (board[nr][nc] !== PIECE.EMPTY) break;
                            nr += dr;
                            nc += dc;
                        }
                    }
                }
            }
        }
        return moves;
    }

    evaluateMove(board, move) {
        let score = 0;
        const { fromR, fromC, toR, toC } = move;

        // Simulate move
        // Note: We are not deep copying for speed, just checking immediate consequences
        // But to check captures we need to know the board state.
        // Let's do a quick check for captures.

        // 1. Capture Bonus
        const captured = this.checkPotentialCaptures(board, toR, toC);
        score += captured * 100;

        // 2. Block King Bonus (if Attacker)
        if (this.pieceType === PIECE.ATTACKER) {
            const kingPos = this.findKing(board);
            if (kingPos) {
                const distBefore = Math.abs(fromR - kingPos.r) + Math.abs(fromC - kingPos.c);
                const distAfter = Math.abs(toR - kingPos.r) + Math.abs(toC - kingPos.c);

                // Move closer to King
                if (distAfter < distBefore) score += 10;

                // Block Corner Path (Simple check: is new pos on a line with King and Corner?)
                // Too complex for simple greedy? Let's just value being near the King.
            }
        }

        // 3. Randomness for variety
        score += Math.random() * 5;

        return score;
    }

    checkPotentialCaptures(board, r, c) {
        // Simplified capture check (doesn't actually modify board, just counts)
        // This mirrors logic in game.js but is purely for evaluation
        let capturedCount = 0;
        const enemies = this.pieceType === PIECE.ATTACKER ? [PIECE.DEFENDER, PIECE.KNYAZ] : [PIECE.ATTACKER];
        const friends = this.pieceType === PIECE.ATTACKER ? [PIECE.ATTACKER] : [PIECE.DEFENDER, PIECE.KNYAZ];

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        directions.forEach(([dr, dc]) => {
            const nR = r + dr;
            const nC = c + dc;
            const nnR = r + dr * 2;
            const nnC = c + dc * 2;

            if (nnR >= 0 && nnR < BOARD_SIZE && nnC >= 0 && nnC < BOARD_SIZE) {
                const neighbor = board[nR][nC];
                const farNeighbor = board[nnR][nnC];

                if (enemies.includes(neighbor)) {
                    let isAnvil = friends.includes(farNeighbor);
                    if (isCorner(nnR, nnC)) isAnvil = true;
                    if (isThrone(nnR, nnC) && farNeighbor === PIECE.EMPTY) isAnvil = true;

                    if (isAnvil) {
                        capturedCount++;
                    }
                }
            }
        });
        return capturedCount;
    }

    findKing(board) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] === PIECE.KNYAZ) return { r, c };
            }
        }
        return null;
    }
}
