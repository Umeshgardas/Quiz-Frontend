import React, { useState } from "react";
import "./Navbar.css";
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className={`quiz-header ${theme}`}>
      <NavLink to={"/quiz"}>
        <h1 className={`quiz-title ${theme}`}>Quiz App</h1>
      </NavLink>

      <div className="profile-container">
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="profile-image"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <NavLink to={"/profile"}>
              <div className="dropdown-item username">👤 {username}</div>
            </NavLink>
            <div className="dropdown-item">
              <span>🌓</span>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={toggleTheme}
                  checked={theme === "dark"}
                />
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
