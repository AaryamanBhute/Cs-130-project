import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import Chess from './Chess';
import Yahtzee from './Yahtzee';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/chess" element={<Chess />} />
          <Route path="/yahtzee" element={<Yahtzee />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
