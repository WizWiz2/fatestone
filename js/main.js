// UI Elements
let menuScreen, gameScreen, rulesScreen;
let startBtn, rulesBtn, restartBtn, menuBtn, undoBtn, rulesBackBtn, menuLangBtn;
let turnIndicator, rulesTitle, rulesText, gameTitle;
let adTitle, adBody, adCloseBtn;

// State
let currentLang = 'RU';
let latestState = null;

function initApp() {
    menuScreen = document.getElementById('menu-screen');
    gameScreen = document.getElementById('game-screen');
    rulesScreen = document.getElementById('rules-screen');
    startBtn = document.getElementById('start-btn');
    rulesBtn = document.getElementById('rules-btn');
    restartBtn = document.getElementById('restart-btn');
    menuBtn = document.getElementById('menu-btn');
    undoBtn = document.getElementById('undo-btn');
    turnIndicator = document.getElementById('turn-indicator');
    rulesTitle = document.getElementById('rules-title');
    rulesText = document.getElementById('rules-text');
    rulesBackBtn = document.getElementById('back-button');
    menuLangBtn = document.getElementById('menu-lang-btn');
    gameTitle = document.getElementById('game-title');
    adTitle = document.getElementById('ad-title');
    adBody = document.getElementById('ad-body');
    adCloseBtn = document.getElementById('close-ad-btn');

    initBoard();
    const ai = new AI(PIECE.ATTACKER); // AI plays as Attacker (Black)
    updateUITexts();

    if (startBtn) {
        startBtn.onclick = () => {
            gameStore.start();
            showScreen('game');
        };
    }

    if (rulesBtn) {
        rulesBtn.onclick = () => {
            showScreen('rules');
        };
    }

    if (rulesBackBtn) {
        rulesBackBtn.onclick = () => {
            showScreen('menu');
        };
    }

    if (menuLangBtn) {
        menuLangBtn.onclick = () => {
            currentLang = currentLang === 'RU' ? 'EN' : 'RU';
            updateUITexts();
            updateTurnIndicator(latestState);
        };
    }

    if (restartBtn) {
        restartBtn.onclick = () => {
            adManager.showFullscreenAd(() => {
                gameStore.start();
            });
        };
    }

    if (menuBtn) {
        menuBtn.onclick = () => {
            showScreen('menu');
        };
    }

    if (undoBtn) {
        undoBtn.onclick = () => {
            adManager.showRewardedVideo(() => {
                gameStore.undo();
            });
        };
    }

    gameStore.subscribe((state) => {
        latestState = state;
        const isAttacker = state.turn === PIECE.ATTACKER;
        updateTurnIndicator(state);

        if (state.status === 'PLAYING' && isAttacker) {
            setTimeout(() => {
                const move = ai.findBestMove(state.board);
                if (move) {
                    gameStore.move(move.fromR, move.fromC, move.toR, move.toC);
                }
            }, 500);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function showScreen(screenName) {
    const toggle = (el, active) => {
        if (!el) return;
        el.classList.toggle('hidden', !active);
        el.classList.toggle('active', active);
        el.style.display = active ? 'flex' : 'none';
    };

    toggle(menuScreen, screenName === 'menu');
    toggle(gameScreen, screenName === 'game');
    toggle(rulesScreen, screenName === 'rules');
}

function updateUITexts() {
    const locale = LOCALIZATION[currentLang];
    adCloseBtn = document.getElementById('close-ad-btn') || adCloseBtn;

    document.title = locale.meta.title;
    document.documentElement.lang = locale.meta.langCode;
    if (gameTitle) gameTitle.textContent = locale.menu.title;

    if (startBtn) startBtn.textContent = locale.menu.start;
    if (rulesBtn) rulesBtn.textContent = locale.menu.rules;
    if (menuLangBtn) menuLangBtn.textContent = locale.menu.language;

    if (rulesTitle) rulesTitle.textContent = locale.rules.title;
    if (rulesText) rulesText.innerHTML = locale.rules.content;
    if (rulesBackBtn) rulesBackBtn.textContent = locale.rules.back;

    if (restartBtn) restartBtn.textContent = locale.game.restart;
    if (menuBtn) menuBtn.textContent = locale.game.menu;
    if (undoBtn) undoBtn.textContent = locale.game.undo;

    if (adTitle) adTitle.textContent = locale.ads.title;
    if (adBody) adBody.textContent = locale.ads.body;
    if (adCloseBtn) adCloseBtn.textContent = locale.ads.close;

    updateTurnIndicator(latestState || { status: 'IDLE', turn: PIECE.ATTACKER });
}

function updateTurnIndicator(state) {
    if (!turnIndicator) return;
    const text = LOCALIZATION[currentLang].game;

    if (!state || state.status === 'IDLE') {
        turnIndicator.textContent = text.turnAttacker;
        turnIndicator.style.color = '#ff5555';
        return;
    }

    if (state.status === 'ENDED') {
        const defenderWin = state.winner === 'DEFENDER_WIN';
        turnIndicator.textContent = defenderWin ? text.defenderWin : text.attackerWin;
        turnIndicator.style.color = defenderWin ? '#ffd700' : '#ff0000';
        return;
    }

    const isAttacker = state.turn === PIECE.ATTACKER;
    turnIndicator.textContent = isAttacker ? text.turnAttacker : text.turnDefender;
    turnIndicator.style.color = isAttacker ? '#ff5555' : '#ffd700';
}
