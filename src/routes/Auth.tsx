import React from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fb";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

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
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button
          className="authBtn"
          name="google"
          onClick={(e) => onSocialClick(e)}
        >
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button
          className="authBtn"
          name="github"
          onClick={(e) => onSocialClick(e)}
        >
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
