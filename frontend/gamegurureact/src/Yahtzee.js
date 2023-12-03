import React, { useState, useEffect } from 'react';

import axios from 'axios';
import ChatBot from './ChatBot';

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

  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [user, setUser] = useState();
  const [errorMessage, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(0);


  const startTimer = () => {
    setStartTime(Date.now());
    const id = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    startTimer();
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);
  

  useEffect(() => {
    if (gameOver) {
      postStatistic();
    }
  }, [gameOver]);
  

  const postStatistic = async () => {
    try {
      const game = 'yahtzee';
      const timePlayed = Math.floor(timer);
      const response = await axios.post(`http://127.0.0.1:8000/create-statistic/?gameType=${game}`, {
        username: user,
        timePlayed,
        result: result,
      });
      console.log(response.data);
      stopTimer(); // Stop the timer after sending the statistic
    } catch (error) {
      setError(error.toString());
      console.error('Error creating statistic for user:', error);
      stopTimer(); // Stop the timer in case of an error
    }
  };

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

    const totalScore = newScores.reduce((acc, curr) => acc + (curr || 0), 0);
    setResult(totalScore);

    if (!newScores.some((score) => score === null)) {
      setGameOver(true);
    }
  };

  return (
    <div style={{ backgroundColor: '#FADADD', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: 0, paddingTop: '50px' }}>Yahtzee</h1>
      <p style={{ textAlign: 'center' }}>
        <a href="/" style={{ color: 'black' }}>
          Back to Home
        </a>
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={rollDice} disabled={rollsLeft === 0 || gameOver} style={{cursor: 'pointer'}}>
          {rollsLeft > 0 ? `Roll Dice (${rollsLeft} roll(s) left)` : 'No more rolls left'}
        </button>
      </div>
      {diceRollResults.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>You rolled:</p>
          <div>
            {diceRollResults.map((result, index) => (
              <img
                key={index}
                src={require(`./DicePics/${result}.png`)}
                alt={`Dice ${index + 1}`}
                style={{
                  width: '50px',
                  height: '50px',
                  margin: '10px',
                  cursor: rollsLeft > 0 ? 'pointer' : 'default',
                  opacity: rollsLeft > 0 ?
                    !selectedDice.includes(index + 1)? '1' : '0.75'
                  : 0.5,
                  borderRadius: '25%',
                  clipPath: `inset(2px)`,
                }}
                onClick={() => rollsLeft > 0 && handleSelection(index + 1)}
              />
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
      <ChatBot page="Yahtzee"/>
    </div>
  );
};

const ScoreSection = ({ diceRollResults, handleScoreSelect, scores, rollsLeft, gameOver, resetGame }) => {
  const canSelect = rollsLeft < 3;
  const tempScores = calculateScores(diceRollResults);
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
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <p>Scores:</p>
      {categories.map((category, index) => (
        <React.Fragment key={category}>
        <button
          key={category}
          onClick={() => handleScoreSelect(index + 1)}
          disabled={!canSelect || scores[index] !== null}
          style={{
            cursor: (!canSelect || scores[index] !== null) ? 'default' : 'pointer',
            backgroundColor: scores[index] !== null ? 'lightgray' : '',
            opacity: scores[index] !== null ? 0.7 : 1
          }}
        >
          {`${category} = ${scores[index] !== null ? scores[index] : tempScores[index]}`}
        </button>
        {index === 5 && <div style={{ height: '10px' }} />}
        </React.Fragment>
      ))}
      <p>Upper Score: {upperBonus === 35 ? `${upperScore} (+35)` : upperScore}</p>
      <p>Lower Score: {totalScore-upperScore-upperBonus}</p>
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
