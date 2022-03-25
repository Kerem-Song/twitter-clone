import { authService } from "fb";
import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { onAuthStateChanged, User } from "firebase/auth";

export interface LoggedIn {
  isLoggedIn?: boolean;
  user?: User;
}
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<LoggedIn["isLoggedIn"]>(false);
  const [user, setUser] = useState<LoggedIn["user"]>();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} user={user} />
      ) : (
        "Initializing..."
      )}
      <footer>
        &copy; {new Date().getFullYear()} twitter-clone by Kerem Song
      </footer>
    </>
  );
}

export default App;
