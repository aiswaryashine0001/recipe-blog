// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './main'; // Import the Main component
import Home from './home';
import Profile from './Profile';
import LoginSignup from './LoginSignup'; // Import the LoginSignup component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
};

export default App;
