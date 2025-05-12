import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = ({ email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus
      if (value && index < 5) inputRefs.current[index + 1].focus();
      else if (!value && index > 0) inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    try {
      const enteredOtp = otp.join("");
      const res = await axios.post(
        "https://quiz-backend-mn2m.onrender.com/api/auth/verify-otp",
        {
          email,
          otp: enteredOtp,
        }
      );
      setMessage(res.data.message);
      navigate("/login");
      if (res.data.message === "OTP verified successfully!") {
        // 👇 Redirect after 2s or auto-login
        setTimeout(() => {
          window.location.href = "/login"; // or perform auto-login
        }, 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("https://quiz-backend-mn2m.onrender.com/api/auth/resend-otp", { email });
      setMessage("OTP resent. Please check your email.");
      setTimer(60); // reset timer
    } catch (err) {
      setMessage("Failed to resend OTP", err);
    }
  };

  return (
    <div>
      <h3>Enter OTP sent to {email}</h3>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target, i)}
            style={{
              width: "40px",
              height: "40px",
              fontSize: "24px",
              textAlign: "center",
            }}
          />
        ))}
      </div>

      <button onClick={handleVerify} style={{ marginTop: "10px" }}>
        Verify OTP
      </button>

      <p>{message}</p>

      {timer > 0 ? (
        <p>Resend OTP in: {timer}s</p>
      ) : (
        <button onClick={handleResend}>Resend OTP</button>
      )}
    </div>
  );
};

export default VerifyOtp;
