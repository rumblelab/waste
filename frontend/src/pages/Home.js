// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to DiscoFish</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Login</Link>
        <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</Link>
      </div>
    </div>
  );
};

export default Home;
