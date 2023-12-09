// Chess tests can be found in Chess directory

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Mastermind from './Mastermind';
import '@testing-library/jest-dom';

describe('Mastermind Component', () => {
    test('renders Mastermind component correctly', () => {
        render(<Mastermind />);
        const headingElement = screen.getByText('Mastermind');
        expect(headingElement).toBeInTheDocument();
    });
    test('Game starts and is properly displayed', () => {
        render(<Mastermind />);
        const startButton = screen.getByText('Start Game');
        expect(startButton).toBeInTheDocument();
        const secretCodeElement = screen.queryByText('Secret Code');
        expect(secretCodeElement).not.toBeInTheDocument();
        fireEvent.click(startButton);
    });
});
