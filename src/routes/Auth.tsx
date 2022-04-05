import React from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fb";
import AuthForm from "components/AuthForm";

const Auth = () => {
  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;

    if (name === "google") {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(authService, provider);
    } else if (name === "github") {
      const provider = new GithubAuthProvider();
      await signInWithPopup(authService, provider);
    }
  };

  return (
    <div>
      <AuthForm />

      <div>
        <button name="google" onClick={(e) => onSocialClick(e)}>
          Continue with Google
        </button>
        <button name="github" onClick={(e) => onSocialClick(e)}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
