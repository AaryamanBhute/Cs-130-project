// ChessGameState.test.js
import { startTransition } from 'react';
import { createInitialBoard, useChessGameState } from './ChessGameState';

describe('createInitialBoard', () => {

    test('returns the initial game state', () => {
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
            whiteOnBottom: true,
            specialRequirements: {whiteShortCastle: true, whiteLongCastle: true, blackShortCastle: true, blackLongCastle: true},
        };

        expect(createInitialBoard(true)).toEqual(gameState);
    });
});