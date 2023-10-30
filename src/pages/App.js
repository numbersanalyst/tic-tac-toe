import React, { useState } from "react";

function Square({ value, onSquareClick, isWin }) {
  return (
    <button
      className={`square ${isWin ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.symbol;
  } else if (currentMove === 9) {
    status = "Tie";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const lines = winner ? winner.lines : null;

  const board = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const isWinningSquare = lines && lines.includes(squareIndex);
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWin={isWinningSquare}
        />,
      );
    }
    board.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>,
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), position: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortDescending, setSortDescending] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, position: index },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description, listElement;

    const { position } = squares;
    const row = Math.floor(position / 3) + 1;
    const col = (position % 3) + 1;

    if (move > 0) {
      description = `Go to move #${move}. Position: (${row},${col})`;
    } else {
      description = "Back to game start.";
    }

    if (move !== currentMove) {
      listElement = <button onClick={() => jumpTo(move)}>{description}</button>;
    } else {
      if (move > 0) {
        description = `You are at move #${move}. Position: (${row},${col})`;
      } else {
        description = "You are on game start.";
      }
      listElement = <p>{description}</p>;
    }

    return <li key={move}>{listElement}</li>;
  });

  const sortedMoves = sortDescending ? moves.slice().reverse() : moves;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <label>
          <input
            onChange={() => setSortDescending(!sortDescending)}
            type="checkbox"
          />
          &nbsp;Sort by descending order
        </label>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { symbol: squares[a], lines: lines[i] };
    }
  }
  return null;
}
