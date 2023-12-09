import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Returns log in page
 * @returns {JSX.Element}
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setError] = useState('');

  /**
   * authenticate user's credentials through an axios call to the database
   * @param {*} e - event, triggered when login button clicked
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/authenticate-user/', {
        username: username,
        password: password,
      });

      console.log(response.data);

      if (response.status === 201) {
        // set the current user in the context after successful login
        localStorage.setItem('username', username)        // redirect to home page after successful login
        navigate('/');
      }
      else {
        setError(response.data.error);
        console.log(response.data);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.toString());
      //will display error message
    }

    try {
      await axios.get('http://127.0.0.1:8000/get-user-session/');
    }
    catch (err) {
      setError(err.toString());
      console.error("error");
    }


  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', backgroundColor: '#a4bdbb', height: '100vh'}}>
      <div className="loginBox" style={{gap: '20px', backgroundColor: '#88aab5', margin: '150px', padding: '50px'}}>
      <h2 style={{marginTop: '0px', paddingTop: '20px', font:'bold 50px Arial', textAlign: 'center'}}>GameGuru Login</h2>
      <form onSubmit={handleLogin} style={{justifyContent: 'center', background: '#a4bdbb', border: '10px solid rgba(122, 163, 157, .5)'}}>
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
        <button type="submit">Login</button>
        </div>
      </form>
      <h2 style={{textAlign: 'center'}}>First time user?</h2>
      <a href="/signup" style={{display: 'flex', justifyContent: 'center'}}>
        <button type="submit">Create New Account</button>
      </a>
      <h2 style={{textAlign: 'center'}}>Forgot your password?</h2>
      <a href='/reset-password' style={{display: 'flex', justifyContent: 'center'}}>
        <button type="submit">Reset Password</button>
      </a>
      {errorMessage && (
        <p style={{ textAlign: 'center' }}>Error: {errorMessage.toString()}!</p>
      )}
      </div>
    </div>
  );
};

export default Login;
