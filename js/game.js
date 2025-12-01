class GameStore {
    constructor() {
        this.state = {
            board: [],
            turn: PIECE.ATTACKER,
            history: [],
            status: 'IDLE',
            winner: null
        };
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(l => l(this.state));
    }

    start() {
        this.state = {
            board: getInitialBoard(),
            turn: PIECE.ATTACKER,
            history: [],
            status: 'PLAYING',
            winner: null
        };
        this.notify();
    }

    move(fromR, fromC, toR, toC) {
        if (this.state.status !== 'PLAYING') return;

        const { board, turn } = this.state;
        const piece = board[fromR][fromC];

        if (!isValidMove(board, fromR, fromC, toR, toC, turn)) return;

        // Save History
        this.state.history.push({
            board: JSON.parse(JSON.stringify(board)),
            turn: turn
        });

        // Execute Move
        const newBoard = board.map(row => [...row]);
        newBoard[toR][toC] = piece;
        newBoard[fromR][fromC] = PIECE.EMPTY;

        // Check Captures
        this.applyCaptures(newBoard, toR, toC, turn);

        // Check Win
        const winResult = checkWin(newBoard, turn);

        this.state.board = newBoard;

        if (winResult) {
            this.state.status = 'ENDED';
            this.state.winner = winResult;
        } else {
            this.state.turn = turn === PIECE.ATTACKER ? PIECE.DEFENDER : PIECE.ATTACKER;
        }

        this.notify();
    }

    undo() {
        if (this.state.history.length === 0 || this.state.status !== 'PLAYING') return;

        const lastState = this.state.history.pop();
        this.state.board = lastState.board;
        this.state.turn = lastState.turn;
        this.notify();
    }

    applyCaptures(board, r, c, turn) {
        const enemies = turn === PIECE.ATTACKER ? [PIECE.DEFENDER, PIECE.KNYAZ] : [PIECE.ATTACKER];
        const friends = turn === PIECE.ATTACKER ? [PIECE.ATTACKER] : [PIECE.DEFENDER, PIECE.KNYAZ];

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
                    // Check anvil
                    let isAnvil = friends.includes(farNeighbor);

                    // Corners are hostile to everyone (except King, but King is friend to Defenders)
                    // Actually, Corners are usually hostile to ALL for capture purposes.
                    if (isCorner(nnR, nnC)) isAnvil = true;

                    // Throne is hostile if empty
                    if (isThrone(nnR, nnC) && farNeighbor === PIECE.EMPTY) isAnvil = true;

                    if (isAnvil) {
                        // Capture Logic
                        if (neighbor === PIECE.KNYAZ) {
                            if (this.isKnyazCaptured(board, nR, nC)) {
                                board[nR][nC] = PIECE.EMPTY; // King Captured
                            }
                        } else {
                            board[nR][nC] = PIECE.EMPTY;
                        }
                    }
                }
            }
        });
    }

    isKnyazCaptured(board, r, c) {
        const onThrone = isThrone(r, c);
        const nextToThrone = (Math.abs(r - 4) + Math.abs(c - 4) === 1);

        // If on Throne, needs 4 attackers
        // If next to Throne, needs 3 attackers + Throne? (Variant dependent)
        // Let's stick to: On Throne = 4 sides. Elsewhere = 2 sides (Sandwich).

        if (!onThrone) return true; // Sandwich logic handled by caller loop implies 2 sides, but wait.
        // The caller loop only checks ONE axis.
        // For King, we need to be careful.
        // If King is NOT on throne, he is captured like a normal piece (sandwich).
        // The caller loop `applyCaptures` handles single-axis sandwich. 
        // So `return true` here means "Yes, if sandwiched, he dies".

        // BUT, if on Throne, he needs 4 sides.
        if (onThrone) {
            const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            for (let [dr, dc] of directions) {
                if (board[r + dr][c + dc] !== PIECE.ATTACKER) return false;
            }
            return true;
        }
        return true;
    }
}

const gameStore = new GameStore();
window.gameStore = gameStore;
