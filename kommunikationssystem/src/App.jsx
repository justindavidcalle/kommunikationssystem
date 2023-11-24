import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './sites/Home';
import Registerpage from './sites/Registerpage';
import Loginpage from './sites/Loginpage';
// App.js

function App() {
  const storedToken = JSON.parse(sessionStorage.getItem('token'));
  const [userToken, setUserToken] = useState(storedToken);

  useEffect(() => {
    if (storedToken) {
      console.log('User is logged in. Token:', storedToken);
    }
  }, []);

  const handleLogin = async (token) => {
    setUserToken(token);
    sessionStorage.setItem('token', JSON.stringify(token));
  };

  return (
    <>
      {!userToken ? (
        <div className="login-container">
          <Loginpage setUserToken={handleLogin} />
          <Registerpage />
        </div>
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;
