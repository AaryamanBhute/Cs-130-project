import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Chessboard from './Chess/Chessboard';
import Yahtzee from './Yahtzee';
import Mastermind from './Mastermind';
import Signup from './Signup';
import Login from './Login';
import ChangePwd from './ChangePwd';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
        <div>
          <Routes>
            <Route path="/chess" element={<Chessboard />} />
            <Route path="/yahtzee" element={<Yahtzee />} />
            <Route path="/mastermind" element={<Mastermind />} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element= {<Login />} />
            <Route path="/reset-password" element={<ChangePwd />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
