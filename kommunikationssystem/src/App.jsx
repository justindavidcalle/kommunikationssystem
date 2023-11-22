import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './sites/Home';
import Registerpage from './sites/Registerpage';
import Loginpage from './sites/Loginpage';

function App() {
  const storedToken = JSON.parse(sessionStorage.getItem('token'));
  const [userToken, setUserToken] = useState(storedToken);

  useEffect(() => {
    // This effect runs when the component mounts
    if (storedToken) {
      console.log('User is logged in. Token:', storedToken);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogin = async (token) => {
    setUserToken(token);
    sessionStorage.setItem('token', JSON.stringify(token));
  };

  return (
    <>
      {!userToken ? (
        <>
          <Loginpage setUserToken={handleLogin} />
          <Registerpage />
        </>
      ) : (
        <>
          
          <Home />
        </>
      )}
    </>
  );
}

export default App;
