import React, { ChangeEvent, FormEvent, useState } from "react";
import { dbService } from "fb";
import { collection, addDoc } from "firebase/firestore";

const Home = () => {
  const [tweet, setTweet] = useState("");

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setTweet(value);
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        tweet,
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
    </div>
  );
};

export default Home;
