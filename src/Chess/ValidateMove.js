export const isValidMove = (board, selectedSquare, endRow, endCol) => {
    const {row, col} = selectedSquare;
    const startRow = row;
    const startCol = col;
    const piece = board[startRow][startCol];
    const targetPiece = board[endRow][endCol];
    const enemyPiece = piece[0] !== targetPiece[0] && targetPiece;
    console.log(enemyPiece);
  
    // Ensure there is a piece at the starting position
    if (!piece) {
        console.log("No start piece");
        return false;
    }
  
    // Add specific rules based on the type of piece
    switch (piece) {
      case 'wpawn':
        // Implement rules for white pawn
        // Example: White pawn moves forward one square
        return (
          startRow === 6 && endRow === startRow - 2 && endCol === startCol && !targetPiece) 
          || (endRow === startRow - 1 && endCol === startCol && !targetPiece)
          || (endRow === startRow - 1 && (endCol === startCol - 1 || endCol === startCol + 1) && enemyPiece);
  
      case 'bpawn':
        // Implement rules for black pawn
        // Example: Black pawn moves forward one square
        return (
          startRow === 1 && endRow === startRow + 2 && endCol === startCol && !targetPiece) 
          || (endRow === startRow + 1 && endCol === startCol && !targetPiece)
          || (endRow === startRow + 1 && (endCol === startCol - 1 || endCol === startCol + 1) && enemyPiece);

      case 'wknight':
      case 'bknight':
        // Implement rules for white pawn
        // Example: White pawn moves forward one square
        return (
          (endRow === startRow - 2 && endCol === startCol - 1)
          || (endRow === startRow - 2 && endCol === startCol + 1)
          || (endRow === startRow - 1 && endCol === startCol - 2)
          || (endRow === startRow - 1 && endCol === startCol + 2)
          || (endRow === startRow + 2 && endCol === startCol - 1)
          || (endRow === startRow + 2 && endCol === startCol + 1)
          || (endRow === startRow + 1 && endCol === startCol - 2)
          || (endRow === startRow + 1 && endCol === startCol + 2))
          && (!targetPiece || enemyPiece);

      case 'wking':
      case 'bking':
        // Implement rules for white pawn
        // Example: White pawn moves forward one square
        return targetPiece !== piece
        && Math.abs(startRow - endRow) <= 1
        && Math.abs(startCol - endCol) <= 1
        && (!targetPiece || enemyPiece);
  
      // Add cases for other piece types (e.g., knight, bishop, rook, etc.)
  
      default:
        // Default: Allow the move for pieces without specific rules
        return true;
    }
  };