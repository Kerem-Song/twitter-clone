import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { dbService } from "fb";
import {
  collection,
  addDoc,
  DocumentData,
  getFirestore,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { LoggedIn } from "../App";

interface SnapshotData {
  text: DocumentData;
  id: string;
  creatorId?: string;
}

const Home = ({ user }: LoggedIn) => {
  console.log("user", user);
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<SnapshotData[]>([]);
  // const getTweets = async () => {
  //   const querySnapshot = await getDocs(collection(dbService, "tweets"));
  //   // console.log("tweets", dbTweets);
  //   querySnapshot.forEach((doc) => {
  //     const tweetObj: SnapshotData = {
  //       data: { ...doc.data() },
  //       id: doc.id,
  //     };
  //     setTweets((prev: SnapshotData[]) => [tweetObj, ...prev]);
  //     console.log(doc.data());
  //   });
  // };

  useEffect(() => {
    const q = query(collection(getFirestore(), "tweets"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const queryArr = querySnapshot.docs.map((doc: DocumentData) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setTweets(queryArr);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setTweet(value);
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: user?.uid,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setTweet("");
  };
  console.log("tweets", tweets);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
          value={tweet}
          onChange={onChange}
        />
        <input type="submit" value="tweet" />
      </form>
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          <h4>{tweet.text}</h4>
        </div>
      ))}
    </div>
  );
};

export default Home;
