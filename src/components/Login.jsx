import React, { useContext, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserEmail, setUserRole } = useContext(UserContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://quiz-backend-mn2m.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);

      setUserEmail(user.email);
      setUserRole(user.role);
      alert("Login successful!");

      if (user.role === "admin") {
        navigate("/admin/upload");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="login-container">
      <div className={`login-box ${theme}`}>
        <h2 className={`${theme}`}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <p className="forgot-link">
          <NavLink to="/forgot-password">Forgot password?</NavLink>
        </p>

        <button onClick={handleLogin}>Login</button>

        <p className={`${theme}`}>
          Don’t have an account yet?{" "}
          <NavLink to="/register">
            <span>Register</span>
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
