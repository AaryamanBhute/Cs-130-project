import React from 'react';
import { render, screen, fireEvent, getByAltText } from '@testing-library/react';
import Yahtzee from './Yahtzee';
import '@testing-library/jest-dom';

const { calculateScores } = require('./Yahtzee');

test('calculateScores calculates scores correctly', () => {
    const results = [1, 1, 2, 3, 4]; // Sample dice roll results
    const expectedScores = [2, 2, 3, 4, 0, 0, 0, 0, 0, 30, 0, 0, 11]; // Expected scores
    const calculatedScores = calculateScores(results);  
    expect(calculatedScores).toEqual(expectedScores);
  });

describe('Yahtzee Component', () => {
    test('renders Yahtzee component correctly', () => {
        render(<Yahtzee />);
        const headingElement = screen.getByText('Yahtzee');
        expect(headingElement).toBeInTheDocument();
    });
    test('Rolling the dice updates roll count', () => {
        const { getByText } = render(<Yahtzee />);
        const rollDiceButton = getByText('Roll Dice (3 roll(s) left)');
        fireEvent.click(rollDiceButton);
        const updatedRollDiceButton = getByText('Roll Dice (2 roll(s) left)');
        expect(updatedRollDiceButton).toBeInTheDocument();
    });
    test('Rolling the dice displays the dice values', () => {
        const { getByText } = render(<Yahtzee />);
        const rollDiceButton = getByText('Roll Dice (3 roll(s) left)');
        fireEvent.click(rollDiceButton);
        const diceImages = [
            screen.getByAltText('Dice 1'),
            screen.getByAltText('Dice 2'),
            screen.getByAltText('Dice 3'),
            screen.getByAltText('Dice 4'),
            screen.getByAltText('Dice 5'),
        ];
        diceImages.forEach((diceImage) => {
            expect(diceImage).toBeInTheDocument();
        });
    });
    test('Playing a turn updates the score', () => {
        const { getByText } = render(<Yahtzee />);
        const rollDiceButton = getByText('Roll Dice (3 roll(s) left)');
        fireEvent.click(rollDiceButton);
        const chanceCategoryButton = getByText((content, element) => {
            return element.tagName.toLowerCase() === 'button' && content.includes('Chance');
        });
        fireEvent.click(chanceCategoryButton);
        const totalScoreElement = screen.getByText(/^Total Score:/);
        const totalScoreText = totalScoreElement.textContent;
        const totalScore = parseInt(totalScoreText.replace('Total Score: ', ''), 10);
        expect(totalScore).not.toBe(0);
    });    
});
