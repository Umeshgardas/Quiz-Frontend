import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Welcome to Home
      <NavLink to={"/login"}>Login</NavLink>
    </div>
  );
};

export default Home;
