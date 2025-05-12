// import React, { useState } from "react";
// import axios from "axios";
// import "./Register.css";
// // import { NavLink, useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useTheme } from "../context/ThemeContext";
// import { NavLink } from "react-router-dom";
// import VerifyOtp from "./VerifyOtp";

// const Register = () => {
//   const [user, setUser] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [emailForOtp, setEmailForOtp] = useState(null);

//   const [showPassword, setShowPassword] = useState(false);
//   const { theme } = useTheme();
//   // const navigate = useNavigate();

//   const handleRegister = async () => {
//     setError("");
//     setSuccess("");
//     try {
//       const res = await axios.post(
//         "https://quiz-backend-mn2m.onrender.com/api/auth/register",
//         user
//       );
//       setSuccess(res.data.message );

//       setEmailForOtp(res.data.email);
//       console.log("success otp",res.data.email,res.data.message);
//     } catch (err) {
//       // Extract meaningful error message from backend response
//       if (err.response && err.response.data && err.response.data.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Registration failed. Please try again.");
//       }
//     }
//   };
//   // const togglePasswordVisibility = () => {
//   //   setShowPassword(!showPassword);
//   // };

//   if (emailForOtp) return <VerifyOtp email={emailForOtp} />;
//   return (
//     <div className="register-container">
//       <div className={`register ${theme}`}>
//         <h2>Register</h2>
//         {error && <p className="error">{error}</p>}
//         {success && <p className="success">{success}</p>}
//         {/* {success && navigate("/login")} */}
//         <input
//           type="text"
//           placeholder="Name"
//           value={user.name}
//           onChange={(e) => setUser({ ...user, name: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={user.email}
//           onChange={(e) => setUser({ ...user, email: e.target.value })}
//         />
//         <input
//             type="password"
//             placeholder="Password"
//             value={user.password}
//             onChange={(e) => setUser({ ...user, password: e.target.value })}
//           />
//         {/* <div className="password-wrapper">
//           <input
//             // type={showPassword ? "text" : "password"}
//             type="password"
//             placeholder="Password"
//             value={user.password}
//             onChange={(e) => setUser({ ...user, password: e.target.value })}
//           />
//           <span className="toggle-icon" onClick={togglePasswordVisibility}>
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div> */}
//         <button onClick={handleRegister}>Register</button>
//         <p>
//           Already have an Account? {}
//           <NavLink to={"/login"}>
//             <span>Login </span>
//           </NavLink>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import axios from "axios";
import VerifyOtp from "./VerifyOtp";
import "./Register.css";
import { useTheme } from "../context/ThemeContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [emailForOtp, setEmailForOtp] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { theme } = useTheme();
  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://quiz-backend-mn2m.onrender.com/api/auth/register",
        user
      );
      setMessage(res.data.message);
      setEmailForOtp(res.data.email);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (emailForOtp) return <VerifyOtp email={emailForOtp} />;

  return (
    <div className="register-container">
      <div className={`register ${theme}`}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <span className="toggle-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {/* <input
          placeholder="Password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
        /> */}
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Sending..." : "Register"}
        </button>
        <p>
          Already have an Account? {}
          <NavLink to={"/login"}>
            <span>Login </span>
          </NavLink>{" "}
        </p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Register;
