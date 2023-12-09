// ChessAI.js

/**
 * ChessAI Implementation.
 * @module Chess/ChessAI
 */

import { makeMove, getValidMoves } from './PieceMovement';

/**
 * The values of the chess pieces.
 * @type {Object}
 */
const pieceValues = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 20000
};

/**
 * The piece-square table for the chess pieces.
 * @type {Object}
 */
const pieceSquareTable = {
    pawn: [
        [ 0,  0,  0,  0,  0,  0,  0,  0,],
        [50, 50, 50, 50, 50, 50, 50, 50,],
        [10, 10, 20, 30, 30, 20, 10, 10,],
        [ 5,  5, 10, 25, 25, 10,  5,  5,],
        [ 0,  0,  0, 20, 20,  0,  0,  0,],
        [ 5, -5,-10,  0,  0,-10, -5,  5,],
        [ 5, 10, 10,-20,-20, 10, 10,  5,],
        [ 0,  0,  0,  0,  0,  0,  0,  0 ]
    ],
    knight: [
        [-50,-40,-30,-30,-30,-30,-40,-50,],
        [-40,-20,  0,  0,  0,  0,-20,-40,],
        [-30,  0, 10, 15, 15, 10,  0,-30,],
        [-30,  5, 15, 20, 20, 15,  5,-30,],
        [-30,  0, 15, 20, 20, 15,  0,-30,],
        [-30,  5, 10, 15, 15, 10,  5,-30,],
        [-40,-20,  0,  5,  5,  0,-20,-40,],
        [-50,-40,-30,-30,-30,-30,-40,-50 ]
    ],
    bishop: [
        [-20,-10,-10,-10,-10,-10,-10,-20,],
        [-10,  0,  0,  0,  0,  0,  0,-10,],
        [-10,  0,  5, 10, 10,  5,  0,-10,],
        [-10,  5,  5, 10, 10,  5,  5,-10,],
        [-10,  0, 10, 10, 10, 10,  0,-10,],
        [-10, 10, 10, 10, 10, 10, 10,-10,],
        [-10,  5,  0,  0,  0,  0,  5,-10,],
        [-20,-10,-10,-10,-10,-10,-10,-20 ]
    ],
    rook:  [ 
        [ 0,  0,  0,  0,  0,  0,  0,  0,],
        [ 5, 10, 10, 10, 10, 10, 10,  5,],
        [-5,  0,  0,  0,  0,  0,  0, -5,],
        [-5,  0,  0,  0,  0,  0,  0, -5,],
        [-5,  0,  0,  0,  0,  0,  0, -5,],
        [-5,  0,  0,  0,  0,  0,  0, -5,],
        [-5,  0,  0,  0,  0,  0,  0, -5,],
        [ 0,  0,  0,  5,  5,  0,  0,  0 ]
    ],
    queen: [
        [-20,-10,-10, -5, -5,-10,-10,-20,],
        [-10,  0,  0,  0,  0,  0,  0,-10,],
        [-10,  0,  5,  5,  5,  5,  0,-10,],
        [ -5,  0,  5,  5,  5,  5,  0, -5,],
        [  0,  0,  5,  5,  5,  5,  0, -5,],
        [-10,  5,  5,  5,  5,  5,  0,-10,],
        [-10,  0,  5,  0,  0,  0,  0,-10,],
        [-20,-10,-10, -5, -5,-10,-10,-20 ]
    ],
    king: [
        [-30,-40,-40,-50,-50,-40,-40,-30,],
        [-30,-40,-40,-50,-50,-40,-40,-30,],
        [-30,-40,-40,-50,-50,-40,-40,-30,],
        [-30,-40,-40,-50,-50,-40,-40,-30,],
        [-20,-30,-30,-40,-40,-30,-30,-20,],
        [-10,-20,-20,-20,-20,-20,-20,-10,],
        [ 20, 20,  0,  0,  0,  0, 20, 20,],
        [ 20, 30, 10,  0,  0, 10, 30, 20 ]
    ]
};

/**
 * Function to evaluate the score of a given chess position.
 * @function evaluatePosition
 * @param {Object} gameState - The current game state.
 * @param {string} player - The current player.
 * @returns {number} The score of the given chess position.
 */
const evaluatePosition = (gameState, player) => {
    let score = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = gameState.board[i][j];
            if (piece) {
                const pieceType = piece.slice(1);
                const pieceColor = piece[0];
                const mult = pieceColor === player ? 1 : -1;
                if ((pieceColor === 'w' && gameState.whiteOnBottom) || (pieceColor === 'b' && !gameState.whiteOnBottom)) {
                    score += (pieceValues[pieceType] + pieceSquareTable[pieceType][i][j]) * mult;
                } else {
                    score += (pieceValues[pieceType] + pieceSquareTable[pieceType][7-i][7-j]) * mult;
                }
            }
        }
    }
    return score;
};

/**
 * Minimax algorithm with alpha-beta pruning.
 * @function minimax
 * @param {Object} gameState - The current game state.
 * @param {number} depth - The depth of the game tree to search.
 * @param {number} alpha - The best value that the maximizer currently can guarantee at that level or above.
 * @param {number} beta - The best value that the minimizer currently can guarantee at that level or above.
 * @param {boolean} maximizingPlayer - True if the current player is the maximizing player, false otherwise.
 * @param {string} player - The current player.
 * @returns {number} The evaluation of the game state.
 */
const minimax = (gameState, depth, alpha, beta, maximizingPlayer, player) => {
    if (depth === 0) {
        return evaluatePosition(gameState, player);
    }
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        const moves = getValidMoves(gameState, gameState.currentPlayer);
        for (let i = 0; i < moves.length; i++) {
            const evaluation = minimax(makeMove(gameState, moves[i]), depth - 1, alpha, beta, false, player);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        const moves = getValidMoves(gameState, gameState.currentPlayer);
        for (let i = 0; i < moves.length; i++) {
            const evaluation = minimax(makeMove(gameState, moves[i]), depth - 1, alpha, beta, true, player);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
};

/**
 * Function to make the AI move.
 * @function makeAIMove
 * @param {Object} gameState - The current game state.
 * @param {number} difficulty - The difficulty level of the AI.
 * @returns {Object} The game state after the AI move.
 */
export const makeAIMove = (gameState, difficulty) => {
    const moves = getValidMoves(gameState, gameState.currentPlayer);
    if (!moves.length) {
        return gameState;
    }
    let bestMove = null;
    let bestEval = -Infinity;
    for (let i = 0; i < moves.length; i++) {
        const evaluation = minimax(makeMove(gameState, moves[i]), difficulty, -Infinity, Infinity, true, gameState.currentPlayer);
        if (evaluation > bestEval) {
            bestEval = evaluation;
            bestMove = moves[i];
        }
    }
    return makeMove(gameState, bestMove);
};
