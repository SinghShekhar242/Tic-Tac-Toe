let board = Array(9).fill("");
let currentPlayer = "X";
let gameMode = "player";
let gameActive = false; // don't allow play until user starts
const boardElement = document.getElementById("board");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const popup = document.getElementById("popup");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

// Start Game with selected mode
function startGame(mode) {
  gameMode = mode;
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  restartGame(); // reset and start fresh
}

// Render the board
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = index;
    div.innerText = cell;
    div.addEventListener("click", handleClick);
    boardElement.appendChild(div);
  });
}

// Handle cell click
function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} Wins!`);
    return;
  }

  if (checkDraw()) {
    endGame("It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

// Evaluate the board state: 1 for win, -1 for loss, 0 for draw
function evaluateBoard(board) {
  if (checkWin("O")) return 1;  // Computer wins
  if (checkWin("X")) return -1; // Player wins
  return 0; // It's a draw
}

// Minimax function to get the best move for the computer (O)
function minimax(board, depth, isMaximizing) {
  const score = evaluateBoard(board);

  // If the game has ended (win or draw)
  if (score !== 0) return score;

  // If it's a draw (no empty spaces left)
  if (board.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    // Maximizing player (computer's turn)
    let best = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O"; // Make the move
        best = Math.max(best, minimax(board, depth + 1, false)); // Recursively evaluate
        board[i] = ""; // Undo the move
      }
    }
    return best;
  } else {
    // Minimizing player (player's turn)
    let best = Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X"; // Make the move
        best = Math.min(best, minimax(board, depth + 1, true)); // Recursively evaluate
        board[i] = ""; // Undo the move
      }
    }
    return best;
  }
}

// Computer's move based on Minimax algorithm
function computerMove() {
  let bestVal = -Infinity;
  let bestMove = -1;

  // Try all possible moves for the computer (O)
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O"; // Make the move
      const moveVal = minimax(board, 0, false); // Call minimax to get the score
      board[i] = ""; // Undo the move

      // If the value of the current move is better than the best value, update best
      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }

  // Make the best move for the computer
  board[bestMove] = "O";
  renderBoard();

  if (checkWin("O")) {
    endGame("O Wins!");
    return;
  }

  if (checkDraw()) {
    endGame("It's a Draw!");
    return;
  }

  currentPlayer = "X"; // After computer's move, it's the player's turn again
}

// Win condition
function checkWin(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function checkDraw() {
  return board.every(cell => cell !== "");
}

// Show popup and button when game ends (Delayed by 2 seconds)
function endGame(message) {
  gameActive = false;
  setTimeout(() => {
    resultText.innerText = message;
    popup.classList.remove("hidden");
    restartBtn.style.display = "inline-block";
  }, 1000);
}

// Restart game
function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  popup.classList.add("hidden");
  restartBtn.style.display = "none";
  renderBoard();
}
