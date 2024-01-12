const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return {
    getSign,
  };
};

const gameboard = (() => {
  let board = [null, null, null, null, null, null, null, null, null];

  const getField = (index) => {
    if (index > board.length) return;

    return board[index];
  };

  const setField = (sign, index) => {
    if (index > board.length) return;

    board[index] = sign;
  };

  const clearBoard = () => {
    board = [null, null, null, null, null, null, null, null, null];
  };

  return {
    getField,
    setField,
    clearBoard,
  };
})();

const gameController = (() => {
  const firstPlayer = Player("O");
  const secondPlayer = Player("X");

  let roundCount = 1;
  let isOver = false;

  const playRound = (index) => {
    gameboard.setField(getCurrentPlayerSign(), index);

    if (checkWinner(index)) {
      displayController.setMessage(
        `Player ` + getCurrentPlayerSign() + " won!"
      );
      isOver = true;
      return;
    }

    if (roundCount === 9) {
      displayController.setMessage("Draw!");
      isOver = true;
      return;
    }

    roundCount++;
    console.log("round count: " + roundCount);
    displayController.setMessage(`Player ${getCurrentPlayerSign()}'s turn`);
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameboard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getCurrentPlayerSign = () => {
    return roundCount % 2 === 1
      ? firstPlayer.getSign()
      : secondPlayer.getSign();
  };

  const getIsOver = () => {
    return isOver;
  };

  const resetGame = () => {
    roundCount = 1;
    isOver = false;
  };

  return {
    playRound,
    getIsOver,
    resetGame,
  };
})();

const displayController = (() => {
  const blocks = document.querySelectorAll(".board-block");
  const resetBtn = document.getElementById("reset-btn");
  const message = document.getElementById("message-box");

  blocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateBoard();
    });
  });

  resetBtn.addEventListener("click", () => {
    gameController.resetGame();
    gameboard.clearBoard();
    updateBoard();
    setMessage("Player O's turn");
  });

  const updateBoard = () => {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].textContent = gameboard.getField(i);
      if (gameboard.getField(i) === "O") {
        blocks[i].style.color = "red";
      } else {
        blocks[i].style.color = "blue";
      }
    }
  };

  const setMessage = (msg) => {
    message.textContent = msg;
  };

  return {
    setMessage,
  };
})();
