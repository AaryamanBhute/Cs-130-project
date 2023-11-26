import React, { useContext } from 'react';
import { UserContext } from './UserContext';

const Home = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div style={{ backgroundColor: 'forestgreen', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: 0 }}>Welcome to Game Guru!</h1>
      {currentUser ? (
        <p style={{ textAlign: 'center' }}>Hello, {currentUser}!</p>
      ) : (
        <p style={{ textAlign: 'center' }}>Sign up / Sign in :)</p>
      )}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <a href="/login">
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
        </a>
        
        <a href="/signup"> {}
          <button
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Signup
          </button>
        </a>
      </div>
      <p style={{ textAlign: 'center' }}>
        <a href="/chess">Chess</a> | <a href="/yahtzee">Yahtzee</a> | <a href="/mastermind">Mastermind</a>
      </p>
    </div>
  );
};

export default Home;
