// Chessboard.js
import React, { useState } from 'react';
import { useChessGameState } from './ChessGameState';
import { validateMove } from './ValidateMove';

const Chessboard = () => {
  const { gameState, movePiece, castle, enPassant, resetGame } = useChessGameState();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('w');
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
      const piece = gameState.board[selectedSquare.row][selectedSquare.col];
      if (!move.valid) {
        return;
      }
      console.log(move);
      if (move.castle.length > 0) {
        castle(move.castle[0], move.castle[1], move.castle[2], move.castle[3], move.castle[4],
               piece, selectedSquare.row, selectedSquare.col, row, col, move.specialRequirements);
      }
      else if (move.enPassant.length > 0) {
        console.log("enPassant");
        enPassant(piece, selectedSquare.row, selectedSquare.col, row, col, move.specialRequirements);
      }
      else {
        movePiece(piece, selectedSquare.row, selectedSquare.col, row, col, move.specialRequirements);
      }
      setSelectedSquare(null); // Reset the selected square after moving
      // After a valid move, switch the current player
      setCurrentPlayer(currentPlayer === 'w' ? 'b' : 'w');
    } else {
      // If no square is selected, set the clicked square as the selected square
      const piece = gameState.board[row][col];
      if (piece && piece[0] === currentPlayer) { // Check if the piece exists and is the correct color
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
      cursor: 'pointer',
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
            style={{ width: `${squareSize}px`, height: `${squareSize}px` }}
          />
        )}
      </div>
    );
  };

  const handleResetClick = () => {
    resetGame();
    setSelectedSquare(null);
  };

  // Calculate the total width of the chessboard
  const boardWidth = gameState.board[0].length * squareSize;

  return (    
  <div style={{backgroundColor: '#6495ED', height: '100vh' }}>
    <h1 style={{ marginTop: '0px', textAlign: 'center', color: '#eeeeee' }}>Chess</h1>
    <p style={{ marginBottom: '20px', margin: 'auto', height: '15px', width: '100px', font: 'bold 11px Arial', textDecoration: 'none', backgroundColor: '#eeeeee', padding: '2px 6px 2px 6px', borderTop: '1px solid #CCCCCC', borderRight: '1px solid #333333', borderBottom: '1px solid #333333', borderLeft: '1px solid #CCCCCC', textAlign: 'center', color: '#eeeeee' }}>
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
      <button style={{ marginTop: '20px', height: '40px' }}onClick={handleResetClick}>Reset Chess Game</button>
    </div>
  </div>
  );
};

export default Chessboard;