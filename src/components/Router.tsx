import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import { TUser } from "../App";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }: TUser) => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home userObj={userObj} />} />
              <Route
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
