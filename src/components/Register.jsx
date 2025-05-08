import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { NavLink } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('https://quiz-backend-mn2m.onrender.com/api/auth/register', user);
      setSuccess(res.data.message || 'Registered successfully!');
    } catch (err) {
      // Extract meaningful error message from backend response
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};
  return (
    <div className="register-container">
      <div className='register'>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={e => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={user.password}
            onChange={e => setUser({ ...user, password: e.target.value })}
          />
          <span className="toggle-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {/* <input
          type="password"
          placeholder="Password"
          onChange={e => setUser({ ...user, password: e.target.value })}
        /> */}

        <button onClick={handleRegister}>Register</button>
        <p>
          Already have an Account? { }
          <NavLink to={"/login"} >
            <span>Login </span>
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
