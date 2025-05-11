import React, { useEffect, useRef } from "react";
import "./LoginModal.css"; // Your custom styles
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

const LoginModal = ({ show, onClose }) => {
  const modalRef = useRef(null); // Reference to the modal container
  const { theme } = useTheme();

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal when clicking outside
      }
    };

    // Add event listener when modal is shown
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener when modal is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null; // Do not render the modal if it's not supposed to show

  return (
    <div className="modal-backdrop">
      <div className={`modal-content ${theme}`} ref={modalRef}>
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2 className="modal-header">Login Required</h2>
        <p>
          Please
          <NavLink to={"/login"}> Login </NavLink>
          to continue.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
