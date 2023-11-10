import React, { useState } from 'react';

const calculateScores = (results) => {
  const sortedResults = [...results].sort();
  const counts = {};
  sortedResults.forEach((val) => {
    counts[val] = counts[val] ? counts[val] + 1 : 1;
  });
  const values = Object.values(counts);
  const scoreArray = [];

  for (let i = 1; i <= 6; i++) {
    scoreArray.push(sortedResults.filter((val) => val === i).length * i);
  }

  const toakScore = values.some((count) => count >= 3)
    ? sortedResults.reduce((total, val) => total + val, 0)
    : 0;
  scoreArray.push(toakScore);

  const foakScore = values.some((count) => count >= 4)
    ? sortedResults.reduce((total, val) => total + val, 0)
    : 0;
  scoreArray.push(foakScore);

  const fhScore = values.includes(2) && values.includes(3)
    ? 25
    : 0;
  scoreArray.push(fhScore);

  const ssScore = sortedResults.includes(3) && sortedResults.includes(4) && ((sortedResults.includes(1) && sortedResults.includes(2)) || (sortedResults.includes(2) && sortedResults.includes(5)) || (sortedResults.includes(5) && sortedResults.includes(6)))
    ? 30
    : 0;
  scoreArray.push(ssScore);

  const lsScore = sortedResults.includes(2) && sortedResults.includes(3) && sortedResults.includes(4) && sortedResults.includes(5) && (sortedResults.includes(1) || sortedResults.includes(6))
    ? 40
    : 0;
  scoreArray.push(lsScore);

  const yahtzeeScore = sortedResults.every((result) => result === results[0]) && results[0]
    ? 50
    : 0;
  scoreArray.push(yahtzeeScore);

  const chanceScore = sortedResults.reduce((total, val) => total + val, 0);
  scoreArray.push(chanceScore);
  
  return scoreArray;
};

const Yahtzee = () => {
  const [diceRollResults, setDiceRollResults] = useState([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [selectedDice, setSelectedDice] = useState([]);
  const [scores, setScores] = useState(Array(13).fill(null));
  const [gameOver, setGameOver] = useState(false);

  const rollDice = () => {
    if (rollsLeft > 0) {
      let results = [];
      for (let i = 0; i < 5; i++) {
        if (!selectedDice.includes(i + 1)) {
          const result = Math.floor(Math.random() * 6) + 1;
          results.push(result);
        } else {
          results.push(diceRollResults[i]);
        }
      }
      setDiceRollResults(results);
      setRollsLeft(rollsLeft - 1);
    }
  };

  const handleSelection = (diceIndex) => {
    if (selectedDice.includes(diceIndex)) {
      setSelectedDice(selectedDice.filter((dice) => dice !== diceIndex));
    } else {
      setSelectedDice([...selectedDice, diceIndex]);
    }
  };

  const resetTurn = () => {
    setDiceRollResults([]);
    setRollsLeft(3);
    setSelectedDice([]);
  }

  const resetGame = () => {
    resetTurn();
    setScores(Array(13).fill(null));
    setGameOver(false);
  };

  const handleScoreSelect = (number) => {
    const newScores = [...scores];
    newScores[number - 1] = calculateScores(diceRollResults)[number-1];
    setScores(newScores);
    resetTurn();

    if (!newScores.some((score) => score === null)) {
      setGameOver(true);
    }
  };

  return (
    <div style={{ backgroundColor: '#FADADD', minHeight: '100vh', margin: 0 }}>
      <h1 style={{ textAlign: 'center', margin: 0 }}>Yahtzee</h1>
      <p style={{ textAlign: 'center' }}>
        <a href="/" style={{ color: 'black' }}>
          Back to Home
        </a>
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={rollDice} disabled={rollsLeft === 0 || gameOver}>
          {rollsLeft > 0 ? `Roll Dice (${rollsLeft} roll(s) left)` : 'No more rolls left'}
        </button>
      </div>
      {diceRollResults.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>You rolled:</p>
          <div>
            {diceRollResults.map((result, index) => (
              <button
                key={index}
                style={{
                  margin: '10px',
                  background: selectedDice.includes(index + 1) ? 'lightblue' : 'transparent',
                }}
                onClick={() => handleSelection(index + 1)}
                disabled={rollsLeft === 0}
              >
                {`Dice ${index + 1}: ${result}`}
              </button>
            ))}
          </div>
        </div>
      )}
      <ScoreSection
        diceRollResults={diceRollResults}
        handleScoreSelect={handleScoreSelect}
        scores={scores}
        rollsLeft={rollsLeft}
        gameOver={gameOver}
        resetGame={resetGame}
      />
    </div>
  );
};

const ScoreSection = ({ diceRollResults, handleScoreSelect, scores, rollsLeft, gameOver, resetGame }) => {
  const canSelect = rollsLeft < 3;
  const allScores = calculateScores(diceRollResults);
  const upperScore = scores.slice(0, 6).reduce((acc, curr) => acc + (curr || 0), 0);
  const upperBonus = upperScore >= 63 ? 35 : 0;
  const totalScore = scores.reduce((acc, curr) => acc + (curr || 0), 0) + upperBonus;

  const categories = [
    'Ones',
    'Twos',
    'Threes',
    'Fours',
    'Fives',
    'Sixes',
    'Three of a Kind',
    'Four of a Kind',
    'Full House',
    'Small Straight',
    'Large Straight',
    'Yahtzee',
    'Chance',
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <p>Scores:</p>
      {categories.map((category, index) => (
        <button
          key={category}
          onClick={() => handleScoreSelect(index + 1)}
          disabled={!canSelect || scores[index] !== null}
        >
          {`${category} = ${scores[index] !== null ? scores[index] : allScores[index]}`}
        </button>
      ))}
      <p>Total Score: {totalScore}</p>
      {gameOver && (
        <div>
          <p>Game Over!</p>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      )}
    </div>
  );
};

export default Yahtzee;
