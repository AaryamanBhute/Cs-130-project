import React, { useState, useEffect } from 'react';

const Home = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    // Perform logout actions - clear user state and local storage
    setUser(null);
    localStorage.removeItem('username');
  };

  return (
    <div style={{ backgroundColor: 'forestgreen', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: 0 }}>Welcome to Game Guru!</h1>
      {user ? (
        <>
          <p style={{ textAlign: 'center' }}>Hello, {user}!</p>
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
      <p style={{ textAlign: 'center' }}>
        <a href="/chess">Chess</a> | <a href="/yahtzee">Yahtzee</a> | <a href="/mastermind">Mastermind</a>
      </p>
    </div>
  );
};

export default Home;
