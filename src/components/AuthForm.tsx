import { authService } from "fb";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { ChangeEvent, FormEvent, useState } from "react";

const AuthForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [newAccount, setNewAccount] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [name]: value });
  };

  const handleToggleAccount = () => {
    setNewAccount((prevNewAccount) => !prevNewAccount);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        // create account
        data = await createUserWithEmailAndPassword(
          authService,
          form.email,
          form.password
        ).then((userCredential) => {
          // signed in
          const user = userCredential.user;
          console.log("singed in user: ", user);
        });
      } else {
        // log in
        data = await signInWithEmailAndPassword(
          authService,
          form.email,
          form.password
        );
      }

      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <>
      <form className="container" onSubmit={onSubmit}>
        <input
          className="authInput"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={(e) => onChange(e)}
        />
        <input
          className="authInput"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={(e) => onChange(e)}
        />
        <input
          className="authInput"
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {errorMsg && <span className="authError">{errorMsg}</span>}
      </form>
      <span className="authSwitch" onClick={handleToggleAccount}>
        {newAccount ? "Sign In" : "Create New Account"}
      </span>
    </>
  );
};

export default AuthForm;
