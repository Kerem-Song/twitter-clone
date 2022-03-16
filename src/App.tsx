import { authService } from "fb";
import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { onAuthStateChanged } from "firebase/auth";

export interface IsLoggedIn {
  isLoggedIn: boolean;
}
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<IsLoggedIn["isLoggedIn"]>(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>
        &copy; {new Date().getFullYear()} twitter-clone by Kerem Song
      </footer>
    </>
  );
}

export default App;
