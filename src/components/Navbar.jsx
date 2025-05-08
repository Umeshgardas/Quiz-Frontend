// components/Navbar.js
import React, { useState } from 'react';
import './Navbar.css';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="quiz-header">
      <h1 className="quiz-title">Quiz App</h1>

      <div className="profile-container">
        <img
          src="https://i.pravatar.cc/40" // Replace with real profile image or user prop
          alt="Profile"
          className="profile-image"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item username">👤 {username}</div>
            <div className="dropdown-item" >
              <span>🌓</span>
              <label className="switch">
                <input type="checkbox" onClick={toggleTheme} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="dropdown-item logout" onClick={onLogout}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
