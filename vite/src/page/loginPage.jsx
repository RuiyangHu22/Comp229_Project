import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const authEndpoint = 'http://localhost:3002/auth';
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${authEndpoint}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); 
      setIsAuthenticated(true); 
      alert('Login successful!');
      navigate('/books');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };



  return (
    <div>
      <header>
        <nav id="navbar">
          <h1>The Book Store</h1>
          <a href="/">Home</a>
          <a href="/register">Sign Up</a>
          <a href="/login">Sign In</a>
        </nav>
      </header>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;