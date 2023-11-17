// Chessboard.js
import { useState, useEffect } from 'react';
import { useChessGameState, gameLength } from './ChessGameState';
import { getValidMoves } from './PieceMovement';

const Chessboard = () => {
  const { gameState, updateGameState, resetGame, message, seconds } = useChessGameState();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  const squareSize = 80;

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      // If selected square is clicked again, deselect it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setValidMoves([]);
        setSelectedSquare(null);
        return;
      }
      // If a square is already selected, try to move the piece
      const move = validMoves.find(move => move.startRow === selectedSquare.row && move.startCol === selectedSquare.col && 
                                           move.endRow === row && move.endCol === col);
      if (!move) {
        return;
      }
      // Update the game state based on the move
      updateGameState(gameState, move);
      setValidMoves([]);
      setSelectedSquare(null);
    }
    else {
      // If no square is selected, set the clicked square as the selected square
      const piece = gameState.board[row][col];
      if (piece && piece[0] === gameState.currentPlayer) { // Check if the piece exists and is the correct color
        setSelectedSquare({ row, col });
        setValidMoves(getValidMoves(gameState, gameState.currentPlayer));
      }
    }
  };

  // Your existing code for rendering a single square
  const renderSquare = (row, col, piece) => {
    // Check if the square is a valid move
    const isHighlighted = validMoves.some(move => selectedSquare.row === move.startRow && selectedSquare.col === move.startCol
                                                  && move.endRow === row && move.endCol === col);
    const partOfLastMove = gameState.lastMove && ((gameState.lastMove.startRow === row && gameState.lastMove.startCol === col)
                                                  || (gameState.lastMove.endRow === row && gameState.lastMove.endCol === col));
    // Calculate background color based on row and column and highlight the square if it's a valid move
    const backgroundColor = isHighlighted ? '#83dbee' : partOfLastMove ? '#e8f078' : (row + col) % 2 === 0 ? '#e8caa2' : '#523106';

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

  const CapturedPieces = ({ player, pieces }) => {
    return (
      <div style={{ backgroundColor: '#eeeeee', padding: '0px 10px 0px 10px', border: '2px solid black' }}>
        <h2>{player}'s Captured Pieces:</h2>
        <ul>
          {pieces.map((piece) => (
              <img
                src={require(`../assets/${piece}.png`)} // Update the path based on your asset structure
                alt={piece}
                style={{ width: `${squareSize/2}px`, height: `${squareSize/2}px` }}
              />
          ))}
        </ul>
      </div>
    );
  }

  const Timer = ({ player }) => {
    const whiteSeconds = (gameLength - seconds.white) % 60;
    const whiteTime = `${Math.floor((gameLength - seconds.white) / 60)}:${whiteSeconds < 10 ? '0' + whiteSeconds : whiteSeconds}`;
    const blackSeconds = (gameLength - seconds.black) % 60;
    const blackTime = `${Math.floor((gameLength - seconds.black) / 60)}:${blackSeconds < 10 ? '0' + blackSeconds : blackSeconds}`;
    return (
      <div style={{ backgroundColor: '#eeeeee', padding: '0px 10px 0px 10px', border: '2px solid black' }}>
        <h2>{player}'s Time Remaining:</h2>
        <h2>{player === 'White' ? whiteTime : blackTime}</h2>
      </div>
    );
  };

  const handleResetClick = () => {
    setSelectedSquare(null);
    setValidMoves([]);
    resetGame();
  };

  useEffect(() => {
    if (gameState.gameOver) {
      setValidMoves([]);
      setSelectedSquare(null);
      return;
    }
  }, [gameState.gameOver]);

  return (    
  <div style={{ backgroundColor: '#6495ED', height: '100vh' }}>
    <h1 style={{ marginTop: '0px', paddingTop: '40px', font: 'bold 50px Arial', textAlign: 'center', color: '#eeeeee' }}>Chess</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: `${squareSize*2}px` }}>
        <CapturedPieces player={!gameState.whiteOnBottom ? 'White' : 'Black'} pieces={gameState.whiteCapturedPieces} />
        <h1 style={{ font: 'bold 25px Arial', textAlign: 'center', color: '#eeeeee' }}>{message}</h1>
        <CapturedPieces player={gameState.whiteOnBottom ? 'White' : 'Black'} pieces={gameState.blackCapturedPieces} />
      </div>
      <div className="chessboard-container" style={{ border: '10px solid black', margin: '20px' }}>
        {/* Render each row */}
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {/* Render squares for each row */}
            {row.map((piece, colIndex) => renderSquare(rowIndex, colIndex, piece))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: `${squareSize*5}px` }}>
        <Timer player={!gameState.whiteOnBottom ? 'White' : 'Black'} />
        <Timer player={gameState.whiteOnBottom ? 'White' : 'Black'} />
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', margin: '20px' }}>
      <button style={{ border: '1px solid black', height: '50px', font: 'bold 30px Arial' }} 
              onClick={handleResetClick}>Restart Game</button>
      <button style={{ border: '1px solid black', height: '50px', font: 'bold 30px Arial' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'black' }}>Back to Home</a>
      </button>
    </div>
  </div>
  );
};

export default Chessboard;