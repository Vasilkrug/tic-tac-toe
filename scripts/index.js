import {getWinner} from "./winner.js";
import {minimax} from "./minimax.js";

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
const levels = document.querySelector('.levels');
const levelsBtns = document.querySelectorAll('.level-btn');

let fields = [['', '', ''], ['', '', ''], ['', '', '']];
let player = 'x';
let ai = 'o';
const playersImages = {'x': 'assets/x.png', 'o': 'assets/zero.png'};
let isGameStarted = false;
const scores = {'x': 0, 'o': 0};
let gameLevel = 'easy';


const clearArray = (fields) => {
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields.length; j++) {
            fields[i][j] = '';
        }
    }
};

const renderCell = (i, j, player) => {
    const row = document.querySelector(`[data-row="${i}"]`);
    const cell = row.children[j];
    cell.innerHTML = `<img src=${playersImages[player]} alt="player">`;
};

const hideBlocks = () => {
    gameTitle.style.display = 'none';
    gameBtnsWrapper.style.display = 'none';
    returnBtn.style.display = 'block';
    gameBlock.style.display = 'flex';
    result.style.visibility = 'hidden';
    levels.style.display = 'none';
};

const showBlocks = () => {
    gameTitle.style.display = 'block';
    gameBtnsWrapper.style.display = 'flex';
    returnBtn.style.display = 'none';
    gameBlock.style.display = 'none';
    levels.style.display = 'flex';
};

const showResults = (text) => {
    result.style.visibility = 'visible';
    resultText.innerHTML = text;
};

const gameWithFriend = () => {
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const row = cell.parentNode.dataset.row;
            const cellIdx = cell.dataset.index;
            if (fields[row][cellIdx] !== '' || !isGameStarted) {
                return;
            }

            if (fields[row][cellIdx] === '') {
                fields[row][cellIdx] = player;
                renderCell(row, cellIdx, player);
            }

            if (player === 'x') {
                player = 'o';
            } else {
                player = 'x';
            }
            let winner = getWinner(fields);
            checkWinnerRender(winner);
            saveToLocalStorage();
            winner = null;
        })
    });
};

const gameWithComputer = () => {
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const row = cell.parentNode.dataset.row;
            const cellIdx = cell.dataset.index;
            if (fields[row][cellIdx] !== '' || !isGameStarted) {
                return;
            }
            if (fields[row][cellIdx] === '') {
                fields[row][cellIdx] = player;
                renderCell(row, cellIdx, player)
                if (gameLevel === 'easy') {
                    easyStepComp();
                } else {
                        hardStepComp();

                }
                let winner = getWinner(fields);
                checkWinnerRender(winner);
            }

        })
    });
};

const easyStepComp = () => {
    const indexesArray = [];
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields.length; j++) {
            if (fields[i][j] === '') {
                indexesArray.push([i, j]);
            }
        }
    }
    if (indexesArray.length) {
        const randomNum = Math.floor(Math.random() * indexesArray.length);
        const [i, j] = indexesArray[randomNum];
        renderCell(i, j, ai);
        fields[i][j] = ai;
    }
};

const hardStepComp = () => {
    let bestScore = Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (fields[i][j] === '') {
                fields[i][j] = ai;
                let score = minimax(fields, 0, false);
                fields[i][j] = '';
                if (score < bestScore) {
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    if (move === undefined) {
        showResults('Ничья!');
    } else {
        renderCell(move.i, move.j, ai);
        fields[move.i][move.j] = ai;
    }

};


gameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideBlocks();
        isGameStarted = true;
        const opponent = btn.dataset.game;
        if (opponent === 'friends') {
            gameWithFriend();
        } else {
            gameWithComputer();
        }
    })
});

returnBtn.addEventListener('click', () => {
    showBlocks();
    isGameStarted = false;
    player = 'x';
    clearArray(fields);
    cells.forEach(cell => cell.innerHTML = '');
    localStorage.clear();
    window.location.reload();
});

playAgainBtn.addEventListener('click', () => {
    clearArray(fields);
    cells.forEach(cell => cell.innerHTML = '');
    player = 'x';
    isGameStarted = true;
    result.style.visibility = 'hidden';
});

levelsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active');
        btn.classList.add('active');
        gameLevel = btn.dataset.level;
    })
});

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
};

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
            for (let j = 0; j < fieldsStore.length; j++) {
                if (fields[i][j] !== '') {
                    renderCell(i, j, fields[i][j])
                    gameWithFriend()
                }
            }
        }
//сохраняем текущее положение элементов на странице
        if (isGameStarted) {
            hideBlocks();
        }
    }
};

getFromLocalStorage()