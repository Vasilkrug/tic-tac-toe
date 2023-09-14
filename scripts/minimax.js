import {getWinner} from "./winner.js";

let scores = {'x': 1, 'o': -1, 'draw': 0};

export const minimax = (fields, depth, isMaximizing) => {
    let result = getWinner(fields);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (fields[i][j] === '') {
                    fields[i][j] = 'o';
                    let score = minimax(fields, depth + 1, false);
                    fields[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (fields[i][j] === '') {
                    fields[i][j] = 'x';
                    let score = minimax(fields, depth + 1, true);
                    fields[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
};