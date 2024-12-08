import React, { useState } from 'react';

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful!');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (err) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            
        <header>
        <nav id="navbar">
        <h1>The Book Store</h1>
          <a href="http://localhost:3000">Home</a>
          <a href="/register">Sign Up</a>
          <a href="/login">Sign In</a>
        </nav>
        </header>
            <h2>Register</h2>
            <form onSubmit={handleRegistration}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegistrationPage;