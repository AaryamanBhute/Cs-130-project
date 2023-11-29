import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  var errorMessage = false;

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
        localStorage.setItem('username', username)
        // redirect to home page after successful signup
        navigate('/');
      }
      else {
        errorMessage = String(response.data);
      }
      try {
        const response = await axios.post('http://127.0.0.1:8000/create-statistic/', {
          username: username,
        });
  
        console.log(response.data);
      } catch (error) {
        console.error('Error creating statistic for user:', error);
      }

    } catch (error) {
      console.error('Error signing up:', error);
      errorMessage = 'Error signing up: ' + String(error);
    }

    //this can be done better later on, like once a user finishes a game this is triggered


  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', backgroundColor: '#a4bdbb', height: '100vh'}}>
      <div className="loginBox" style={{gap: '20px', backgroundColor: '#88aab5', margin: '150px', padding: '50px'}}>
      <h2 style={{marginTop: '0px', paddingTop: '20px', font:'bold 50px Arial', textAlign: 'center'}}>Register for GameGuru!</h2>
      <form onSubmit={handleSignup} style={{justifyContent: 'center', background: '#a4bdbb', border: '10px solid rgba(122, 163, 157, .5)'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{justifyContent: 'center', marginTop: '0px', paddingTop: '5px', font:'15px Arial', textAlign: 'center', color: 'black', background: 'aliceblue', margin: '2px'}}
        />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{justifyContent: 'center', marginTop: '0px', paddingTop: '5px', font:'15px Arial', textAlign: 'center', color: 'black', background: 'aliceblue', margin: '8px'}}
        />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <button type="submit">Sign up</button>
        </div>
      </form>
      {errorMessage!=false ? (
        <p style={{ textAlign: 'center' }}>Error: {errorMessage}!</p>
      ) : (<></>)}
      </div>
    </div>
  );
};

export default Signup;
