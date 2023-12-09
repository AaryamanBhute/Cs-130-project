import React from 'react';
import { render, screen } from '@testing-library/react';
import Yahtzee from './Yahtzee';
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
  });
});
