// GameState.js
import { useState } from 'react';
import produce from 'immer';

const getRandomBoolean = () => Math.random() < 0.5;

const createInitialBoard = () => {
  // Randomize whether white or black is on the bottom
  const isWhiteOnBottom = getRandomBoolean();

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

  const resetGame = () => {
    const newGameState = createInitialBoard();
    setGameState(newGameState);
  };

  const movePiece = (piece, startRow, startCol, endRow, endCol, specialRequirements) => {
    setGameState(() => {
      let newGameState = produce(gameState, (draft) => {
        draft.board[startRow][startCol] = "";
        if (piece && piece[1] === 'p' && (endRow === 0 || endRow === 7)) {
          draft.board[endRow][endCol] = piece[0] + 'queen';
        } else {
          draft.board[endRow][endCol] = piece;
        }
        draft.lastMove = { piece, startRow, startCol, endRow, endCol };
        draft.specialRequirements = specialRequirements;
      });
      return newGameState;
    });
  };

  const castle = (castlePiece, castleStartRow, castleStartCol, castleEndRow, castleEndCol, piece, startRow, startCol, endRow, endCol, specialRequirements) => {
    setGameState(() => {
      const newGameState = produce(gameState, (draft) => {
        draft.board[castleStartRow][castleStartCol] = "";
        draft.board[castleEndRow][castleEndCol] = castlePiece;
        draft.board[startRow][startCol] = "";
        draft.board[endRow][endCol] = piece;
        draft.lastMove = { piece, startRow, startCol, endRow, endCol };
        draft.specialRequirements = specialRequirements;
      });
      return newGameState;
    });
  };

  const enPassant = (piece, startRow, startCol, endRow, endCol, specialRequirements) => {
    setGameState(() => {
      const newGameState = produce(gameState, (draft) => {
        draft.board[gameState.lastMove.endRow][gameState.lastMove.endCol] = "";
        draft.board[startRow][startCol] = "";
        draft.board[endRow][endCol] = piece;
        draft.lastMove = { piece, startRow, startCol, endRow, endCol };
        draft.specialRequirements = specialRequirements;
      });
      return newGameState;
    });
  };

  return {
    gameState,
    setGameState,
    movePiece,
    castle,
    enPassant,
    resetGame,
  };
};