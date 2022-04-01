import { authService } from "fb";
import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { onAuthStateChanged, User } from "firebase/auth";

export interface TUser {
  isLoggedIn?: boolean;
  user?: User;
}
function App() {
  const [init, setInit] = useState(false);

  const [user, setUser] = useState<TUser["user"]>();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUser(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(user)} user={user} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
