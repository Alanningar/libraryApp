"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
    if (data.success) {
      router.push('/book');
    } else {
      setMessage(data.message || 'Login failed');
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", width: "300px" }}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Enter your email"
          required
          style={{ marginBottom: "10px", padding: "8px", background: "#fafafa"}}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          required
          style={{ marginBottom: "10px", padding: "8px", background: "#fafafa" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer" }}>
          Login
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
