const LOCALIZATION = {
    RU: {
        meta: {
            title: 'Тавлеи',
            langLabel: 'Язык: Русский',
            langCode: 'ru'
        },
        menu: {
            title: 'Тавлеи',
            start: 'Начать игру',
            rules: 'Правила',
            language: 'Язык: Русский'
        },
        game: {
            turnAttacker: 'Ход чёрных',
            turnDefender: 'Ход белых',
            attackerWin: 'Победа чёрных!',
            defenderWin: 'Победа белых!',
            restart: 'Заново',
            menu: 'Меню',
            undo: 'Отменить ход'
        },
        ads: {
            title: 'Реклама',
            body: 'Подождите пару секунд, мы скоро вернём игру.',
            close: 'Закрыть'
        },
        rules: {
            title: 'Правила Тавлеи',
            content: `
            <div class="rule-block">
                <div class="rule-icon">${ICONS.KNYAZ}</div>
                <div class="rule-desc">
                    <h3>Князь (король)</h3>
                    <p>Цель Князя — добраться до любой из четырёх углов доски («убежищ»).</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-icon">${ICONS.DEFENDER}</div>
                <div class="rule-desc">
                    <h3>Защитники (белые)</h3>
                    <p>Сопровождают Князя к углам и побеждают, если он достигает убежища.</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-icon">${ICONS.ATTACKER}</div>
                <div class="rule-desc">
                    <h3>Захватчики (чёрные)</h3>
                    <p>Пытаются захватить Князя, окружив его с четырёх сторон (или с трёх и престолом/краем).</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-desc">
                    <h3>Ходы</h3>
                    <p>Все фигуры ходят как ладья — по прямой на любое число клеток, не перепрыгивая через другие.</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-desc">
                    <h3>Взятия</h3>
                    <p>Фигура снимается, если оказалась зажатой между двумя фигурами соперника.</p>
                </div>
            </div>
        `,
            back: 'Назад'
        }
    },
    EN: {
        meta: {
            title: 'Tavlei',
            langLabel: 'Language: English',
            langCode: 'en'
        },
        menu: {
            title: 'Tavlei',
            start: 'Play',
            rules: 'Rules',
            language: 'Language: English'
        },
        game: {
            turnAttacker: 'Black to move',
            turnDefender: 'White to move',
            attackerWin: 'Black win!',
            defenderWin: 'White win!',
            restart: 'Restart',
            menu: 'Menu',
            undo: 'Undo'
        },
        ads: {
            title: 'Advertisement',
            body: 'Give us a couple of seconds and we will be back.',
            close: 'Close'
        },
        rules: {
            title: 'Tavlei Rules',
            content: `
            <div class="rule-block">
                <div class="rule-icon">${ICONS.KNYAZ}</div>
                <div class="rule-desc">
                    <h3>Knyaz (King)</h3>
                    <p>The goal of the Knyaz is to reach any of the four corners of the board ("refuges").</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-icon">${ICONS.DEFENDER}</div>
                <div class="rule-desc">
                    <h3>Defenders (White)</h3>
                    <p>Escort the Knyaz to the corners and win when he reaches a refuge.</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-icon">${ICONS.ATTACKER}</div>
                <div class="rule-desc">
                    <h3>Attackers (Black)</h3>
                    <p>Aim to capture the Knyaz by surrounding him on 4 sides (or 3 plus the throne/edge).</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-desc">
                    <h3>Movement</h3>
                    <p>All pieces move like a rook - straight lines any distance without jumping over others.</p>
                </div>
            </div>
            <div class="rule-block">
                <div class="rule-desc">
                    <h3>Capture</h3>
                    <p>An enemy piece is captured if it is sandwiched between two opponent pieces.</p>
                </div>
            </div>
        `,
            back: 'Back'
        }
    }
};

window.LOCALIZATION = LOCALIZATION;
