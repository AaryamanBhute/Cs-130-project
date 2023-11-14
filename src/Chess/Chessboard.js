// Chessboard.js
import React, { useState } from 'react';
import { useChessGameState } from './ChessGameState';
import { validateMove } from './ValidateMove';

const Chessboard = () => {
  const { gameState, setGameState, movePiece, castle, enPassant, resetGame } = useChessGameState();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const squareSize = 80;

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      // If selected square is clicked again, deselect it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }
      // If a square is already selected, try to move the piece
      const move = validateMove(gameState, selectedSquare.row, selectedSquare.col, row, col);
      console.log(move)
      const piece = gameState.board[selectedSquare.row][selectedSquare.col];
      if (!move.valid) {
        return;
      }
      if (move.castle.length > 0) {
        castle(move.castle[0], move.castle[1], move.castle[2], move.castle[3], move.castle[4],
               piece, selectedSquare.row, selectedSquare.col, row, col, move.specialRequirements);
      }
      else {
        movePiece(piece, selectedSquare.row, selectedSquare.col, row, col, move.specialRequirements);
      }
      setSelectedSquare(null); // Reset the selected square after moving
    } else {
      // If no square is selected, set the clicked square as the selected square
      if (gameState.board[row][col]) {
        setSelectedSquare({row, col});
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
        style={{ ...squareStyle,
          width: isSelected ? `${squareSize-4}px` : `${squareSize}px`,
          height: isSelected ? `${squareSize-4}px` : `${squareSize}px`,
          border: isSelected ? '2px solid red' : 'none' }}
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
  <div style={{backgroundColor: '#123456', height: '100vh' }}>
    <h1 style={{ marginTop: '0px', textAlign: 'center', color: '#eeeeee' }}>Chess</h1>
    <p style={{ marginBottom: '20px', margin: 'auto', height: '15px', width: '100px', font: 'bold 11px Arial', textDecoration: 'none', backgroundColor: '#eeeeee', color: '#333333', padding: '2px 6px 2px 6px', borderTop: '1px solid #CCCCCC', borderRight: '1px solid #333333', borderBottom: '1px solid #333333', borderLeft: '1px solid #CCCCCC', textAlign: 'center', color: '#eeeeee' }}>
      <a href="/">Back to Home</a>
    </p>
    <div className="chessboard-container" style={{ width: `${boardWidth}px`, margin: 'auto' }}>
      {/* Render each row */}
      {gameState.board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {/* Render squares for each row */}
          {row.map((piece, colIndex) => renderSquare(rowIndex, colIndex, piece))}
        </div>
      ))}

      {/* Example: Reset button */}
      <button style={{ marginTop: '20px', height: '40px' }}onClick={resetGame}>Reset Chess Game</button>
    </div>
  </div>
  );
};

export default Chessboard;