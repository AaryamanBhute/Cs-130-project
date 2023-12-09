import { render, fireEvent } from '@testing-library/react';
import Mastermind from '../Mastermind';

describe('Mastermind', () => {
    // test('renders Mastermind component', () => {
    //     render(<Mastermind />);
    //   });
    
    //   test('starts game on button click', () => {
    //     const { getByText } = render(<Mastermind />);
    //     const startButton = getByText(/Start Game/i);
    //     fireEvent.click(startButton);
    //     // Add assertions here based on your game start state
    //   });
    
    //   test('resets game on button click', () => {
    //     const { getByText } = render(<Mastermind />);
    //     const resetButton = getByText(/Play Again/i);
    //     fireEvent.click(resetButton);
    //     // Add assertions here based on your game reset state
    //   });
});

describe('GameBoard', () => {
    // const mockProps = {
    //     colors: ['#FF0000', '#FF7300', '#FFe400', '#3A9A10', '#0609C4', '#8206E5'],
    //     handleColorSelection: jest.fn(),
    //     guesses: Array(32).fill('black'),
    //     handleGuessColor: jest.fn(),
    //     activeRow: 0,
    //     feedback: Array(32).fill('gray'),
    //     checkGuess: jest.fn(),
    //     code: [],
    //     gameResult: "IP",
    // };

    // test('renders GameBoard component', () => {
    //     const { getByText } = render(<GameBoard {...mockProps} />);
    //     expect(getByText(/Your Options:/i)).toBeInTheDocument();
    // });

    // test('handleColorSelection function', () => {
    //     const { getAllByRole } = render(<GameBoard {...mockProps} />);
    //     const colorDots = getAllByRole('button');
    //     fireEvent.click(colorDots[0]);
    //     expect(mockProps.handleColorSelection).toHaveBeenCalled();
    // });

    // Add more tests for other conditions
});