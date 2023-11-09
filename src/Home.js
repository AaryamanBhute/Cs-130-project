import React from 'react';

const Home = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Home Page</h1>
      <p style={{ textAlign: 'center' }}>
        <a href="/chess">Chess</a> | <a href="/yahtzee">Yahtzee</a>
      </p>
    </div>
  );
};

export default Home;
