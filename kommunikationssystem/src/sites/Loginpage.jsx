import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const uri = 'http://localhost:3005/users';

  const [formData, setFormData] = useState({
    username: '',
    eMail: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(uri, formData);
      console.log('User data sent successfully:', response.data);
      // Add any additional logic you need after successful form submission
    } catch (error) {
      console.error('Error sending user data:', error.message);
      // Handle error (display an error message, etc.)
    }
  };

  return (
    <>
      <div className='login-wrapper'>
        <h1>Please Log In</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" name='username' value={formData.username} onChange={handleChange} />
          </label>
          <label>
            <p>E-Mail</p>
            <input type="email" name='email' value={formData.email} onChange={handleChange} />
          </label>
          <label>
            <p>Password</p>
            <input type="password" name='password' value={formData.password} onChange={handleChange} />
          </label>
          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
