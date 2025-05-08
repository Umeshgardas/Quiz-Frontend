import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import QuizPage from './components/QuizPage';
import AdminUpload from './components/AdminUpload';
import ProtectedRoute from './components/ProtectedRoute';
import "./App.css"
const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminUpload />} />
            <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        </Routes>
    </Router>
);

export default App;
