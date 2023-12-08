import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


/**
 * Signup component handles user registration.
 * Allows users to sign up for GameGuru by providing username, email, and password.
 * @returns {JSX.Element} Signup form and error message (if any) displayed in the UI.
 */
const Signup = () => {
  // State variables to store user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setError] = useState('');

  /**
   * Handles the signup form submission.
   * Makes a POST request to the server to sign up the user.
   * If successful, sets the current user in local storage and navigates to the home page.
   * Additionally, creates statistics for the new user.
   * @param {Event} e - Form submission event
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/signup/', {
        username: username,
        email: email,
        password: password,
      });

      console.log(response.data);

      if (response.status === 201) {
        // set the current user in the context after successful signup
        localStorage.setItem('username', username)
        // redirect to home page after successful signup
        navigate('/');
        //set stats for new user
        try {
          const response = await axios.post('http://127.0.0.1:8000/create-statistic/', {
            username: username,
          });
    
          console.log(response.data);
        } catch (error) {
          setError(error.toString())
          console.error('Error creating statistic for user:', error);
        }
      }
      else {
        console.log(response.data.error);
        setError(response.data.error);
      }
    } catch (error) {
      setError(error.toString());
      console.error('Error signing up:', error);
    }
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
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{justifyContent: 'center', marginTop: '0px', paddingTop: '5px', font:'15px Arial', textAlign: 'center', color: 'black', background: 'aliceblue', margin: '8px'}}
        />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{justifyContent: 'center', marginTop: '0px', paddingTop: '5px', font:'15px Arial', textAlign: 'center', color: 'black', background: 'aliceblue', margin: '4px'}}
        />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <button type="submit">Sign up</button>
        </div>
      </form>
        <h2 style={{textAlign: 'center'}}>Already have an account?</h2>
      <a href="/login" style={{display: 'flex', justifyContent: 'center'}}>
        <button type="submit">Login</button>
      </a>
      <div>
      {errorMessage && (
        <p style={{ textAlign: 'center' }}>Error: {errorMessage.toString()}!</p>
      )}
      </div>
      </div>
    </div>
  );
};

export default Signup;
