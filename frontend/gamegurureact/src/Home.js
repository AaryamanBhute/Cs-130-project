import React from 'react';

const Home = () => {
  return (
    <div style={{ backgroundColor: 'forestgreen', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: 0 }}>Welcome to Game Guru!</h1>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>
      <p style={{ textAlign: 'center' }}>
        <a href="/chess">Chess</a> | <a href="/yahtzee">Yahtzee</a> | <a href="/mastermind">Mastermind</a>
      </p>
    </div>
  );
};

export default Home;
