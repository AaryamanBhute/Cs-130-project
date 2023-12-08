import React, { useState, useEffect } from 'react';

/**
 * Create home page
 * @returns {JSX.Element}
 */
const Home = () => {
  const [user, setUser] = useState();

  /**
   * Retrieves logged in user
   */
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  /**
   * Logs user out -> remove logged in user
   */
  const handleLogout = () => {
    // perform logout actions - clear user state and local storage
    setUser(null);
    localStorage.removeItem('username');
  };

  return (
    <div style={{ backgroundColor: '#e2d0f3', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: 0, paddingTop: '50px' }}>Welcome to Game Guru!</h1>
      {user ? (
        <>
          <p style={{ textAlign: 'center' }}>Hello, {user}! Pick a game:</p>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Sign up / Sign in :)</p>
      )}
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
      <a href="/dashboard">
        <button
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          View Player Stats
        </button>
        </a>
      </div>
      {!user && (
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

          <a href="/signup">
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
      )}
      {user && (
        <div>
          <p style={{ textAlign: 'center' }}>
            <a href="/chess">Chess</a> | <a href="/yahtzee">Yahtzee</a> | <a href="/mastermind">Mastermind</a>
          </p>
          <p style={{ textAlign: 'center' }}>
            <img
              src={require('./assets/wking.png')}
              style={{
                width: '50px',
                height: '50px',
                margin: '10px'
              }}
              alt="King"
            />
            <img
              src={require('./assets/5.png')}
              style={{
                width: '50px',
                height: '50px',
                margin: '10px',
                borderRadius: '25%',
                clipPath: `inset(2px)`
              }}
              alt="Dice"
            />
            <div
              style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                backgroundColor: 'black',
                borderRadius: '50%',
                margin: '10px'
              }}
            />
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
