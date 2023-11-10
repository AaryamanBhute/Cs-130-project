import React, { useState } from 'react';

const GameBoard = ({ code, colors, handleColorSelection, guesses, handleGuessColor, activeRow, checkGuess }) => {
  return(
    <>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        The Code:
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        <div key={row} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        </div>
        ))}
        {activeRow <= 7 && guesses.slice(activeRow * 4, activeRow * 4 + 4).every((color) => color !== 'black') && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={checkGuess} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Check
          </button>
        </div>
        )}
    </>
  );
};

const Mastermind = () => {
  const colors = ['#FF0000', '#FF7300', '#FFe400', '#3A9A10', '#0609C4', '#8206E5'];
  const [code, setCode] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [guesses, setGuesses] = useState(Array(32).fill('black'));
  const [activeRow, setActiveRow] = useState(0);

  const generateCode = () => {
    const selectedColors = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      selectedColors.push(colors[randomIndex]);
    }
    setCode(selectedColors);
    setGameStarted(true);
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
    setCode([]);
    setGameStarted(false);
    generateCode();
    setSelectedColor(null);
    setGuesses(Array(32).fill('black'));
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
    
    console.log("Correct colors and positions:", black);
    console.log("Correct colors only:", white);

    setActiveRow(activeRow + 1);
  };

  return (
    <div style={{ backgroundColor: '#083F66', minHeight: '100vh', margin: 0 }}>
      <h1 style={{ textAlign: 'center', margin: 0 }}>Mastermind</h1>
      <p style={{ textAlign: 'center' }}>
        <a href="/" style={{ color: 'black' }}>
          Back to Home
        </a>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {!gameStarted && (
          <button onClick={generateCode} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Game
          </button>
        )}
      </div>
      {gameStarted && (
        <GameBoard
          code={code}
          colors={colors}
          handleColorSelection={handleColorSelection}
          guesses={guesses}
          handleGuessColor={handleGuessColor}
          activeRow={activeRow}
          checkGuess={checkGuess}
        />
      )}
      {activeRow === 8 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={resetGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Mastermind;
