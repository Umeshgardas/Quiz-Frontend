// src/components/AuthPage.js
import React from 'react';
import Register from './Register';
import Login from './Login';
import '../styles/AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <div className="form-wrapper">
        <Login />
      </div>
      <div className="form-wrapper">
        <Register />
      </div>
    </div>
  );
};

export default AuthPage;
// const width = doc.internal.pageSize.getWidth();
//       const height = doc.internal.pageSize.getHeight();
//        // Date
//       const date = new Date().toLocaleDateString();
//       doc.setFontSize(14);
//       doc.text(`Date: ${date}`, width - 120, height - 80);

//       // Signature Line
//       doc.line(width - 220, height - 100, width - 20, height - 100);
//       doc.text("Authorized Signature", width - 120, height - 70, { align: "center" });