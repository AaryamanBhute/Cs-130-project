// ChessGameState.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useReducer } from 'react';
import { useChessGameState } from '../../Chess/ChessGameState';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useReducer: jest.fn(),
}));

describe('ChessGameState', () => {
    // beforeEach(() => {
    //     useReducer.mockImplementation((reducer, initialState) => [initialState, jest.fn()]);
    // });

    // test('returns the initial game state', () => {
    //     const { result } = renderHook(() => useChessGameState());
    //     expect(result.current.gameState).toEqual({
    //         board: Array(8).fill(Array(8).fill(null)),
    //         currentPlayer: 'w',
    //         lastMove: null,
    //         specialRequirements: null,
    //         whiteCapturedPieces: [],
    //         blackCapturedPieces: [],
    //     });
    // });

    // test('returns the updateGameState function', () => {
    //     const { result } = renderHook(() => useChessGameState());
    //     expect(typeof result.current.updateGameState).toBe('function');
    // });

    // test('returns the resetGame function', () => {
    //     const { result } = renderHook(() => useChessGameState());
    //     expect(typeof result.current.resetGame).toBe('function');
    // });

    // Add more tests for other conditions
});