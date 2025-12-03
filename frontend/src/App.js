import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import WatchAd from './components/WatchAd';
import Wallet from './components/Wallet';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const onLogin = (t) => {
    localStorage.setItem('token', t);
    setToken(t);
  };
  const onLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AdEarn (demo)</h1>
      {!token ? (
        <>
          <Register onLogin={onLogin}/>
          <hr/>
          <Login onLogin={onLogin}/>
        </>
      ) : (
        <>
          <button onClick={onLogout}>Logout</button>
          <Wallet token={token}/>
          <WatchAd token={token}/>
        </>
      )}
    </div>
  );
}
