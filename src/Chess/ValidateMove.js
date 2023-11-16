export const validateMove = (gameState, startRow, startCol, endRow, endCol) => {
    const board = gameState.board;
    const piece = board[startRow][startCol];
    const targetPiece = board[endRow][endCol];
    const samePiece = piece[0] === targetPiece[0];
    const lastMove = gameState.lastMove;
  
    // Ensure initial conditions
    if (!piece || samePiece || piece === targetPiece) {
        console.log("INVALID MOVE SELECTION");
        return false;
    }
    
    let move = {valid: false, castle: [], enPassant: [], specialRequirements: {...gameState.specialRequirements}};
    let x = endCol - startCol;
    let xa = Math.abs(x);
    let y = endRow - startRow;
    let ya = Math.abs(y);
    let topPawnColor = gameState.whiteOnBottom ? 'bpawn' : 'wpawn';
    let bottomPawnColor = gameState.whiteOnBottom ? 'wpawn' : 'bpawn';
    // Add specific rules based on the type of piece
    switch (piece) {
      case bottomPawnColor:
        if (lastMove && lastMove.piece === topPawnColor && 
            Math.abs(lastMove.startRow - lastMove.endRow) === 2 && 
            Math.abs(lastMove.endCol - startCol) === 1 && 
            lastMove.endRow - endRow === 1 && 
            startRow === lastMove.endRow && 
            endCol === lastMove.endCol) {
          move.valid = true;
          move.enPassant = [lastMove.piece, lastMove.startRow, lastMove.startCol, lastMove.endRow, lastMove.endCol];
        } else {
          move.valid = (((startRow === 6 && y === -2) || y === -1) && endCol === startCol && !targetPiece)
                      || (y === -1 && xa === 1 && (targetPiece));
        }
        break;
  
      case topPawnColor:
        if (lastMove && lastMove.piece === bottomPawnColor && 
            Math.abs(lastMove.startRow - lastMove.endRow) === 2 && 
            Math.abs(lastMove.endCol - startCol) === 1 && 
            endRow - lastMove.endRow === 1 && 
            startRow === lastMove.endRow && 
            endCol === lastMove.endCol) {
          move.valid = true;
          move.enPassant = [lastMove.piece, lastMove.startRow, lastMove.startCol, lastMove.endRow, lastMove.endCol];
        } else {
          move.valid = (((startRow === 1 && y === 2) || y === 1) && endCol === startCol && !targetPiece)
                      || (y === 1 && xa === 1 && (targetPiece));
        }
        break;

      case 'wknight':
      case 'bknight':
        move.valid = xa + ya === 3 && xa > 0 && ya > 0;
        break;

      case 'wking':
        // handle white castling
        if (gameState.whiteOnBottom) {
          if (endRow === 7 && endCol === 1 && !board[7][2] && !board[7][3] && gameState.specialRequirements.whiteLongCastle) {
            move.valid = true;
            move.castle = ['wrook', 7, 0, 7, 2];
          }
          else if (endRow === 7 && endCol === 6 && !board[7][5] && gameState.specialRequirements.whiteShortCastle) {
            move.valid = true;
            move.castle = ['wrook', 7, 7, 7, 5];
          }
        } else {
          if (endRow === 0 && endCol === 1 && !board[0][2] && gameState.specialRequirements.whiteShortCastle) {
            move.valid = true;
            move.castle = ['wrook', 0, 0, 0, 2];
          }
          else if (endRow === 0 && endCol === 6 && !board[0][5] && !board[0][4] && gameState.specialRequirements.whiteLongCastle) {
            move.valid = true;
            move.castle = ['wrook', 0, 7, 0, 5];
          }
        }
        if (move.valid) {
          move.specialRequirements.whiteShortCastle = false;
          move.specialRequirements.whiteLongCastle = false;
        } else {
          // regular white king movement
          move.valid = xa <= 1 && ya <= 1;
        }
        break;

      case 'bking':
        // handle black castling
        if (!gameState.whiteOnBottom) {
          if (endRow === 7 && endCol === 1 && !board[7][2] && gameState.specialRequirements.blackShortCastle) {
            move.valid = true;
            move.castle = ['brook', 7, 0, 7, 2];
          }
          else if (endRow === 7 && endCol === 6 && !board[7][5] && !board[7][4] && gameState.specialRequirements.blackLongCastle) {
            move.valid = true;
            move.castle = ['brook', 7, 7, 7, 5];
          }
        } else {
          if (endRow === 0 && endCol === 1 && !board[0][2] && !board[0][3] && gameState.specialRequirements.blackLongCastle) {
            move.valid = true;
            move.castle = ['brook', 0, 0, 0, 2];
          }
          else if (endRow === 0 && endCol === 6 && !board[0][5] && gameState.specialRequirements.blackShortCastle) {
            move.valid = true;
            move.castle = ['brook', 0, 7, 0, 5];
          }
        }
        if (move.valid) {
          move.specialRequirements.blackShortCastle = false;
          move.specialRequirements.blackLongCastle = false;
        } else {
          // regular black king movement
          move.valid = xa <= 1 && ya <= 1;
        }
        break;

      case 'wrook':
      case 'brook':
        move.valid = true;

        if (startRow !== endRow && startCol !== endCol) {
          move.valid = false;
          break;
        }

        if (endRow > startRow) {
          for (let i = startRow + 1; i < endRow; i++) {
            if (board[i][endCol]) {
              move.valid = false;
              break;
            }
          }
        }
        else if (endRow < startRow) {
          for (let i = endRow + 1; i < startRow; i++) {
            if (board[i][endCol]) {
              move.valid = false;
              break;
            }
          }
        }
        else if (endCol > startCol) {
          for (let i = startCol + 1; i < endCol; i++) {
            if (board[endRow][i]) {
              move.valid = false;
              break;
            }
          }
        }
        else if (endCol < startCol) {
          for (let i = endCol + 1; i < startCol; i++) {
            if (board[endRow][i]) {
              move.valid = false;
              break;
            }
          }
        }
        break;
      
      case 'wbishop':
      case 'bbishop':
        move.valid = true;

        if (xa !== ya) {
          move.valid = false;
          break;
        }

        for (let i = 1; i < xa; i++) {
          if (x < 0 && y < 0) {
            if (board[startRow - i][startCol - i]) {
              move.valid = false;
              break;
            }
          }
          if (x < 0 && y > 0) {
            if (board[startRow + i][startCol - i]) {
              move.valid = false;
              break;
            }
          }
          if (x > 0 && y < 0) {
            if (board[startRow - i][startCol + i]) {
              move.valid = false;
              break;
            }
          }
          if (x > 0 && y > 0) {
            if (board[startRow + i][startCol + i]) {
              move.valid = false;
              break;
            }
          }
        }
        break;
      
      case 'wqueen':
      case 'bqueen':
        move.valid = true;

        if (!(xa === ya || startRow === endRow || startCol === endCol)) {
          move.valid = false;
          break;
        }
        if (xa === ya) {
          for (let i = 1; i < xa; i++) {
            if (x < 0 && y < 0) {
              if (board[startRow - i][startCol - i]) {
                move.valid = false;
                break;
              }
            }
            if (x < 0 && y > 0) {
              if (board[startRow + i][startCol - i]) {
                move.valid = false;
                break;
              }
            }
            if (x > 0 && y < 0) {
              if (board[startRow - i][startCol + i]) {
                move.valid = false;
                break;
              }
            }
            if (x > 0 && y > 0) {
              if (board[startRow + i][startCol + i]) {
                move.valid = false;
                break;
              }
            }
          }
        }
        else if (startCol === endCol) {
          if (endRow > startRow) {
            for (let i = startRow + 1; i < endRow; i++) {
              if (board[i][endCol]) {
                move.valid = false;
                break;
              }
            }
          }
          else if (endRow < startRow) {
            for (let i = endRow + 1; i < startRow; i++) {
              if (board[i][endCol]) {
                move.valid = false;
                break;
              }
            }
          }
        }
        else if (startRow === endRow) {
          if (endCol > startCol) {
            for (let i = startCol + 1; i < endCol; i++) {
              if (board[endRow][i]) {
                move.valid = false;
                break;
              }
            }
          }
          else if (endCol < startCol) {
            for (let i = endCol + 1; i < startCol; i++) {
              if (board[endRow][i]) {
                move.valid = false;
                break;
              }
            }
          }
        }
        break;

      default:
        move.valid = false
    }

    if (move.valid) {
      if ((startRow === 0 && startCol === 0) || (endRow === 0 && endCol === 0)) {
        if (gameState.whiteOnBottom) {
          move.specialRequirements.blackLongCastle = false;
        } else {
          move.specialRequirements.whiteShortCastle = false;
        }
      } else if ((startRow === 0 && startCol === 7) || (endRow === 0 && endCol === 7)) {
        if (gameState.whiteOnBottom) {
          move.specialRequirements.blackShortCastle = false;
        } else {
          move.specialRequirements.whiteLongCastle = false;
        }
      } else if ((startRow === 7 && startCol === 0) || (endRow === 7 && endCol === 0)) {
        if (gameState.whiteOnBottom) {
          move.specialRequirements.whiteLongCastle = false;
        } else {
          move.specialRequirements.blackShortCastle = false;
        }
      } else if ((startRow === 7 && startCol === 7) || (endRow === 7 && endCol === 7)) {
        if (gameState.whiteOnBottom) {
          move.specialRequirements.whiteShortCastle = false;
        } else {
          move.specialRequirements.blackLongCastle = false;
        }
      }
    }
    return move;
  };