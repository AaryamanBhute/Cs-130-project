// Chessboard.js
import React, { useState } from 'react';
import { useChessGameState } from './ChessGameState';
import { isValidMove } from './ValidateMove';

const Chessboard = () => {
  const { gameState, setGameState, movePiece, resetGame } = useChessGameState();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const squareSize = 80;

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      // If a square is already selected, try to move the piece
      const valid = isValidMove(gameState.board, selectedSquare, row, col);
      if (valid) {
        movePiece(selectedSquare, row, col);
        setSelectedSquare(null); // Reset the selected square after moving
      } else {
        // Handle invalid move (optional)
      }
    } else {
      // If no square is selected, set the clicked square as the selected square
      const piece = gameState.board[row][col];
      console.log(piece)
      if (piece) {
        setSelectedSquare({ row, col });
      }
    }
  };

  // Your existing code for rendering a single square
  const renderSquare = (row, col, piece) => {
    // Calculate background color based on row and column
    const backgroundColor = (row + col) % 2 === 0 ? '#e8caa2' : '#523106';

    // Set the background color inline
    const squareStyle = {
      backgroundColor,
      width: `${squareSize}px`, // Set the width and height as needed
      height: `${squareSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer', // Add a cursor style to indicate clickable
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', 
    };

    const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;

    return (
      <div key={`${row}-${col}`}
        style={{ ...squareStyle, border: isSelected ? '2px solid red' : 'none' }}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && (
          <img
            src={require(`../assets/${piece}.png`)} // Update the path based on your asset structure
            alt={piece}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
    );
  };

  // Calculate the total width of the chessboard
  const boardWidth = gameState.board[0].length * squareSize;

  return (
    <div className="chessboard-container" style={{ width: `${boardWidth}px`, margin: 'auto' }}>
      {/* Render each row */}
      {gameState.board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {/* Render squares for each row */}
          {row.map((piece, colIndex) => renderSquare(rowIndex, colIndex, piece))}
        </div>
      ))}

      {/* Example: Reset button */}
      <button onClick={resetGame}>Reset Chess Game</button>
    </div>
  );
};

export default Chessboard;