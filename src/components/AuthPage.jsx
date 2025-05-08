// src/components/AuthPage.js
import React from 'react';
import Register from './Register';
import Login from './Login';
import '../styles/AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <div className="form-wrapper">
        <Login />
      </div>
      <div className="form-wrapper">
        <Register />
      </div>
    </div>
  );
};

export default AuthPage;
