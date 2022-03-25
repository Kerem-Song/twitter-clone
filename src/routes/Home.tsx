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
import { Tweet } from "components/Tweet";

export interface SnapshotData {
  tweet: DocumentData;
  id?: string;
  creatorId?: string;
  isOwner?: boolean;
}

const Home = ({ user }: LoggedIn) => {
  console.log("user", user);
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<SnapshotData[]>([]);

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
      await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: user?.uid,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setTweet("");
  };

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
        <Tweet
          key={tweet.id}
          tweet={tweet}
          isOwner={tweet.creatorId === user?.uid}
        />
      ))}
    </div>
  );
};

export default Home;
