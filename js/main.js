import { gameStore } from './game.js';
import { initBoard } from './board.js';
import { PIECE } from './rules.js';
import { AI } from './ai.js';
import { adManager } from './adManager.js';

// UI Elements
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const undoBtn = document.getElementById('undo-btn');
const turnIndicator = document.getElementById('turn-indicator');

// Init
initBoard();
const ai = new AI(PIECE.ATTACKER); // AI plays as Attacker (Black)

// Event Listeners
startBtn.onclick = () => {
    gameStore.start();
    showScreen('game');
    // Show interstitial on start (optional, or maybe on game over)
};

restartBtn.onclick = () => {
    // Show interstitial before restarting
    adManager.showFullscreenAd(() => {
        gameStore.start();
    });
};

menuBtn.onclick = () => {
    showScreen('menu');
};

undoBtn.onclick = () => {
    adManager.showRewardedVideo(() => {
        gameStore.undo();
    });
};

// Game Loop / State Updates
gameStore.subscribe((state) => {
    // Update Turn Indicator
    if (state.status === 'ENDED') {
        turnIndicator.textContent = state.winner === 'DEFENDER_WIN' ? 'Победа Князя!' : 'Князь пленен!';
        turnIndicator.style.color = state.winner === 'DEFENDER_WIN' ? '#ffd700' : '#ff0000';
    } else {
        const isAttacker = state.turn === PIECE.ATTACKER;
        turnIndicator.textContent = isAttacker ? 'Ход: Враги (ИИ)' : 'Ход: Князь';
        turnIndicator.style.color = isAttacker ? '#ff5555' : '#ffd700';

        // Trigger AI Turn
        if (state.status === 'PLAYING' && isAttacker) {
            setTimeout(() => {
                const move = ai.findBestMove(state.board);
                if (move) {
                    gameStore.move(move.fromR, move.fromC, move.toR, move.toC);
                }
            }, 500); // 500ms delay for realism
        }
    }
});

function showScreen(screenName) {
    if (screenName === 'menu') {
        menuScreen.classList.remove('hidden');
        menuScreen.classList.add('active');
        gameScreen.classList.add('hidden');
        gameScreen.classList.remove('active');
    } else {
        menuScreen.classList.add('hidden');
        menuScreen.classList.remove('active');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');
    }
}
