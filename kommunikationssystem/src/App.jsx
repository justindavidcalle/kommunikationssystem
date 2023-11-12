import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './sites/Home';
import Registerpage from './sites/Registerpage';
import Loginpage from './sites/Loginpage';

function App() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // This effect runs when userToken changes
    if (userToken) {
      console.log('User is logged in. Token:', userToken);
      // You can add additional logic here to redirect or load other components
    }
  }, [userToken]);

  const handleLogin = async (token) => {
    setUserToken(token);
  };

  return (
    <>
      <h1>APPLICATION</h1>
      {!userToken ? (
        <Loginpage setUserToken={handleLogin} />
      ) : (
        <>
          <Registerpage />
          <Home />
        </>
      )}
    </>
  );
}

export default App;
