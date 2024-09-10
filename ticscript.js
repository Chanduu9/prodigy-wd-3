const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
const humanPlayer = 'X';
const aiPlayer = 'O';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = humanPlayer;
    clickedCell.textContent = humanPlayer;
    clickedCell.classList.add('animated');

    checkWinner();
    if (gameActive) {
        setTimeout(aiMove, 500);
    }
};

const checkWinner = () => {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            highlightWinningCells(winCondition);
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = `Game Tied!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
};

const highlightWinningCells = (winningCells) => {
    winningCells.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning');
    });
};

const aiMove = () => {
    const bestMove = minimax(gameState, aiPlayer).index;
    gameState[bestMove] = aiPlayer;
    const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
    cell.textContent = aiPlayer;
    cell.classList.add('animated');
    checkWinner();
};

const minimax = (newGameState, player) => {
    const availableSpots = newGameState.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    if (checkWin(newGameState, humanPlayer)) {
        return { score: -10 };
    } else if (checkWin(newGameState, aiPlayer)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    availableSpots.forEach(spot => {
        const move = {};
        move.index = spot;
        newGameState[spot] = player;

        if (player === aiPlayer) {
            const result = minimax(newGameState, humanPlayer);
            move.score = result.score;
        } else {
            const result = minimax(newGameState, aiPlayer);
            move.score = result.score;
        }

        newGameState[spot] = '';
        moves.push(move);
    });

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        moves.forEach((move, i) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((move, i) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
};

const checkWin = (board, player) => {
    return winningConditions.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
};

const restartGame = () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Player X's turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('animated', 'winning');
    });
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
