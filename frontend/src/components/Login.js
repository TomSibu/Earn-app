import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault();
    try {
      const r = await API.post('/auth/login', { email, password: pw });
      onLogin(r.data.token);
      setMsg('Logged in');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  }
  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" value={pw} onChange={e=>setPw(e.target.value)} type="password" />
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
