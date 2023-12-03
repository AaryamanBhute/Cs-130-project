import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
import axios from 'axios';

const GameBoard = ({ colors, handleColorSelection, guesses, handleGuessColor, activeRow, feedback, checkGuess, code, gameResult }) => {
  return(
    <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        Your Options:
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {colors.map((color, index) => (
            <div
            key={index}
            style={{
                width: '20px',
                height: '20px',
                backgroundColor: color,
                borderRadius: '50%',
                margin: '10px',
                cursor: 'pointer'
            }}
            onClick={() => handleColorSelection(color)}
            />
        ))}
        </div>
        {Array.from({ length: 8 }, (_, i) => i).map((row) => (
        <div key={row} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          {guesses.slice(row * 4, row * 4 + 4).map((color, index) => (
          <div
            key={index}
            style={{
            width: '20px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '50%',
            margin: '10px',
            cursor: 'pointer'
            }}
            onClick={() => handleGuessColor(row * 4 + index)}
          />
          ))}
          <div style={{ display: 'flex', marginLeft: '5px', marginTop: '5px' }}>
            {Array.from({ length: 2 }, (_, dotIndex) => (
              <div key={dotIndex}>
                {Array.from({ length: 2 }, (_, colIndex) => (
                  <div key={colIndex}>
                    {(
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor:
                            feedback[row * 4 + colIndex * 2 + dotIndex] === 'black'
                              ? 'black'
                              : feedback[row * 4 + colIndex * 2 + dotIndex] === 'white'
                              ? 'white'
                              : 'gray',
                          borderRadius: '50%',
                          margin: '3px'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        ))}
        {activeRow <= 7 && gameResult === "IP" && guesses.slice(activeRow * 4, activeRow * 4 + 4).every((color) => color !== 'black') && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={checkGuess} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Check
          </button>
        </div>
        )}
        {gameResult === "WIN" && (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        You Won!
        </div>)}
        {gameResult === "LOSS" && (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        You Lost! The Code Was:
        </div>)}
        {gameResult === "LOSS" && (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {code.map((color, index) => (
            <div
            key={index}
            style={{
                width: '20px',
                height: '20px',
                backgroundColor: color,
                borderRadius: '50%',
                margin: '10px'
            }}
            />
        ))}
        </div>)}
    </>
  );
};

const Mastermind = () => {
  const colors = ['#FF0000', '#FF7300', '#FFe400', '#3A9A10', '#0609C4', '#8206E5'];
  const [code, setCode] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState("IP");
  const [selectedColor, setSelectedColor] = useState(null);
  const [guesses, setGuesses] = useState(Array(32).fill('black'));
  const [feedback, setFeedback] = useState(Array(32).fill('gray'));
  const [activeRow, setActiveRow] = useState(0);

  const [user, setUser] = useState();
  const [errorMessage, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const startTimer = () => {
    setStartTime(Date.now());
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    return intervalId;
  };

  const stopTimer = (intervalId) => {
    clearInterval(intervalId);
  };

  const initSetup = () => {
    const id = startTimer();
    setIntervalId(id);
    generateCode();
    setGameStarted(true);
  }

  const postStatistic = async (intervalId, winOrLoss) => {
    try {
      const game = "mastermind";
      const timePlayed = Math.floor(timer);
      console.log(gameResult);
      console.log(winOrLoss);
      console.log("bruv");
      const response = await axios.post(`http://127.0.0.1:8000/create-statistic/?gameType=${game}`, {
        username: user,
        timePlayed,
        result: winOrLoss,
      });
  
      console.log(response.data);
      stopTimer(intervalId); // Stop the timer after sending the statistic

    } catch (error) {
      setError(error.toString());
      console.error('Error creating statistic for user:', error);
      stopTimer(intervalId); // Stop the timer in case of an error
    }
  };

  const generateCode = () => {
    const selectedColors = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      selectedColors.push(colors[randomIndex]);
    }
    setCode(selectedColors);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleGuessColor = (index) => {
    const row = Math.floor(index / 4);
    if (selectedColor && row === activeRow) {
      const updatedGuesses = [...guesses];
      updatedGuesses[index] = selectedColor;
      setGuesses(updatedGuesses);
    }
  };

  const resetGame = () => {
    generateCode();
    setGameResult("IP");
    setSelectedColor(null);
    setGuesses(Array(32).fill('black'));
    setFeedback(Array(32).fill('gray'));
    setActiveRow(0);
  };

  const checkGuess = () => {
    const currRow = guesses.slice(activeRow * 4, activeRow * 4 + 4);
    let black = 0; // color and pos
    let white = 0; // just color
    const codeCopy = [...code];
    for (let i = 0; i < 4; i++) {
        if (currRow[i] === code[i]) {
            black++;
            codeCopy[i] = null;
        }
    }
    for (let i = 0; i < 4; i++) {
        if (currRow[i] !== code[i] && codeCopy.includes(currRow[i])) {
            white++;
            const index = codeCopy.indexOf(currRow[i]);
            codeCopy[index] = null;
        }
    }
    
    const feedbackRow = Array(black).fill('black').concat(Array(white).fill('white')).concat(Array(4 - black - white).fill('gray'));
    setFeedback((prevFeedback) => {
      const newFeedback = [...prevFeedback];
      newFeedback.splice(activeRow * 4, 4, ...feedbackRow);
      return newFeedback;
    });

    if (black === 4) {
      setGameResult("WIN");
      postStatistic(intervalId, true);
    } else {
      if (activeRow === 7) {
        setGameResult("LOSS");
        postStatistic(intervalId, false);
      }
      setActiveRow(activeRow + 1);
    }
  };

  return (
    <div style={{ backgroundColor: '#0b5c95', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: 0, paddingTop: '50px' }}>Mastermind</h1>
      <p style={{ textAlign: 'center' }}>
        <a href="/" style={{ color: 'black' }}>
          Back to Home
        </a>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!gameStarted && (
          <button onClick={initSetup} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Game
          </button>
        )}
      </div>
      {gameStarted && (
        <GameBoard
          colors={colors}
          handleColorSelection={handleColorSelection}
          guesses={guesses}
          handleGuessColor={handleGuessColor}
          activeRow={activeRow}
          feedback={feedback}
          checkGuess={checkGuess}
          code={code}
          gameResult={gameResult}
        />
      )}
      {(activeRow === 8 || gameResult !== "IP") && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={resetGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Play Again
          </button>
        </div>
      )}
      <ChatBot page="Mastermind"/>
    </div>
  );
};

export default Mastermind;
