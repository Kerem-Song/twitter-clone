import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { storageService } from "fb";
import {
  collection,
  DocumentData,
  getFirestore,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { LoggedIn } from "../App";
import { Tweet } from "components/Tweet";

export interface SnapshotData {
  tweet: DocumentData;
  id?: string;
  creatorId?: string;
  isOwner?: boolean;
}

const Home = ({ user }: LoggedIn) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<SnapshotData[]>([]);
  const [fileUrl, setFileUrl] = useState<string>();

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("file change target: ", e.target.files);
    const {
      target: { files },
    } = e;
    const file = files && files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = (finishedEvent: ProgressEvent<FileReader>) => {
      console.log("finishedEvent", finishedEvent);
      // const {
      //   target: { result },
      // } = finishedEvent;
      const result = finishedEvent.target?.result;
      if (result && typeof result === "string") {
        setFileUrl(result);
      }
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
  };

  const handleClearBtn = () => {
    setFileUrl("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fileRef = ref(storageService, `${user?.uid}/${uuidv4()}`);
    if (fileUrl) {
      const res = uploadString(fileRef, fileUrl, "data_url").then(
        (snapshot) => {
          console.log("uploaded");
        }
      );

      console.log("res:", res);
    }

    // try {
    //   await addDoc(collection(dbService, "tweets"), {
    //     text: tweet,
    //     createdAt: Date.now(),
    //     creatorId: user?.uid,
    //   });
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }

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
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input type="submit" value="tweet" />
        {fileUrl && (
          <div>
            <img src={fileUrl} alt="" width={50} height={50} />
            <button onClick={handleClearBtn}>Clear</button>
          </div>
        )}
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
