import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import QuizPage from "./components/QuizPage";
import AdminUploadPage from "./pages/admin/AdminUploadPage";
import AdminQuestionListPage from "./pages/admin/AdminQuestionListPage";
import Profile from "./components/Profile";
import MyActivity from "./components/MyActivity";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";
import { UserContext } from "./context/UserContext";
import "./App.css";
import ForgotPassword from "./components/ForgotPassword ";

const App = () => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setUserEmail(null);
    setUserRole(null);
    navigate("/login");
  };


  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, userRole, setUserRole }}>
      {shouldShowNavbar && <Navbar onLogout={handleLogout} userEmail={userEmail} userRole={userRole} />}

      <Routes>
        <Route path="/admin/upload" element={<AdminUploadPage />} />
        <Route path="/admin/questions" element={<AdminQuestionListPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact userEmail={userEmail}/>} />
        <Route path="/quiz" element={<QuizPage userEmail={userEmail} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myactivity" element={<MyActivity userEmail={userEmail}  />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
