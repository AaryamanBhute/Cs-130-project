// ChessGameState.js
import { useState, useEffect } from 'react';
import { getValidMoves, makeMove, kingUnderAttack } from './PieceMovement';
import { makeAIMove } from './ChessAI';

const createInitialBoard = (isWhiteOnBottom) => {
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

  let initialGameState = {
    board: orientedRows,
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

  return initialGameState
};

export const useChessGameState = () => {
  const [gameType, setGameType] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [playerColor, setPlayerColor] = useState(1);
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState({ white: 0, black: 0 });

  const initialGameState = createInitialBoard(playerColor);
  const [gameState, setGameState] = useState(initialGameState);
  const [gameOver, setGameOver] = useState(false);

  const mapGameTypeToDifficulty = (gameType) => {
    const difficultyMap = {
      'Free Play': 0,
      'Easy': 1,
      'Medium': 2,
      'Hard': 3
    };
    return difficultyMap[gameType];
  };
  
  const mapTimeLimitToSeconds = (timeLimit) => {
    const timeMap = {
      'No Time Limit': 0,
      '10 Minutes': 600,
      '5 Minutes': 300,
      '1 Minute': 60
    };
    return timeMap[timeLimit];
  };
  
  const mapColorToNumber = (color) => {
    const colorMap = {
      'Black': 0,
      'White': 1,
      'Random': Math.round(Math.random())
    };
    return colorMap[color];
  };

  const resetGame = (type, time, color) => {
    setGameOver(false);
    setMessage("");
    setSeconds({ white: 0, black: 0 });
    const difficulty = mapGameTypeToDifficulty(type);
    const timeInSeconds = mapTimeLimitToSeconds(time);
    const colorNumber = mapColorToNumber(color);
    setGameType(difficulty);
    setTimeLimit(timeInSeconds);
    setPlayerColor(colorNumber);
    const initialGameState = createInitialBoard(colorNumber);
    if (difficulty && !colorNumber) {
      setGameState(makeAIMove(initialGameState, difficulty));
    } else {
      setGameState(initialGameState);
    }
  };

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  const updateGameState = async (gameState, move) => {
    const playerGameState = makeMove(gameState, move);
    checkGameState(playerGameState);
    setGameState(playerGameState);
    if (gameType && !gameOver) {
      await sleep(500);
      const AIGameState = makeAIMove(playerGameState, gameType);
      checkGameState(AIGameState);
      setGameState(AIGameState);
    }
  };

  const checkGameState = (gameState) => {
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
      setGameOver(true);
    } else {
      setMessage("");
    }
  };

  useEffect(() => {
    if (timeLimit && !gameOver) {
      if (seconds.white >= timeLimit) {
        setMessage('Black wins by timeout!');
        setGameOver(true);
      } else if (seconds.black >= timeLimit) {
        setMessage('White wins by timeout!');
        setGameOver(true);
      }
      const interval = setInterval(() => {
        if (!gameOver) {
          setSeconds(seconds => ({
            white: gameState.currentPlayer === 'w' ? seconds.white + 1 : seconds.white,
            black: gameState.currentPlayer === 'b' ? seconds.black + 1 : seconds.black
          }));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds, message, gameState, timeLimit, gameOver]);

  return {
    gameState,
    updateGameState,
    resetGame,
    message,
    seconds,
    timeLimit,
    gameOver,
  };
};