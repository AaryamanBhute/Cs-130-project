// Chessboard.js

/**
 * Chessboard component.
 * @module Chess/Chessboard
 */

// Import necessary hooks and utilities
import React, { useState, useEffect } from 'react';
import { useChessGameState } from './ChessGameState';
import { getValidMoves } from './PieceMovement';
import ChatBot from '../ChatBot'; // Import ChatBot component
import Modal from 'react-modal'; // Import Modal component for displaying modals
const axios = require('axios'); // Used for making HTTP requests

/**
 * Chessboard component.
 * @function Chessboard
 * @returns {JSX.Element} Rendered component.
 */
const Chessboard = () => {
  /**
   * Use the useChessGameState hook to get the game state and related functions.
   * @type {Object}
   */
  const { gameState, updateGameState, resetGame, message, seconds, timeLimit, gameOver } = useChessGameState();

  /**
   * State variable for the selected square.
   * @type {Object}
   */
  const [selectedSquare, setSelectedSquare] = useState(null);

  /**
   * State variable for the valid moves.
   * @type {Array}
   */
  const [validMoves, setValidMoves] = useState([]);

  /**
   * Constant for the size of each square.
   * @type {number}
   */
  const squareSize = 80;

  /**
   * Handle when a square is clicked.
   * @function handleSquareClick
   * @param {number} row - The row of the clicked square.
   * @param {number} col - The column of the clicked square.
   */
  const handleSquareClick = (row, col) => {
    // If the game is over, do nothing
    if (gameOver) {
      return;
    }
    // If a square is already selected
    if (selectedSquare) {
      // If the selected square is clicked again, deselect it and clear the valid moves
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setValidMoves([]);
        setSelectedSquare(null);
        return;
      }
      /**
       * If a different square is clicked, find a valid move that starts at the selected square and ends at the clicked square.
       * @type {Object}
       */
      const move = validMoves.find(move => move.startRow === selectedSquare.row && move.startCol === selectedSquare.col && 
                                           move.endRow === row && move.endCol === col);
      // If no such move is found, do nothing
      if (!move) {
        return;
      }
      // If such a move is found, update the game state with this move, clear the valid moves, and deselect the square
      updateGameState(gameState, move);
      setValidMoves([]);
      setSelectedSquare(null);
    }
    else {
      // If no square is selected and the clicked square contains a piece of the current player, select this square and calculate the valid moves
      /**
       * The piece on the clicked square.
       * @type {string}
       */
      const piece = gameState.board[row][col];
      // Check if the piece exists and is the correct color
      if (piece && piece[0] === gameState.currentPlayer) {
        setSelectedSquare({ row, col });
        setValidMoves(getValidMoves(gameState, gameState.currentPlayer));
      }
    }
  };

  /**
   * Render a single square.
   * @function renderSquare
   * @param {number} row - The row of the square.
   * @param {number} col - The column of the square.
   * @param {string} piece - The piece on the square.
   * @returns {JSX.Element} The rendered square.
   */
  const renderSquare = (row, col, piece) => {
    /**
     * Check if the square is a valid move.
     * @type {boolean}
     */
    const isHighlighted = validMoves.some(move => selectedSquare.row === move.startRow && selectedSquare.col === move.startCol
                                                  && move.endRow === row && move.endCol === col);
    /**
     * Check if the square is part of the last move.
     * @type {boolean}
     */
    const partOfLastMove = gameState.lastMove && ((gameState.lastMove.startRow === row && gameState.lastMove.startCol === col)
                                                  || (gameState.lastMove.endRow === row && gameState.lastMove.endCol === col));
    /**
     * Calculate background color based on row and column and highlight the square if it's a valid move.
     * @type {string}
     */
    const backgroundColor = isHighlighted ? '#83dbee' : partOfLastMove ? '#e8f078' : (row + col) % 2 === 0 ? '#e8caa2' : '#523106';

    /**
     * Set the background color inline.
     * @type {Object}
     */
    const squareStyle = {
      backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    };

    /**
     * Check if the square is selected.
     * @type {boolean}
     */
    const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;

    /**
     * Render a square with a piece if it exists.
     * @returns {JSX.Element} The rendered square.
     */
    return (
      <div key={`${row}-${col}`}
        role='square'
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
  /**
   * Component to display captured pieces.
   * @function CapturedPieces
   * @param {Object} props - The props of the component.
   * @param {string} props.player - The player who captured the pieces.
   * @param {Array} props.pieces - The captured pieces.
   * @returns {JSX.Element} The rendered component.
   */
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
  /**
   * Component to display the timer.
   * @function Timer
   * @param {Object} props - The props of the component.
   * @param {string} props.player - The player whose time is being displayed.
   * @returns {JSX.Element} The rendered component.
   */
  const Timer = ({ player }) => {
    const whiteSeconds = (timeLimit - seconds.white) % 60;
    const whiteTime = timeLimit ? `${Math.floor((timeLimit - seconds.white) / 60)}:${whiteSeconds < 10 ? '0' + whiteSeconds : whiteSeconds}` : 'N/A';
    const blackSeconds = (timeLimit - seconds.black) % 60;
    const blackTime = timeLimit ? `${Math.floor((timeLimit - seconds.black) / 60)}:${blackSeconds < 10 ? '0' + blackSeconds : blackSeconds}` : 'N/A';
    return (
      <div style={{ backgroundColor: '#eeeeee', padding: '0px 10px 0px 10px', border: '2px solid black' }}>
        <h2>{player}'s Time Remaining:</h2>
        <h2>{player === 'White' ? whiteTime : blackTime}</h2>
      </div>
    );
  };

  /**
   * State variable for modal visibility.
   * @type {boolean}
   */
  const [modalIsOpen, setModalIsOpen] = useState(true);

  /**
   * Handle click event for new game.
   * @function handleNewGameClick
   */
  const handleNewGameClick = () => {
    setModalIsOpen(true);
  };
  
  /**
   * Handle game type selection event.
   * @function handleGameTypeSelect
   * @param {Event} event - The event object.
   */
  const handleGameTypeSelect = (event) => {
    event.preventDefault();
    const form = event.target;
    const type = form.elements.gameType.value;
    const time = form.elements.timeLimit.value;
    const color = form.elements.playerColor.value;
  
    setModalIsOpen(false);
    stopTimer(intervalId);
    setSelectedSquare(null);
    setValidMoves([]);
    // Reset the game with the selected game type
    resetGame(type, time, color);
  };

  /**
   * State variable for user.
   * @type {Object}
   */
  const [user, setUser] = useState();

  /**
   * State variable for error message.
   * @type {string}
   */
  const [errorMessage, setError] = useState('');

  /**
   * State variable for start time.
   * @type {Date}
   */
  const [startTime, setStartTime] = useState(null);

  /**
   * State variable for timer.
   * @type {number}
   */
  const [timer, setTimer] = useState(0);

  /**
   * State variable for interval ID.
   * @type {number}
   */
  const [intervalId, setIntervalId] = useState(null);

  /**
   * Start the timer.
   * @function startTimer
   */
  const startTimer = () => {
    setStartTime(Date.now());
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    return intervalId;
  };

  /**
   * Stop the timer.
   * @function stopTimer
   * @param {number} intervalId - The ID of the interval to clear.
   */
  const stopTimer = (intervalId) => {
    clearInterval(intervalId);
  };

  /**
   * Effect hook to handle side effects.
   * @function useEffect
   */
  useEffect(() => {
    startTimer()
    const loggedInUser = localStorage.getItem('username');
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    if (gameOver) {
      postStatistic()
      setValidMoves([]);
      setSelectedSquare(null);
      return;
    }
  }, [gameOver]);

  /**
   * Function to post game statistics.
   * @async
   * @function postStatistic
   * @param {number} intervalId - The ID of the interval.
   */
  const postStatistic = async (intervalId) => {
    try {
      const game = "chess";
      const timePlayed = Math.floor(timer);
      const response = await axios.post(`http://127.0.0.1:8000/create-statistic/?gameType=${game}`, {
        username: user,
        timePlayed,
        result: message.includes("White wins"),
      });
  
      console.log(response.data);
      stopTimer(intervalId); // Stop the timer after sending the statistic

    } catch (error) {
      setError(error.toString());
      console.error('Error creating statistic for user:', errorMessage);
      stopTimer(intervalId); // Stop the timer in case of an error
    }
  };

  /**
   * Render the chessboard.
   * @returns {JSX.Element} The rendered chessboard.
   */
  return (   
  <div style={{ backgroundColor: '#6495ED', height: '100vh' }}>
    <Modal isOpen={modalIsOpen}>
      <h2 style={{ fontSize: '2em', textAlign: 'center' }}>Chess Game Selection:</h2>
      <form onSubmit={handleGameTypeSelect} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5em', marginBottom: '1em' }}>
          <h3>Game Type</h3>
          <select name="gameType" style={{ fontSize: '1.2em' }}>
            {['Free Play', 'Easy', 'Medium', 'Hard'].map(type =>
              <option value={type}>{type}</option>
            )}
          </select>
        </div>
        <div style={{ fontSize: '1.5em', marginBottom: '1em' }}>
          <h3>Time Limit</h3>
          <select name="timeLimit" style={{ fontSize: '1.2em' }}>
            {['No Time Limit', '10 Minutes', '5 Minutes', '1 Minute'].map(time =>
              <option value={time}>{time}</option>
            )}
          </select>
        </div>
        <div style={{ fontSize: '1.5em', marginBottom: '3em' }}>
          <h3>Player Color</h3>
          <select name="playerColor" style={{ fontSize: '1.2em' }}>
            {['White', 'Black', 'Random'].map(color =>
              <option value={color}>{color}</option>
            )}
          </select>
        </div>
        <button type="submit" style={{ fontSize: '2.5em' }}>Start Game</button>
      </form>
    </Modal>
    <h1 style={{ marginTop: '0px', paddingTop: '40px', font: 'bold 50px Arial', textAlign: 'center', color: '#eeeeee' }}>Chess</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: `${squareSize*2}px` }}>
        <CapturedPieces player={!gameState.whiteOnBottom ? 'White' : 'Black'} pieces={!gameState.whiteOnBottom ? gameState.whiteCapturedPieces : gameState.blackCapturedPieces} />
        <h1 style={{ font: 'bold 25px Arial', textAlign: 'center', color: '#eeeeee' }}>{message}</h1>
        <CapturedPieces player={gameState.whiteOnBottom ? 'White' : 'Black'} pieces={gameState.whiteOnBottom ? gameState.whiteCapturedPieces : gameState.blackCapturedPieces} />
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
              onClick={handleNewGameClick}>New Game</button>
      <button style={{ border: '1px solid black', height: '50px', font: 'bold 30px Arial' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'black' }}>Back to Home</a>
      </button>
    </div>
    <ChatBot page="Chess"/>
  </div>
  );
};

export default Chessboard;