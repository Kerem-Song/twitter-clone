import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { authService, dbService } from "fb";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TUser } from "App";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const Profile = ({ refreshUser, userObj }: TUser) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj?.displayName);
  useEffect(() => {
    const getMyTweets = async () => {
      const q = query(
        collection(dbService, "tweets"),
        where("creatorId", "==", userObj?.uid),
        orderBy("createdAt")
      );
      console.log("query", q);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    };
    getMyTweets();
  }, [userObj]);

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
    if (userObj && userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      })
        .then(() => {
          // Profile updated!
          console.log("profile updated");
          refreshUser && refreshUser();
        })
        .catch((err) => {
          console.log("update err", err);
        });
    }
  };

  return (
    <div className="container">
      <form className="profileForm" onSubmit={onSubmit}>
        <input
          className="formInput"
          type="text"
          placeholder="Display name"
          autoFocus
          onChange={handleChange}
          value={newDisplayName ?? ""}
        />
        <input
          className="formBtn"
          type="submit"
          value="Update Profile"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={handleSignOut}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
