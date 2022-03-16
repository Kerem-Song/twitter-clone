import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "fb";

const Auth = () => {
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
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={(e) => onChange(e)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={(e) => onChange(e)}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {errorMsg}
      </form>
      <span onClick={handleToggleAccount}>
        {newAccount ? "Sign In" : "Create New Account"}
      </span>
      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
