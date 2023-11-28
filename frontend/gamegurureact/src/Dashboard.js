import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [statistics, setStatistics] = useState([]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-user-statistics/?username=${username}`);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };  

  const handleSearch = () => {
    if (username) {
      fetchStatistics();
    }
  };

  return (
    <div>
      <h1>Search for User</h1>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {statistics && (
        <div>
          <h2>Statistics for {username}</h2>
          <ul>
            {statistics.map((stat, index) => (
              <li key={index}>
                <p>Game Type: {stat.gameType}</p>
                <p>Games Played: {stat.gamesPlayed}</p>
                <p>Games Won: {stat.gamesWon}</p>
                <p>Time Played: {stat.timePlayed}</p>
                <p>Chat History: {stat.chatHistory}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
