import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

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
        setCurrentUser(username);
        // redirect to home page after successful login
        navigate('/');
      }

      try {
        await axios.get('http://127.0.0.1:8000/get-user-session/');
      }
      catch (err) {
        console.error("error");
      }

    } catch (error) {
      console.error('Error logging in:', error);
      //redirect to sign up page
      navigate('/signup');
    }
  };

  const handleChangePwd = async (e) => {    
    e.preventDefault();
    //assumes that the new pwd is entered in pwd spot for login (fix later)
    try {
      const response = await axios.post('http://127.0.0.1:8000/change-pwd/', {
        username: username,
        new_password: password,
      });

      console.log(response.data);

      if (response.status === 201) {
        // set the current user in the context after successful login
        setCurrentUser(username);
        // redirect to home page after successful login
        navigate('/');
      }

    } catch (error) {
      console.error('Error logging in:', error);
      //redirect to sign up page
      navigate('/signup');
    }};


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <h2>Forgot your password?</h2>
      <form onSubmit={handleChangePwd}>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default Login;
