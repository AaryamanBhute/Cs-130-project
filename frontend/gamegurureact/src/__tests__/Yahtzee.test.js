import { render, fireEvent } from '@testing-library/react';
import Yahtzee from '../Yahtzee';

describe('Yahtzee', () => {
    // test('renders Yahtzee component', () => {
    //     render(<Yahtzee />);
    // });

    // test('rollDice function', () => {
    //     const { getByText } = render(<Yahtzee />);
    //     const rollButton = getByText(/Roll Dice/i);
    //     fireEvent.click(rollButton);
    //     // Add assertions here
    // });

    // test('handleSelection function', () => {
    //     // This test will depend on how you can access the dice elements
    // });

    // test('resetTurn function', () => {
    //     // This test will depend on how you can trigger a turn reset
    // });

    // test('resetGame function', () => {
    //     // This test will depend on how you can trigger a game reset
    // });

    // test('handleScoreSelect function', () => {
    //     // This test will depend on how you can select a score
    // });
});


describe('calculateScores', () => {
    // test('calculates scores correctly', () => {
    //   const results = [1, 2, 3, 4, 5];
    //   const scores = calculateScores(results);
    //   expect(scores).toEqual([1, 2, 3, 4, 5, 0, 0, 0, 30, 40, 0, 15]);
    // });
  
    // test('calculates scores correctly for three of a kind', () => {
    //   const results = [1, 1, 1, 4, 5];
    //   const scores = calculateScores(results);
    //   expect(scores).toEqual([3, 0, 0, 4, 5, 0, 12, 0, 0, 0, 0, 12]);
    // });
  
    // test('calculates scores correctly for four of a kind', () => {
    //   const results = [1, 1, 1, 1, 5];
    //   const scores = calculateScores(results);
    //   expect(scores).toEqual([4, 0, 0, 0, 5, 0, 9, 9, 0, 0, 0, 9]);
    // });
  
    // Add more tests for other conditions
  });

describe('ScoreSection', () => {
    // const mockHandleScoreSelect = jest.fn();
    // const mockResetGame = jest.fn();
  
    // const props = {
    //   diceRollResults: [1, 2, 3, 4, 5],
    //   handleScoreSelect: mockHandleScoreSelect,
    //   scores: [null, null, null, null, null, null, null, null, null, null, null, null, null],
    //   rollsLeft: 2,
    //   gameOver: false,
    //   resetGame: mockResetGame,
    // };
  
    // test('renders ScoreSection component', () => {
    //   const { getByText } = render(<ScoreSection {...props} />);
    //   expect(getByText(/Scores:/i)).toBeInTheDocument();
    // });
  
    // test('handleScoreSelect function', () => {
    //   const { getByText } = render(<ScoreSection {...props} />);
    //   const scoreButton = getByText(/Ones/i);
    //   fireEvent.click(scoreButton);
    //   expect(mockHandleScoreSelect).toHaveBeenCalledWith(1);
    // });
  
    // test('resetGame function', () => {
    //   const gameOverProps = { ...props, gameOver: true };
    //   const { getByText } = render(<ScoreSection {...gameOverProps} />);
    //   const resetButton = getByText(/Reset Game/i);
    //   fireEvent.click(resetButton);
    //   expect(mockResetGame).toHaveBeenCalled();
    // });
});