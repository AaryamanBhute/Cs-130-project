export const isValidMove = (board, selectedSquare, endRow, endCol) => {
    const {row, col} = selectedSquare;
    const startRow = row;
    const startCol = col;
    const piece = board[startRow][startCol];
    const targetPiece = board[endRow][endCol];
    const samePiece = piece[0] === targetPiece[0];
  
    // Ensure initial conditions
    if (!piece || samePiece || piece === targetPiece) {
        return false;
    }
    
    let valid = true;
    let x = endCol - startCol;
    let xa = Math.abs(x);
    let y = endRow - startRow;
    let ya = Math.abs(y);
    // Add specific rules based on the type of piece
    switch (piece) {
      case 'wpawn':
        valid = (((startRow === 6 && y === -2) || y === -1) && endCol === startCol && !targetPiece) || (y === -1 && xa === 1 && targetPiece);
        break;
  
      case 'bpawn':
        valid = (((startRow === 1 && y === 2) || y === 1) && endCol === startCol && !targetPiece) || (y === 1 && xa === 1 && targetPiece);
        break;

      case 'wknight':
      case 'bknight':
        valid = xa + ya === 3 && xa && ya;
        break;

      case 'wking':
      case 'bking':
        valid = xa <= 1 && ya <= 1;
        break;

      case 'wrook':
      case 'brook':
        if (startRow !== endRow && startCol !== endCol) {
          valid = false;
          break;
        }

        if (endRow > startRow) {
          for (let i = startRow + 1; i < endRow; i++) {
            if (board[i][endCol]) {
              valid = false;
              break;
            }
          }
        }
        else if (endRow < startRow) {
          for (let i = endRow + 1; i < startRow; i++) {
            if (board[i][endCol]) {
              valid = false;
              break;
            }
          }
        }
        else if (endCol > startCol) {
          for (let i = startCol + 1; i < endCol; i++) {
            if (board[endRow][i]) {
              valid = false;
              break;
            }
          }
        }
        else if (endCol < startCol) {
          for (let i = endCol + 1; i < startCol; i++) {
            if (board[endRow][i]) {
              valid = false;
              break;
            }
          }
        }
        break;
      
      case 'wbishop':
      case 'bbishop':
        if (xa !== ya) {
          valid = false;
          break;
        }

        for (let i = 1; i < xa; i++) {
          if (x < 0 && y < 0) {
            if (board[startRow - i][startCol - i]) {
              valid = false;
              break;
            }
          }
          if (x < 0 && y > 0) {
            if (board[startRow + i][startCol - i]) {
              valid = false;
              break;
            }
          }
          if (x > 0 && y < 0) {
            if (board[startRow - i][startCol + i]) {
              valid = false;
              break;
            }
          }
          if (x > 0 && y > 0) {
            if (board[startRow + i][startCol + i]) {
              valid = false;
              break;
            }
          }
        }
        break;
      
      case 'wqueen':
      case 'bqueen':
        if (!(xa === ya || startRow === endRow || startCol === endCol)) {
          valid = false;
          break;
        }
        if (xa === ya) {
          for (let i = 1; i < xa; i++) {
            if (x < 0 && y < 0) {
              if (board[startRow - i][startCol - i]) {
                valid = false;
                break;
              }
            }
            if (x < 0 && y > 0) {
              if (board[startRow + i][startCol - i]) {
                valid = false;
                break;
              }
            }
            if (x > 0 && y < 0) {
              if (board[startRow - i][startCol + i]) {
                valid = false;
                break;
              }
            }
            if (x > 0 && y > 0) {
              if (board[startRow + i][startCol + i]) {
                valid = false;
                break;
              }
            }
          }
        }
        else if (startCol === endCol) {
          if (endRow > startRow) {
            for (let i = startRow + 1; i < endRow; i++) {
              if (board[i][endCol]) {
                valid = false;
                break;
              }
            }
          }
          else if (endRow < startRow) {
            for (let i = endRow + 1; i < startRow; i++) {
              if (board[i][endCol]) {
                valid = false;
                break;
              }
            }
          }
        }
        else if (startRow === endRow) {
          if (endCol > startCol) {
            for (let i = startCol + 1; i < endCol; i++) {
              if (board[endRow][i]) {
                valid = false;
                break;
              }
            }
          }
          else if (endCol < startCol) {
            for (let i = endCol + 1; i < startCol; i++) {
              if (board[endRow][i]) {
                valid = false;
                break;
              }
            }
          }
        }
        break;

      default:
        return valid;
  
    }

    return valid;
  };