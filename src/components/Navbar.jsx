import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // To track the dropdown and image container

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`quiz-header ${theme}`}>
      <NavLink to={"/quiz"}>
        <h1 className={`quiz-title ${theme}`}>Quiz App</h1>
      </NavLink>

      <div className="profile-container" ref={dropdownRef}>
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="profile-image"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className={`dropdown-menu ${theme}`}>
            <div className={`dropdown-item username ${theme}`}>{username}</div>
            <NavLink to={"/profile"}>
              <div className={`dropdown-item ${theme}`}>Profile</div>
            </NavLink>
            <NavLink to={"/myactivity"}>
              <div className={`dropdown-item ${theme}`}>My Activity</div>
            </NavLink>
            <div className={`dropdown-item ${theme}`}>
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

            <div className={`dropdown-item logout ${theme}`} onClick={onLogout}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
