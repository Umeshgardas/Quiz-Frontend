import React, { useContext, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserEmail } = useContext(UserContext);

  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://quiz-backend-mn2m.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);
      console.log(res.data.user);
      setUserEmail(email); // Update App state

      alert("Login successful!");
      navigate("/quiz");
    } catch (err) {
      alert("Login failed!", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <span className="toggle-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <p className="forgot-link">
          <NavLink to={"/register"}>
            <span>Forgot password </span>
          </NavLink>
        </p>
        <button onClick={handleLogin}>Login</button>
        <p className={`${theme}`}>
          Don't have an account yet? {}
          <NavLink to={"/register"}>
            <span>Register </span>
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
