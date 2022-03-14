import { authService } from "fb";
import React, { useState } from "react";
import AppRouter from "components/Router";

export interface IsLoggedIn {
  isLoggedIn: boolean;
}
function App() {
  const user = authService.currentUser;

  const [isLoggedIn, sestIsLoggedIn] =
    useState<IsLoggedIn["isLoggedIn"]>(false);

  return <AppRouter isLoggedIn={isLoggedIn} />;
}

export default App;
