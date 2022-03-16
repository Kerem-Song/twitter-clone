import React from "react";
import { authService } from "fb";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(authService)
      .then(() => {
        console.log("logout success");
        navigate("/");
      })
      .catch((err) => {
        console.log("log out failed: ", err);
      });
  };
  return (
    <>
      <button onClick={handleSignOut}>Log Out</button>
    </>
  );
};

export default Profile;
