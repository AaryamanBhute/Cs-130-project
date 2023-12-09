// PieceMovement.test.js
import { makeMove, getValidMoves, kingUnderAttack } from './PieceMovement';

describe('PieceMovement', () => {

    test('makeMove moves a piece correctly', () => {
        const initialGameState = {
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
        const expectedBoard = {
            board: [
                ['brook', '', 'bbishop', 'bqueen', 'bking', '', 'bknight', 'brook'],
                ['bpawn', 'bpawn', 'bpawn', 'bpawn', '', 'wqueen', 'bpawn', 'bpawn'],
                ['', '', 'bknight', '', '', '', '', ''],
                ['', '', 'bbishop', '', 'bpawn', '', '', ''],
                ['', '', 'wbishop', '', 'wpawn', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['wpawn', 'wpawn', 'wpawn', 'wpawn', '', 'wpawn', 'wpawn', 'wpawn'],
                ['wrook', 'wknight', 'wbishop', '', 'wking', '', 'wknight', 'wrook']
            ],
            currentPlayer: "b",
            whiteOnBottom: 1,
            lastMove: {piece: 'wqueen', startRow: 5, startCol: 5, endRow: 1, endCol: 5},
            specialRequirements: {whiteShortCastle: true, whiteLongCastle: true, blackShortCastle: true, blackLongCastle: true},
            whiteCapturedPieces: ['bpawn'],
            blackCapturedPieces: [],
        };
        const move = {
            valid: true,
            castle: false,
            enPassant: false,
            piece: "wqueen",
            startCol: 5,
            startRow: 5,
            endCol: 5,
            endRow: 1,
            specialRequirements: {whiteShortCastle: true, whiteLongCastle: true, blackShortCastle: true, blackLongCastle: true},
        };
        const result = makeMove(initialGameState, move);
        expect(result).toEqual(expectedBoard);
    });

    test('getValidMoves gets the valid moves correctly', () => {
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
        const specialRequirements = {
            whiteShortCastle: true,
            whiteLongCastle: true,
            blackShortCastle: true,
            blackLongCastle: true
        }
        const expectedMoves = [{"castle": false, "enPassant": false, "endCol": 5, "endRow": 1, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 0, "endRow": 2, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 4, "endRow": 2, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 1, "endRow": 3, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 3, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 1, "endRow": 5, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 5, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 4, "endRow": 6, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 5, "endRow": 7, "piece": "wbishop", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 4, "valid": true}, {"castle": false, "enPassant": false, "endCol": 5, "endRow": 1, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 5, "endRow": 2, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 5, "endRow": 3, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 7, "endRow": 3, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 5, "endRow": 4, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 6, "endRow": 4, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 0, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 1, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 2, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 4, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 6, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 7, "endRow": 5, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 4, "endRow": 6, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 7, "piece": "wqueen", "specialRequirements": specialRequirements, "startCol": 5, "startRow": 5, "valid": true}, {"castle": false, "enPassant": false, "endCol": 0, "endRow": 4, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 0, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 0, "endRow": 5, "piece": "wpawn", "specialRequirements":specialRequirements, "startCol": 0, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 1, "endRow": 4, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 1, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 1, "endRow": 5, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 1, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 2, "endRow": 5, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 2, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 4, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 3, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 5, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 3, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 6, "endRow": 4, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 6, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 6, "endRow": 5, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 6, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 7, "endRow": 4, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 7, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 7, "endRow": 5, "piece": "wpawn", "specialRequirements": specialRequirements, "startCol": 7, "startRow": 6, "valid": true}, {"castle": false, "enPassant": false, "endCol": 0, "endRow": 5, "piece": "wknight", "specialRequirements": specialRequirements, "startCol": 1, "startRow": 7, "valid": true}, {"castle": false, "enPassant": false, "endCol": 2, "endRow": 5, "piece": "wknight", "specialRequirements": specialRequirements, "startCol": 1, "startRow": 7, "valid": true}, {"castle": false, "enPassant": false, "endCol": 4, "endRow": 6, "piece": "wking", "specialRequirements": specialRequirements, "startCol": 4, "startRow": 7, "valid": true}, {"castle": false, "enPassant": false, "endCol": 3, "endRow": 7, "piece": "wking", "specialRequirements": specialRequirements, "startCol": 4, "startRow": 7, "valid": true}, {"castle": false, "enPassant": false, "endCol": 5, "endRow": 7, "piece": "wking", "specialRequirements": specialRequirements, "startCol": 4, "startRow": 7, "valid": true}, {"castle": false, "enPassant": false, "endCol": 7, "endRow": 5, "piece": "wknight", "specialRequirements": specialRequirements, "startCol": 6, "startRow": 7, "valid": true}, {"castle": false, "enPassant": false, "endCol": 4, "endRow": 6, "piece": "wknight", "specialRequirements": specialRequirements, "startCol": 6, "startRow": 7, "valid": true}];
        const result = getValidMoves(gameState, 'w');
        expect(result).toEqual(expectedMoves);
    });

    test('kingUnderAttack checks if the king is under attack correctly', () => {
        const gameState = {
            board: [
                ['brook', '', 'bbishop', 'bqueen', 'bking', '', 'bknight', 'brook'],
                ['bpawn', 'bpawn', 'bpawn', 'bpawn', '', 'wqueen', 'bpawn', 'bpawn'],
                ['', '', 'bknight', '', '', '', '', ''],
                ['', '', 'bbishop', '', 'bpawn', '', '', ''],
                ['', '', 'wbishop', '', 'wpawn', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['wpawn', 'wpawn', 'wpawn', 'wpawn', '', 'wpawn', 'wpawn', 'wpawn'],
                ['wrook', 'wknight', 'wbishop', '', 'wking', '', 'wknight', 'wrook']
            ],
            currentPlayer: "b",
            whiteOnBottom: 1,
            lastMove: {piece: 'wqueen', startRow: 5, startCol: 5, endRow: 1, endCol: 5},
            specialRequirements: {whiteShortCastle: true, whiteLongCastle: true, blackShortCastle: true, blackLongCastle: true},
            whiteCapturedPieces: ['bpawn'],
            blackCapturedPieces: [],
        };
        const result = kingUnderAttack(gameState, 'b');
        expect(result).toEqual(true);
    });
});