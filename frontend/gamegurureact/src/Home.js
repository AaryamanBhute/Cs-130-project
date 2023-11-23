import React from 'react';

const Home = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Home Page</h1>
      <a href="/signup"> {/* Link to Signup */}
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
      <p style={{ textAlign: 'center' }}>
        <a href="/chess">Chess</a> | <a href="/yahtzee">Yahtzee</a>
      </p>
    </div>
  );
};

export default Home;
