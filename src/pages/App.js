import React, { useState } from "react";

function Square({ value, onSquareClick, isWin }) {
  return (
    <button
      className={`mr-4 mt-4 flex items-center justify-center w-16 h-16 p-6 rounded-md text-5xl font-semibold  shadow-lg shadow-slate-800 ${isWin ? "text-slate-100 bg-blue-600 motion-safe:animate-pulse" : "bg-slate-200 text-slate-900"
        }`}
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
      <div key={row} className="grid grid-cols-3">
        {rowSquares}
      </div>,
    );
  }

  return (
    <>
      <div className={`font-semibold text-2xl mb-1 ${winner ? "text-blue-500" : ""}`}>{status}</div>
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
      listElement = <button className="w-full px-4 py-2 text-white rounded-lg cursor-pointer bg-slate-700" onClick={() => jumpTo(move)}>{description}</button>;
    } else {
      if (move > 0) {
        description = `You are at move #${move}. Position: (${row},${col})`;
      } else {
        description = "You are on game start.";
      }
      listElement = <p className="w-full px-4 py-2 text-white rounded-lg cursor-pointer bg-slate-800 ">{description}</p>;
    }

    return <li key={move}>{listElement}</li>;
  });

  const sortedMoves = sortDescending ? moves.slice().reverse() : moves;

  return (
    <>
      <h1 className="font-bold text-6xl mb-14 ">Tic Tac Toe</h1>
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            currentMove={currentMove}
          />
        </div>
        <div className="md:ml-8 mt-8 md:mt-0 w-[290px] h-[435px]">
          <p className="font-semibold mb-5">Game history</p>
          <div className="border p-4 rounded-xl shadow-sm shadow-slate-800">

            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" onClick={() => { setSortDescending(!sortDescending) }} value="" class="sr-only peer" />
              <div class="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ml-3 text-sm font-medium text-gray-300">Sort by descending order</span>
            </label>

            <div className="text-sm font-medium border rounded-lg bg-gray-700 border-gray-600 text-white mt-2">
              <ol>{sortedMoves}</ol>
            </div>
          </div>
        </div>
      </div >
    </>
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
