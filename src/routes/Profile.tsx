import React, { useEffect } from "react";
import { authService, dbService } from "fb";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TUser } from "App";
import { collection, getDocs, query, where } from "firebase/firestore";

const Profile = ({ user }: TUser) => {
  // const getMyTweets = async () => {
  //   const q = query(
  //     collection(dbService, "tweets"),
  //     where("creatorId", "==", user?.uid)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log("doc from get my tweet", doc.data());
  //   });
  // };
  useEffect(() => {
    const getMyTweets = async () => {
      const q = query(
        collection(dbService, "tweets"),
        where("creatorId", "==", user?.uid)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    };
    getMyTweets();
  }, [user?.uid]);
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
  return (
    <>
      <button onClick={handleSignOut}>Log Out</button>
    </>
  );
};

export default Profile;
