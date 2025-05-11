import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";

const Navbar = ({ username, onLogout, userEmail }) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  // 🔐 Checks user login before navigating
  const handleDropdownClick = (path) => {
    if (!userEmail) {
      setShowLoginModal(true);
      return;
    }
    navigate(path);
  };

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
            
            <div
              className={`dropdown-item ${theme}`}
              onClick={() => handleDropdownClick("/profile")}
            >
              Profile
            </div>

            <div
              className={`dropdown-item ${theme}`}
              onClick={() => handleDropdownClick("/myactivity")}
            >
              My Activity
            </div>

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

            {userEmail && (
              <div
                className={`dropdown-item logout ${theme}`}
                onClick={onLogout}
              >
                🚪 Logout
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔔 Login Modal Triggered on Unauthenticated Dropdown Click */}
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Navbar;
