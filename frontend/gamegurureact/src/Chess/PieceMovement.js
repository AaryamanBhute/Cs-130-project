// PieceMovement.js
import { validateMove } from './ValidateMove';
import produce from 'immer';

const movePiece = (gameState, move) => {
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
};

const castle = (gameState, move) => {
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
};

const enPassant = (gameState, move) => {
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
};

export const makeMove = (gameState, move) => {
    // Update the game state based on the move
    if (move.castle) {
      return castle(gameState, move);
    } else if (move.enPassant) {
      return enPassant(gameState, move);
    } else {
      return movePiece(gameState, move);
    }
  };

const getKingPosition = (gameState, player) => {
    let kingPosition = {row: -1, col: -1};
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece === player + 'king') {
          kingPosition = {row, col};
          return kingPosition;
        }
      }
    }
};
  
export const getValidMoves = (gameState, player) => {
    let validMoves = [];
    for (let startRow = 0; startRow < 8; startRow++) {
      for (let startCol = 0; startCol < 8; startCol++) {
        const piece = gameState.board[startRow][startCol];
        if (piece && piece[0] === player) {
          for (let endRow = 0; endRow < 8; endRow++) {
            for (let endCol = 0; endCol < 8; endCol++) {
              const move = validateMove(gameState, startRow, startCol, endRow, endCol);
              if (move.valid) {
                const newGameState = makeMove(gameState, move);
                const kingPosition = getKingPosition(newGameState, player);
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        const opponentPiece = gameState.board[row][col];
                        if (opponentPiece && opponentPiece[0] !== player) {
                            const opponentMove = validateMove(newGameState, row, col, kingPosition.row, kingPosition.col);
                            if (opponentMove.valid) {
                                move.valid = false;
                            }
                        }
                    }
                  }
              }
              if (move.valid) {
                validMoves.push(move);
              }
            }
          }
        }
      }
    }
    return validMoves;
};

export const kingUnderAttack = (gameState, player) => {
    const kingPosition = getKingPosition(gameState, player);
    const opponentMoves = getValidMoves(gameState, player === 'w' ? 'b' : 'w');
    return opponentMoves.some(move => move.endRow === kingPosition.row && move.endCol === kingPosition.col);
};
