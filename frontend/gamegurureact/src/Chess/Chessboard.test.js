import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chessboard from './Chessboard';

describe('Chessboard', () => {

    test('renders all squares correctly', () => {
        const { getAllByRole } = render(<Chessboard />);
        const squares = getAllByRole('square'); // assuming each square is a button
        expect(squares).toHaveLength(64); // 8x8 chessboard
    });
    
    test('handle square click', () => {
        const { getAllByRole } = render(<Chessboard />);
        const squares = getAllByRole('square');
        fireEvent.click(squares[48]);
        fireEvent.click(squares[40]);
        const newGame = screen.getByText('New Game');
        expect(newGame).toBeInTheDocument();
        fireEvent.click(newGame);
    });

    // Add more tests for other conditions in renderSquare
});