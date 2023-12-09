// Chessboard.test.js
// import { render, fireEvent } from '@testing-library/react';
jest.mock('axios');
// import { useChessGameState } from '../../Chess/ChessGameState';
// import { getValidMoves } from '../../Chess/PieceMovement';
import Chessboard from '../../Chess/Chessboard';

jest.mock('../../Chess/ChessGameState');
jest.mock('../../Chess/PieceMovement');

describe('Chessboard', () => {
    beforeEach(() => {
        useChessGameState.mockReturnValue({
            gameState: {
                board: Array(8).fill(Array(8).fill(null)),
                currentPlayer: 'w',
            },
            updateGameState: jest.fn(),
            resetGame: jest.fn(),
            message: '',
            seconds: 0,
            timeLimit: 0,
            gameOver: false,
        });
        getValidMoves.mockReturnValue([]);
    });

    // test('renders a square correctly', () => {
    //     const { getAllByRole } = render(<Chessboard />);
    //     const squares = getAllByRole('button'); // assuming each square is a button
    //     expect(squares).toHaveLength(64); // 8x8 chessboard
    // });

    // test('handle square click', () => {
    //     const { getAllByRole } = render(<Chessboard />);
    //     const squares = getAllByRole('button');
    //     fireEvent.click(squares[0]);
    //     expect(useChessGameState().updateGameState).toHaveBeenCalled();
    // });

    // Add more tests for other conditions in renderSquare
});