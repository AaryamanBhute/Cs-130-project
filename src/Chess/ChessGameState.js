// GameState.js
import React, { useState } from 'react';
import { validateMove } from './ValidateMove';
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

  const resetGame = () => {
    const newGameState = createInitialBoard();
    setGameState(newGameState);
  };

  const movePiece = React.useCallback((gameState, move) => {
    const piece = move.piece;
    const startRow = move.startRow;
    const startCol = move.startCol;
    const endRow = move.endRow;
    const endCol = move.endCol;
    const specialRequirements = move.specialRequirements;
    return produce(gameState, (draft) => {
      draft.board[startRow][startCol] = "";
      const capturedPiece = draft.board[endRow][endCol];
      if (capturedPiece) {
        if (capturedPiece[0] === 'w') {
          draft.blackCapturedPieces.push(capturedPiece);
        } else {
          draft.whiteCapturedPieces.push(capturedPiece);
        }
      }
      if (piece && piece[1] === 'p' && (endRow === 0 || endRow === 7)) {
        draft.board[endRow][endCol] = piece[0] + 'queen';
      } else {
        draft.board[endRow][endCol] = piece;
      }
      draft.currentPlayer = piece[0] === 'w' ? 'b' : 'w';
      draft.lastMove = { piece, startRow, startCol, endRow, endCol };
      draft.specialRequirements = specialRequirements;
    });
  }, []); // Add any dependencies here

  const castle = React.useCallback((gameState, move) => {
    const piece = move.piece;
    const startRow = move.startRow;
    const startCol = move.startCol;
    const endRow = move.endRow;
    const endCol = move.endCol;
    const castlePiece = piece[0] + 'rook';
    const castleStartRow = startRow;
    const castleStartCol = endCol === 1 ? 0 : 7;
    const castleEndRow = startRow;
    const castleEndCol = endCol === 1 ? 2 : 5;
    const specialRequirements = move.specialRequirements;
    return produce(gameState, (draft) => {
      draft.board[castleStartRow][castleStartCol] = "";
      draft.board[castleEndRow][castleEndCol] = castlePiece;
      draft.board[startRow][startCol] = "";
      draft.board[endRow][endCol] = piece;
      draft.currentPlayer = piece[0] === 'w' ? 'b' : 'w';
      draft.lastMove = { piece, startRow, startCol, endRow, endCol };
      draft.specialRequirements = specialRequirements;
    });
  }, []); // Add any dependencies here

  const enPassant = React.useCallback((gameState, move) => {
    const piece = move.piece;
    const startRow = move.startRow;
    const startCol = move.startCol;
    const endRow = move.endRow;
    const endCol = move.endCol;
    const lastMove = gameState.lastMove;
    const specialRequirements = move.specialRequirements;
    return produce(gameState, (draft) => {
      let capturedPiece = draft.board[lastMove.endRow][lastMove.endCol];
      if (capturedPiece) {
        if (capturedPiece[0] === 'w') {
          draft.blackCapturedPieces.push(capturedPiece);
        } else {
          draft.whiteCapturedPieces.push(capturedPiece);
        }
      }
      draft.board[lastMove.endRow][lastMove.endCol] = "";
      draft.board[startRow][startCol] = "";
      draft.board[endRow][endCol] = piece;
      draft.currentPlayer = piece[0] === 'w' ? 'b' : 'w';
      draft.lastMove = { piece, startRow, startCol, endRow, endCol };
      draft.specialRequirements = specialRequirements;
    });
  }, []); // Add any dependencies here

  const makeMove = React.useCallback((gameState, move) => {
    // Update the game state based on the move
    if (move.castle) {
      return castle(gameState, move);
    } else if (move.enPassant) {
      return enPassant(gameState, move);
    } else {
      return movePiece(gameState, move);
    }
  }, [castle, enPassant, movePiece]); // Add any dependencies here
  
  const getValidMoves = React.useCallback((gameState, player) => {
    let validMoves = [];
    for (let startRow = 0; startRow < 8; startRow++) {
      for (let startCol = 0; startCol < 8; startCol++) {
        const piece = gameState.board[startRow][startCol];
        if (piece && piece[0] === player) {
          for (let endRow = 0; endRow < 8; endRow++) {
            for (let endCol = 0; endCol < 8; endCol++) {
              const move = validateMove(gameState, startRow, startCol, endRow, endCol);
              if (move.valid) {
                validMoves.push(move);
              }
            }
          }
        }
      }
    }
    return validMoves;
  }, []); // Add any dependencies here

  const getKingPosition = React.useCallback((gameState, player) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && piece[0] === player && piece[1] === 'k' && piece[2] === 'i') {
          return [row, col];
        }
      }
    }
  }, []); // Add any dependencies here

  const kingUnderAttack = React.useCallback((gameState, player) => {
    let kingPosition = getKingPosition(gameState, player);
    const opponentMoves = getValidMoves(gameState, player === 'w' ? 'b' : 'w');
    if (opponentMoves.some(move => move.endRow === kingPosition[0] && move.endCol === kingPosition[1])) {
      return true;
    }
    return false;
  }, [getKingPosition, getValidMoves]); // Add any dependencies here

  React.useEffect(() => {
    // Check if there's any move that would not result in a check
    if (kingUnderAttack(gameState, gameState.currentPlayer)) {
      const validMoves = getValidMoves(gameState, gameState.currentPlayer);
      for (let move of validMoves) {
        if (!kingUnderAttack(makeMove(gameState, move), gameState.currentPlayer)) {
          console.log(`${gameState.currentPlayer === 'w' ? 'White' : 'Black'} is in Check!`);
          return;
        }
      }
      console.log(`${gameState.currentPlayer === 'w' ? 'White' : 'Black'} wins by Checkmate!`);
    }
  }, [gameState, makeMove, kingUnderAttack, getValidMoves]); // Run this effect whenever gameState changes  

  const updateGameState = React.useCallback((gameState, move) => {
    const newGameState = makeMove(gameState, move);
    setGameState(newGameState);
  }, [makeMove]); // Add any dependencies here

  return {
    gameState,
    setGameState,
    updateGameState,
    getValidMoves,
    resetGame,
  };
};