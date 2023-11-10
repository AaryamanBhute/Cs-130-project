// GameState.js
import { useState } from 'react';
import produce from 'immer';

const getRandomBoolean = () => Math.random() < 0.5;

const createInitialBoard = () => {
  // Standard chess starting setup
  const piecesOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  const pawnsRow = Array(8).fill('pawn');

  const whitePieces = piecesOrder.map((type) => `w${type}`);
  const blackPieces = piecesOrder.map((type) => `b${type}`);
  const whitePawns = pawnsRow.map(() => 'wpawn');
  const blackPawns = pawnsRow.map(() => 'bpawn');
  const blankRow = Array(8).fill("");

  const piecesRows = [blackPieces, blackPawns, blankRow, blankRow, blankRow, blankRow, whitePawns, whitePieces];

  // Randomize whether white or black is on the bottom
  const isWhiteOnBottom = getRandomBoolean();
  const orientedRows = isWhiteOnBottom ? piecesRows : piecesRows.slice().reverse();

  return {
    board: orientedRows,
    // Other properties...
  };
};

export const useChessGameState = () => {
  const initialGameState = createInitialBoard();

  const [gameState, setGameState] = useState(initialGameState);

  const resetGame = () => {
    const newGameState = createInitialBoard();
    setGameState(newGameState);
  };

  const movePiece = (selectedSquare, r, c) => {
    const {row, col} = selectedSquare;
    console.log(row + " " + col + " " + r + " " + c);
    const updatedGameState = produce(gameState, (draft) => {
      const piece = draft.board[row][col];
      draft.board[r][c] = piece;
      draft.board[row][col] = "";
    });
    setGameState(updatedGameState);
  }

  return {
    gameState,
    setGameState,
    movePiece,
    resetGame,
  };
};