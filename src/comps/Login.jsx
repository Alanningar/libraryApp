"use client"

import React, { useState } from 'react';
import loginInfo from "./logininfo";
import { useRouter } from 'next/navigation';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter()

    const handleSubmit = (element) => {
        element.preventDefault();


        const user = loginInfo.find(
            (user) => user.name === email && user.password === password
        );

        if (user) {
            router.push("/book");

        } else {
            setMessage('höhö try again');
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
            <h1>Login</h1>
            <p style={{color: "grey"}}>hint: 123</p>
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

export default Login;
