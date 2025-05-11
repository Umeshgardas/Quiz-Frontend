import React from "react";
import "./Profile.css";

const Profile = ({ userEmail }) => {
  return (
    <div className="profile-container">
      Profile {userEmail}
      <p>Data</p>
    </div>
  );
};

export default Profile;
