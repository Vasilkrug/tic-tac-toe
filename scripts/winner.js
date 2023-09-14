const equals = (a, b, c) => a === b && b === c && a !== '';
export const getWinner = (fields) => {
    let winner = null;

    // горизонтальная проверка
    for (let i = 0; i < 3; i++) {
        if (equals(fields[i][0], fields[i][1], fields[i][2])) {
            winner = fields[i][0];
        }
    }

    // вертикальная
    for (let i = 0; i < 3; i++) {
        if (equals(fields[0][i], fields[1][i], fields[2][i])) {
            winner = fields[0][i];
        }
    }

    // по диагонали
    if (equals(fields[0][0], fields[1][1], fields[2][2])) {
        winner = fields[0][0];
    }

    if (equals(fields[0][2], fields[1][1], fields[2][0])) {
        winner = fields[0][2];
    }
    //проверка на ничью
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (fields[i][j] === '') {
                openSpots++
            }
        }
    }
    if (winner === null && openSpots === 0) {
        return 'draw'
    } else {
        return winner
    }
}