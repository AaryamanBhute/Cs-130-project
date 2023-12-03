import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [statistics, setStatistics] = useState([]);
  const [error, setError] = useState('');

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-user-statistics/?username=${username}`);
      if (response.data.statistics && response.data.statistics.length > 0) {
        setStatistics(response.data.statistics);
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

  const handleSearch = () => {
    if (username) {
      fetchStatistics();
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px' }}>Search for User Stats</h1>
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
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Statistics for {username}</h2>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            {statistics.map((stat, index) => (
              <li key={index} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <p style={{ margin: '5px 0' }}>Game Type: {stat.gameType}</p>
                <p style={{ margin: '5px 0' }}>Games Played: {stat.gamesPlayed}</p>
                <p style={{ margin: '5px 0' }}>Games Won: {stat.gamesWon}</p>
                <p style={{ margin: '5px 0' }}>Time Played: {stat.timePlayed}</p>
                <p style={{ margin: '5px 0' }}>Chat History: {stat.chatHistory}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
