import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Wallet({ token }) {
  const [wallet, setWallet] = useState(null);
  useEffect(() => {
    API.get('/ads/wallet', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setWallet(r.data.wallet))
      .catch(() => setWallet(null));
  }, [token]);

  return (
    <div>
      <h3>Wallet</h3>
      {wallet ? (
        <div>
          Balance: <b>{wallet.balance}</b> (unit: paise). <br/>
          <small>History length: {wallet.history?.length || 0}</small>
        </div>
      ) : <div>Loading...</div>}
    </div>
  );
}
