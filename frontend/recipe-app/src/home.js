import React from 'react';


const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Your Home Page!</h1>
      <p>This is the main dashboard where you can access various features of the application.</p>
      <ul>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/image-upload">Upload Images</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </div>
  );
};

export default Home;
