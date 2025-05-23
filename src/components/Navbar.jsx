import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import LoginModal from "./LoginModal";
import "./Navbar.css";

const Navbar = ({ onLogout, userEmail, userRole }) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // NEW: state for mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleMenu = () => setMenuOpen(!menuOpen); // NEW toggle handler for hamburger

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = React.useCallback(
    (path) => {
      if (!userEmail) {
        setShowLoginModal(true);
      } else {
        navigate(path);
      }
    },
    [userEmail, navigate]
  );

  return (
    <div className={`quiz-header ${theme}`}>
      <div className="navbar-toggle">
        <NavLink to="/">
          <img
            className={`quiz-title ${theme}`}
            src="data:image/png;base64,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"
            alt=""
          />
        </NavLink>
      </div>

      <div className={`navbar`}>
        {/* Hamburger Menu Icon */}
        <div className="mobile-menu">
          <div
            className="menu-icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            role="button"
            tabIndex={0}
          >
            {/* Simple hamburger icon made with 3 lines */}
            <div className={`bar ${theme} `}></div>
            <div className={`bar ${theme} `}></div>
            <div className={`bar ${theme} `}></div>
          </div>
          <div className={`navlist ${menuOpen ? "open" : ""}`}>
            <ul>
              {userRole === "admin" ? (
                <>
                  <li>
                    <NavLink
                      to="/admin/upload"
                      className={`${theme}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Upload Question
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/questions"
                      className={`${theme}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      View Questions
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className={`${theme}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about"
                      className={`${theme}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      About
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contact"
                      className={`${theme}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Contact
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/quiz"
                      className={`${theme}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Quiz
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="profile-container" ref={dropdownRef}>
          <div className={`username ${theme}`}>{userEmail || "Guest"}</div>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="profile-image"
            onClick={toggleDropdown}
          />

          {dropdownOpen && (
            <div className={`dropdown-menu ${theme}`}>
              {userEmail ? (
                <>
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
                </>
              ) : (
                <p className={`dropdown-item ${theme}`}>
                  <NavLink to="/login">Login</NavLink>
                </p>
              )}

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
      </div>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Navbar;
