import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
const axios = require('axios');

/**
 * Calculates scores based on given dice roll results.
 * @param {number[]} results - An array of dice roll results (numbers 1-6).
 * @returns {number[]} - An array containing scores for different categories, in indices 0 thru 12
 */
export const calculateScores = (results) => {
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

/**
 * Represents the Yahtzee game component.
 * @component
 * @returns {JSX.Element} The Yahtzee game interface.
 */
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

  /**
   * Starts a timer by setting the start time and incrementing the timer every second.
   */
  const startTimer = () => {
    setStartTime(Date.now());
    const id = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    setIntervalId(id);
  };

  /**
   * Stops the running timer.
   */
  const stopTimer = () => {
    clearInterval(intervalId);
  };

  /**
   * Runs on component mount to initialize a timer and retrieve logged-in user data from local storage.
   */
  useEffect(() => {
    startTimer();
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  /**
   * Executes the postStatistic function when the 'gameOver' state changes.
   * If the game is over, it posts the game statistics.
   */
  useEffect(() => {
    if (gameOver) {
      postStatistic();
    }
  }, [gameOver]);
  

  /**
   * Sends relevant game information to the backend for statistics asynchronously.
   * Stops the timer after sending the statistic or in case of an error.
   * @async
   * @throws {Error} When post request fails
   */
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

  /**
   * Simulates rolling dice and updates the dice roll results and remaining rolls.
   */
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

  /**
   * Handles the selection (lock/unlock) of a dice.
   * @param {number} diceIndex - Index of the dice to be selected/unselected.
   */
  const handleSelection = (diceIndex) => {
    if (selectedDice.includes(diceIndex)) {
      setSelectedDice(selectedDice.filter((dice) => dice !== diceIndex));
    } else {
      setSelectedDice([...selectedDice, diceIndex]);
    }
  };

  /**
   * Resets the turn by clearing dice results, resetting roll counts, and deselecting dice.
   */
  const resetTurn = () => {
    setDiceRollResults([]);
    setRollsLeft(3);
    setSelectedDice([]);
  }

  /**
   * Resets the entire game by resetting the turn, scores, and game-over state.
   */
  const resetGame = () => {
    resetTurn();
    setScores(Array(13).fill(null));
    setGameOver(false);
  };

  /**
   * Handles the selection of a score category and calculates scores.
   * Updates scores, resets the turn, calculates the total score, and checks for game completion.
   * @param {number} number - The selected score category (1-13).
   */
  const handleScoreSelect = (number) => {
    const newScores = [...scores];
    newScores[number - 1] = calculateScores(diceRollResults)[number-1];
    setScores(newScores);
    resetTurn();

    const totalScore = newScores.reduce((acc, curr) => acc + (curr || 0), 0);
    let sum = 0;
    for (let i = 0; i < 6; i++) {
      sum += newScores[i];
    }
    if (sum >= 63) {
      setResult(totalScore+35);
    } else {
      setResult(totalScore);
    }

    if (!newScores.some((score) => score === null)) {
      setGameOver(true);
    }
  };

  /**
   * Renders the Yahtzee game interface.
   * @returns {JSX.Element} JSX representing the Yahtzee game interface.
   */
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
      {diceRollResults.length > 0 && ( // after roll, display dice images
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>You rolled:</p>
          <div>
            {diceRollResults.map((result, index) => (
              <img
                key={index}
                src={require(`./assets/${result}.png`)}
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
      <ScoreSection // show scores
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

/**
 * Represents the section displaying scores and categories in the Yahtzee game.
 * @param {number[]} diceRollResults - Results of the dice roll.
 * @param {Function} handleScoreSelect - Function to handle score selection.
 * @param {number[]} scores - Array of scores for different categories.
 * @param {number} rollsLeft - Number of rolls left.
 * @param {boolean} gameOver - Indicates if the game is over.
 * @param {Function} resetGame - Function to reset the game.
 * @returns {JSX.Element} JSX representing the score section in the Yahtzee game.
 */
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
