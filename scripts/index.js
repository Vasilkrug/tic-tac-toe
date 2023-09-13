const gameTitle = document.querySelector('.game-title');
const gameBtnsWrapper = document.querySelector('.game-buttons');
const gameBtns = document.querySelectorAll('.game-btn');
const returnBtn = document.querySelector('.back-btn');
const gameBlock = document.querySelector('.game');
const cells = document.querySelectorAll('[data-index]');
const playAgainBtn = document.querySelector('.play-again-btn');
const result = document.querySelector('.result');
const resultText = document.querySelector('.result-text');
const xCont = document.querySelector('.count-x');
const oCont = document.querySelector('.count-o');

let fields = [['', '', ''], ['', '', ''], ['', '', '']];
let player = 'x';
const playersImages = {'x': 'assets/x.png', 'o': 'assets/zero.png'};
let isGameStarted = false;
const scores = {'x': 0, 'o': 0};


const clearArray = () => {
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields.length; j++) {
            fields[i][j] = '';
        }
    }
};

const hideBlocks = () => {
    gameTitle.style.display = 'none';
    gameBtnsWrapper.style.display = 'none';
    returnBtn.style.display = 'block';
    gameBlock.style.display = 'flex';
    result.style.visibility = 'hidden';
};

const showBlocks = () => {
    gameTitle.style.display = 'block';
    gameBtnsWrapper.style.display = 'flex';
    returnBtn.style.display = 'none';
    gameBlock.style.display = 'none';
};

const showResults = (text) => {
    result.style.visibility = 'visible';
    resultText.innerHTML = text;

}

gameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideBlocks();
        isGameStarted = true;
    })
});

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const row = cell.parentNode.dataset.row;
        const cellIdx = cell.dataset.index;
        if (fields[row][cellIdx] !== '' || !isGameStarted) {
            return;
        }

        if (fields[row][cellIdx] === '') {
            fields[row][cellIdx] = player;
            cell.innerHTML = `<img src=${playersImages[player]} alt='player'>`;
        }

        if (player === 'x') {
            player = 'o';
        } else {
            player = 'x';
        }
        let winner = getWinner();
        checkWinnerRender(winner);
        saveToLocalStorage();
        winner = null;
    })
})

returnBtn.addEventListener('click', () => {
    showBlocks()
    isGameStarted = false;
    clearArray();
    cells.forEach(cell => cell.innerHTML = '');
    localStorage.clear()
});

playAgainBtn.addEventListener('click', () => {
    clearArray();
    cells.forEach(cell => cell.innerHTML = '');
    player = 'x';
    isGameStarted = true;
    result.style.visibility = 'hidden';
});

function getWinner() {
    let winner = null;

    // горизонтальная проверка
    for (let i = 0; i < 3; i++) {
        if (fields[i][0] === fields[i][1] && fields[i][0] === fields[i][2]) {
            winner = fields[i][0];
        }
    }

    // вертикальная
    for (let i = 0; i < 3; i++) {
        if (fields[0][i] === fields[1][i] && fields[0][i] === fields[2][i]) {
            winner = fields[0][i];
        }
    }

    // по диагонали
    if (fields[0][0] === fields[1][1] && fields[0][0] === fields[2][2]) {
        winner = fields[0][0];
    }

    if (fields[0][2] === fields[1][1] && fields[0][2] === fields[2][0]) {
        winner = fields[0][2];
    }
    //проверка на ничью
    let count = 0;
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields.length; j++) {
            if (fields[i][j] === '') {
                count++
            }
        }
    }
    if (!winner && count === 0) {
        winner = 'draw';
    }

    return winner;
}

const checkWinnerRender = (winner) => {

    if (winner) {
        switch (winner) {
            case 'draw':
                showResults('Ничья');
                isGameStarted = false;
                break;
            default:
                document.querySelector(`.count-${winner}`).innerHTML++;
                let resHtml = `Игрок <img src=${playersImages[winner]} alt="winner"/> победил!`
                showResults(resHtml);
                isGameStarted = false;
                scores[winner] += 1;
                break;
        }
    }
}

const saveToLocalStorage = () => {
    localStorage.setItem("fields", JSON.stringify(fields));
    localStorage.setItem("player", player);
    localStorage.setItem('xScore', scores.x);
    localStorage.setItem('oScore', scores.o);
    localStorage.setItem('isStarted', isGameStarted)
};

const getFromLocalStorage = () => {
    if (localStorage.getItem('fields')) {
        const fieldsStore = JSON.parse(localStorage.getItem('fields'));
        let xScoreStorage = localStorage.getItem('xScore');
        let oScoreStorage = localStorage.getItem('oScore');
        let isStarted = localStorage.getItem('isStarted');
        player = localStorage.getItem('player');
        scores.x = xScoreStorage;
        scores.o = oScoreStorage;
        fields = fieldsStore;
        xCont.innerHTML = scores.x;
        oCont.innerHTML = scores.o;
        isGameStarted = isStarted;

        for (let i = 0; i < fieldsStore.length; i++) {
            const row = document.querySelector(`[data-row="${i}"]`);
            for (let j = 0; j < fieldsStore.length; j++) {
                const cell = row.children[j];
                if (fields[i][j] !== '') {
                    cell.innerHTML = `<img src=${playersImages[fields[i][j]]} alt="player">`;
                }
            }
        }

        if (isGameStarted) {
            hideBlocks();
        }
    }
};
getFromLocalStorage()