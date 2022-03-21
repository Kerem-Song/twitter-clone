import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { dbService } from "fb";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

interface SnapshotData {
  data: DocumentData;
  id: string;
}

const Home = () => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<SnapshotData[]>([]);
  const getTweets = async () => {
    const querySnapshot = await getDocs(collection(dbService, "tweets"));
    // console.log("tweets", dbTweets);
    querySnapshot.forEach((doc) => {
      const tweetObj: SnapshotData = {
        data: { ...doc.data() },
        id: doc.id,
      };
      setTweets((prev: SnapshotData[]) => [tweetObj, ...prev]);
      console.log(doc.data());
    });
  };

  useEffect(() => {
    getTweets();
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
      });
      console.log("Document written with ID: ", docRef.id);
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
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <h4>{tweet.data}</h4>
        </div>
      ))}
    </div>
  );
};

export default Home;
