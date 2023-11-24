import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../css/Loginpage.css'

const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      'http://localhost:3005/users/login',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const Loginpage = ({ setUserToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser({
        username,
        password,
      });

      console.log('User data:', userData);
      setUserToken(userData.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="username">
            <p>Username</p>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          
        </div>
        <div>
          <label htmlFor="password">
            <p>Password</p>
            <input
              type="password"
              id="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

Loginpage.propTypes = {
  setUserToken: PropTypes.func.isRequired,
};

export default Loginpage;
