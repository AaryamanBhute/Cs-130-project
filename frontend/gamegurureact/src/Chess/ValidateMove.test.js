// ValidateMove.test.js
import { validateMove } from './ValidateMove';

describe('ValidateMove', () => {

    test('validates a move correctly', () => {
        const gameState = {
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
        const result = validateMove(gameState, 5, 5, 1, 5);
        expect(result.valid).toBe(true);
    });

    test('invalidates a move correctly', () => {
        const gameState = {
            board: [
                ['brook', 'bknight', 'bbishop', 'bqueen', 'bking', 'bbishop', 'bknight', 'brook'],
                ['bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn'],
                ['wrook', 'wknight', 'wbishop', 'wqueen', 'wking', 'wbishop', 'wknight', 'wrook']
            ],
            currentPlayer: "w",
            lastMove: {},
            whiteCapturedPieces: [],
            blackCapturedPieces: [],
            whiteOnBottom: 1,
            specialRequirements: {whiteShortCastle: true, whiteLongCastle: true, blackShortCastle: true, blackLongCastle: true},
        };
        const result = validateMove(gameState, 0, 0, 6, 0);
        expect(result.valid).toBe(false);
    });

    // Add more tests for other conditions
});