import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';
    const body = isSignup ? JSON.stringify({ username, email, password }) : JSON.stringify({ username, password });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      
      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);
      setMessage(data.message);

      if (response.ok) {
        // Navigate to Home.js if login is successful
        if (!isSignup) {
          navigate('/home'); // Change '/home' to your actual home route
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-signup-container">
      <div className="form-container">
        <h2>{isSignup ? "Create Account" : "Welcome Back!"}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          {isSignup && (
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          )}
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="submit-btn">
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p className="message">{message}</p>
        <button onClick={() => setIsSignup(!isSignup)} className="switch-btn">
          {isSignup ? "Already have an account? Log In" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
