import React, { useState, useEffect } from "react";
import Square from "./Square";

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [xWinner, setxWinner] = useState(0);
  const [oWinner, setOwinner] = useState(0);

  const calculateWinner = (squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    const historyCopy = [...history];
    const squaresCopy = [...squares];
    if (calculateWinner(squaresCopy) || squaresCopy[i]) {
      return;
    }
    squaresCopy[i] = xIsNext ? "X" : "O";
    setSquares(squaresCopy);
    setXisNext(!xIsNext);
    const newEntry = { index: i, value: squaresCopy[i] };
    const newHistory = historyCopy.concat(newEntry);
    setHistory(newHistory);
  };

  const newGame = () => {
    setSquares(Array(9).fill(null));
    setXisNext(true);
    setHistory([]);
  };

  const handleWinnings = () => {
    if (xIsNext) {
      setxWinner(xWinner + 1);
    }
    setOwinner(oWinner + 1);
  };

  const handleRedoMovement = () => {
    if (!history.length) {
      return;
    }
    const historyCopy = [...history];
    const squaresCopy = [...squares];
    const lastEntry = historyCopy.pop();
    squaresCopy[lastEntry.index] = lastEntry.value;
    setSquares(squaresCopy);
    setXisNext((prevState) => !prevState);
    setHistory(historyCopy);
  };

  const renderRedoButton = () => {
    return (
      <button className="redoButton" onClick={() => handleRedoMovement()}>
        Redo movement
      </button>
    );
  };

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = (
      <>
        Winner: {winner}
        <button className="redoButton" onClick={newGame}>
          New Game
        </button>
      </>
    );
    handleWinnings();
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const historyList = history.map((entry, index) => (
    <li key={index}>
      {`Move ${index + 1}: ${entry.value} in position ${
        (entry.index + 1)
      }x${Math.floor((entry.index + 1) / 3)}`}{" "}
      {renderRedoButton()}
    </li>
  ));

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div className="game-info">
        <div>
          <p>Number of X Wins: {xWinner}</p>
          <p>Number of O Wins: {oWinner}</p>
        </div>
        <ol>{historyList}</ol>
      </div>
    </div>
  );
}

export default Board;
