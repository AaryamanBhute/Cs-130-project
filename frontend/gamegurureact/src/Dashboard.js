import React, { useState, useEffect } from 'react';
import axios from 'axios';


/**
 * Dashboard component displays user statistics and provides functionality to view statistics of other users.
 */
const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [statistics, setStatistics] = useState([]);
  const [currStatistics, setCurrStats] = useState([]);
  const [error, setError] = useState('');
  const [currError, setCurrError] = useState('');
  const [currUser, setUser] = useState();
  const [displayUser, setDisplay] = useState();

  // Effect hook to retrieve the logged-in user from local storage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  /**
   * Fetches statistics for the currently logged-in user.
   */
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-user-statistics/?username=${currUser}`);
      if (response.data.statistics && response.data.statistics.length > 0) {
        setStatistics(response.data.statistics);
        setDisplay(currUser);
        setError('');
      } else {
        setStatistics([]);
        setError('No user found');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics([]);
      setError(`User "${currUser}" not found`);
    }
  }

  /**
   * Fetches statistics for the user specified by the 'username' state.
   */
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-user-statistics/?username=${username}`);
      if (response.data.statistics && response.data.statistics.length > 0) {
        setStatistics(response.data.statistics);
        setDisplay(username);
        setError('');
      } else {
        setStatistics([]);
        setError('No user found');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics([]);
      setError(`User "${username}" not found`);
    }
  };  

  /**
   * Handles the search action when a username is entered.
   * Triggers the fetchStatistics function.
   */
  const handleSearch = () => {
    if (username) {
      fetchStatistics();
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <a href="/">Back to Home</a>
      </div>
      {currUser ? (<h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px' }}>{currUser}, view your current statistics</h1>)
      : (<h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px' }}>Log in to view your current statistics</h1>)}
      <div style={{ display: 'flex', justifyContent:'center', marginBottom: '20px'}}>
        <button onClick={fetchUserStats} style={{ textAlign: 'center', alignItems: 'center', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Go</button>
      </div>

      <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px' }}>View another user's stats</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', marginRight: '10px', flex: '1' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Search
        </button>
      </div>
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      {statistics && statistics.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Statistics for {displayUser}</h2>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            {statistics.map((stat, index) => (
              <li key={index} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2 style={{margin: '5px 0' }}>{stat.gameType}</h2>
                <p style={{ margin: '5px 0' }}>Games Played: {stat.gamesPlayed}</p>
                {stat.gameType === 'yahtzee' ? (<p style={{ margin: '5px 0' }}>High Score: {stat.gamesWon}</p>) : (<p style={{ margin: '5px 0' }}>Games Won: {stat.gamesWon}</p>)}
                <p style={{ margin: '5px 0' }}>Time Played: {stat.timePlayed} seconds</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
