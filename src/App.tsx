import React, { useEffect, useState } from "react";
import { authService } from "fb";
import AppRouter from "components/Router";
import { onAuthStateChanged, User } from "firebase/auth";

export interface TUser {
  isLoggedIn?: boolean;
  userObj?: User;
  refreshUser?: () => void;
  displayName?: string | null;
  uid?: string;
}

function App() {
  const [init, setInit] = useState(false);

  const [userObj, setUser] = useState<User>();

  useEffect(() => {
    onAuthStateChanged(authService, (userObj) => {
      if (userObj) {
        setUser(userObj);
      } else {
        setUser(undefined);
      }
      setInit(true);
    });
  }, [userObj]);

  const refreshUser = () => {
    if (userObj) {
      setUser({ ...userObj, displayName: userObj.displayName });
    }
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
