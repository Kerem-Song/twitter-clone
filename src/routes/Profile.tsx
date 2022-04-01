import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { authService, dbService } from "fb";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TUser } from "App";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const Profile = ({ user }: TUser) => {
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName);
  useEffect(() => {
    const getMyTweets = async () => {
      const q = query(
        collection(dbService, "tweets"),
        where("creatorId", "==", user?.uid),
        orderBy("createdAt")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    };
    getMyTweets();
  }, [user]);

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(authService)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("log out failed: ", err);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user && user.displayName !== newDisplayName) {
      await updateProfile(user, {
        displayName: newDisplayName,
      })
        .then(() => {
          // Profile updated!
          console.log("profile updated");
        })
        .catch((err) => {
          console.log("update err", err);
        });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          onChange={handleChange}
          value={newDisplayName ?? "User"}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={handleSignOut}>Log Out</button>
    </>
  );
};

export default Profile;
