import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import QuizPage from "./components/QuizPage";
import AdminUpload from "./components/AdminUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import MyActivity from "./components/MyActivity";
import Navbar from "./components/Navbar";
import "./App.css";
import { UserContext } from "./context/UserContext";
import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";

const App = () => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const navigate = useNavigate();

  const username = userEmail ? userEmail.split("@")[0] : "Guest";

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail !== userEmail) {
      setUserEmail(storedEmail);
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    navigate("/login");
  };
 // Hide navbar on /login and /register
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
        {shouldShowNavbar && <Navbar onLogout={handleLogout} username={username} userEmail={userEmail} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminUpload />} />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizPage userEmail={userEmail} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile userEmail={userEmail} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myactivity"
          element={
            <ProtectedRoute>
              <MyActivity userEmail={userEmail} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
