// GameState.js
import { useState, useEffect } from 'react';
import { getValidMoves, makeMove, kingUnderAttack } from './PieceMovement';

export const gameLength = 60 * 5; // 5 minutes

const createInitialBoard = () => {
  // Randomize whether white or black is on the bottom
  const isWhiteOnBottom = Math.random() < 0.5;

  const piecesOrder = isWhiteOnBottom ?
                      ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'] :
                      ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'];

  const whitePieces = piecesOrder.map((type) => `w${type}`);
  const blackPieces = piecesOrder.map((type) => `b${type}`);
  const whitePawns = Array(8).fill('wpawn');
  const blackPawns = Array(8).fill('bpawn');
  const blankRow = Array(8).fill('');

  const piecesRows = [blackPieces, blackPawns, blankRow, blankRow, blankRow, blankRow, whitePawns, whitePieces];

  const orientedRows = isWhiteOnBottom ? piecesRows : piecesRows.slice().reverse();

  return {
    board: orientedRows,
    gameOver: false,
    blackCapturedPieces: [],
    whiteCapturedPieces: [],
    currentPlayer: 'w',
    whiteOnBottom: isWhiteOnBottom,
    lastMove: {},
    specialRequirements: {
      whiteShortCastle: true,
      whiteLongCastle: true,
      blackShortCastle: true,
      blackLongCastle: true,
    }
  };
};

export const useChessGameState = () => {
  const initialGameState = createInitialBoard();

  const [gameState, setGameState] = useState(initialGameState);
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState({ white: 0, black: 0 });

  const resetGame = () => {
    setSeconds({ white: 0, black: 0 });
    setGameState(createInitialBoard());
  };

  const updateGameState = (gameState, move) => {
    setGameState(makeMove(gameState, move));
  };

  useEffect(() => {
    // Check if there's any move that would not result in a check
    if (kingUnderAttack(gameState, gameState.currentPlayer)) {
      const validMoves = getValidMoves(gameState, gameState.currentPlayer);
      for (let move of validMoves) {
        if (!kingUnderAttack(makeMove(gameState, move), gameState.currentPlayer)) {
          setMessage(`${gameState.currentPlayer === 'w' ? 'White' : 'Black'} is in check!`);
          return;
        }
      }
      setMessage(`${gameState.currentPlayer === 'b' ? 'White' : 'Black'} wins by checkmate!`);
      setGameState({ ...gameState, gameOver: true });
    } else {
      setMessage("");
    }
  }, [gameState]); // Run this effect whenever gameState changes  

  useEffect(() => {
    if (seconds.white >= gameLength) {
      setMessage('Black wins by timeout!');
      setGameState({ ...gameState, gameOver: true });
    } else if (seconds.black >= gameLength) {
      setMessage('White wins by timeout!');
      setGameState({ ...gameState, gameOver: true });
    }
    const interval = setInterval(() => {
        setSeconds(seconds => ({
          white: gameState.currentPlayer === 'w' ? seconds.white + 1 : seconds.white,
          black: gameState.currentPlayer === 'b' ? seconds.black + 1 : seconds.black
        }));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, message, gameState]);

  return {
    gameState,
    updateGameState,
    resetGame,
    message,
    seconds,
  };
};