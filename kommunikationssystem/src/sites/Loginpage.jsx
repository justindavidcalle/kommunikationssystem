import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:3005/users/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Assuming the server responds with a token or user data
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
      // Send user credentials to the server for authentication
      const userData = await loginUser({
        username,
        password
      });

      // Log the user data to check the response from the server
      console.log('User data:', userData);

      // Assuming the server responds with a token or user data
      // Set the user token or user data in the parent component
      setUserToken(userData.token); // Adjust this based on the actual response structure

    } catch (error) {
      // Handle authentication errors
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" value={password} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
};

// Define PropTypes for the Loginpage component
Loginpage.propTypes = {
  setUserToken: PropTypes.func.isRequired, // setUserToken should be a required function
};

export default Loginpage;
