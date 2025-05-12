import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Forgot.css";
import { useTheme } from "../context/ThemeContext";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSendOtp = async () => {
    await axios.post("https://quiz-backend-mn2m.onrender.com/api/auth/forgot-password", {
      email,
    });
    alert("OTP sent to your email");
    setStep(2);
  };

  const handleVerifyOtp = async () => {
    await axios.post("https://quiz-backend-mn2m.onrender.com/api/auth/verify-reset-otp", {
      email,
      otp,
    });
    alert("OTP verified");
    setStep(3);
  };

  const handleResetPassword = async () => {
    await axios.post("https://quiz-backend-mn2m.onrender.com/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    alert("Password reset successfully");
    navigate("/login");
    setStep(1);
  };

  return (
    <div className=" forgot-container">
      <div className={`forgot-password-box ${theme}`}>
        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Verify OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
