import React from "react";
import { TUser } from "App";
import { Link } from "react-router-dom";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export const Navigation = ({ userObj }: TUser) => {
  const defaultName = userObj?.email?.split("@")[0];
  return (
    <nav className="navigation">
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link className="navHome" to="/">
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          </Link>
        </li>
        <li>
          <Link
            className="navProfile"
            to="/profile"
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            <span>{userObj?.displayName ?? defaultName} 's Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
