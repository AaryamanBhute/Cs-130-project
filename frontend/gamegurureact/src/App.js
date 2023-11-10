import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Chess from './Chess';
import Yahtzee from './Yahtzee';
import Mastermind from './Mastermind';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/chess" element={<Chess />} />
          <Route path="/yahtzee" element={<Yahtzee />} />
          <Route path="/mastermind" element={<Mastermind />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
