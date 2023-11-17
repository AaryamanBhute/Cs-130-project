import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Chessboard from './Chess/Chessboard';
import Yahtzee from './Yahtzee';
import Mastermind from './Mastermind';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/chess" element={<Chessboard />} />
          <Route path="/yahtzee" element={<Yahtzee />} />
          <Route path="/mastermind" element={<Mastermind />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
