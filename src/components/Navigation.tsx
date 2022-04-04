import React from "react";
import { TUser } from "App";
import { Link } from "react-router-dom";

export const Navigation = ({ userObj }: TUser) => {
  const defaultName = userObj?.email?.split("@")[0];
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">
            {userObj?.displayName ?? defaultName} 's Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
