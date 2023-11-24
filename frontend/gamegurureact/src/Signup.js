import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/signup/', {
        username: username,
        password: password,
      });

      console.log(response.data);

      if (response.status === 201) {
        // set the current user in the context after successful signup
        setCurrentUser(username);
        // redirect to home page after successful signup
        navigate('/');
      }

    } catch (error) {
      console.error('Error signing up:', error);
    }

    //this can be done better later on, like once a user finishes a game this is triggered
    try {
        const response = await axios.post('http://127.0.0.1:8000/create-statistic/', {
          username: username,
        });
  
        console.log(response.data);
      } catch (error) {
        console.error('Error creating statistic for user:', error);
      }


  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
