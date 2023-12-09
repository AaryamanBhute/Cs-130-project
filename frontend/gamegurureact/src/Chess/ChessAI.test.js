// ChessAI.test.js
import { makeAIMove } from './ChessAI';

describe('ChessAI', () => {
    let gameState;
    beforeEach(() => {
        gameState = {
            board: [
                ['brook', '', 'bbishop', 'bqueen', 'bking', '', 'bknight', 'brook'],
                ['bpawn', 'bpawn', 'bpawn', 'bpawn', '', 'bpawn', 'bpawn', 'bpawn'],
                ['', '', 'bknight', '', '', '', '', ''],
                ['', '', 'bbishop', '', 'bpawn', '', '', ''],
                ['', '', 'wbishop', '', 'wpawn', '', '', ''],
                ['', '', '', '', '', 'wqueen', '', ''],
                ['wpawn', 'wpawn', 'wpawn', 'wpawn', '', 'wpawn', 'wpawn', 'wpawn'],
                ['wrook', 'wknight', 'wbishop', '', 'wking', '', 'wknight', 'wrook']
            ],
            currentPlayer: "w",
            whiteOnBottom: 1,
            lastMove: {piece: 'bbishop', startRow: 0, startCol: 5, endRow: 3, endCol: 2},
            specialRequirements: {whiteShortCastle: true, whiteLongCastle: true, blackShortCastle: true, blackLongCastle: true},
            whiteCapturedPieces: [],
            blackCapturedPieces: [],
        };
    });

    test('easy AI uses makeAIMove to make a valid move', () => {
        const newGameState = makeAIMove(gameState, 1);
        expect(newGameState).toHaveProperty('board');
        expect(newGameState.board).not.toEqual(gameState.board);
        expect(newGameState).toHaveProperty('currentPlayer');
        expect(newGameState.currentPlayer).not.toEqual(gameState.currentPlayer);
    });

    // test('medium AI uses makeAIMove to make a valid move', () => {
    //     const newGameState = makeAIMove(gameState, 2);
    //     expect(newGameState).toHaveProperty('board');
    //     expect(newGameState.board).not.toEqual(gameState.board);
    //     expect(newGameState).toHaveProperty('currentPlayer');
    //     expect(newGameState.currentPlayer).not.toEqual(gameState.currentPlayer);
    // });

    // test('hard AI uses makeAIMove to make a valid move', () => {
    //     const newGameState = makeAIMove(gameState, 3);
    //     expect(newGameState).toHaveProperty('board');
    //     expect(newGameState.board).not.toEqual(gameState.board);
    //     expect(newGameState).toHaveProperty('currentPlayer');
    //     expect(newGameState.currentPlayer).not.toEqual(gameState.currentPlayer);
    // });

    // Add more tests for other conditions
});