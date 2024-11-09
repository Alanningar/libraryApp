"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter()

    const handleSubmit = async (element) => {
        element.preventDefault();

        try {
            const response = await fetch('${window.location.origin}/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

        const data = await response.json();

        if (response.ok) {
        setMessage('Account created successfully!');
        
        router.push('/login');
        } else {
        setMessage(data.message || 'Failed to create account');
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('An unexpected error occurred');
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
            <h1>Signup</h1>
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
                    Signup
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;