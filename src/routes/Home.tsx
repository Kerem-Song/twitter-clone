import React, { useEffect, useState } from "react";
import {
  collection,
  DocumentData,
  getFirestore,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { TUser } from "../App";
import { Tweet } from "components/Tweet";
import TweetFactory from "components/TweetFactory";

export interface SnapshotData {
  tweet: DocumentData;
  id?: string;
  creatorId?: string;
  isOwner?: boolean;
}

const Home = ({ userObj }: TUser) => {
  // const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<SnapshotData[]>([]);
  // const [fileUrl, setFileUrl] = useState<string>("");

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

  // const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
  //   setTweet(value);
  // };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   console.log("file change target: ", e.target.files);
  //   const {
  //     target: { files },
  //   } = e;
  //   const file = files && files[0];
  //   const fileReader = new FileReader();

  //   fileReader.onloadend = (finishedEvent: ProgressEvent<FileReader>) => {
  //     console.log("finishedEvent", finishedEvent);

  //     const result = finishedEvent.target?.result;
  //     if (result && typeof result === "string") {
  //       setFileUrl(result);
  //     }
  //   };
  //   if (file) {
  //     fileReader.readAsDataURL(file);
  //   }
  // };

  // const handleClearBtn = () => {
  //   setFileUrl("");
  // };

  // const onSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   let attachmentUrl = "";
  //   const fileRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`);
  //   if (fileUrl) {
  //     const res = await uploadString(fileRef, fileUrl, "data_url");

  //     attachmentUrl = await getDownloadURL(res.ref);
  //     console.log("res:", res);
  //   }

  //   const tweetObj = {
  //     text: tweet,
  //     createdAt: Date.now(),
  //     creatorId: userObj?.uid,
  //     attachmentUrl,
  //   };

  //   await addDoc(collection(dbService, "tweets"), tweetObj);

  //   setTweet("");
  //   setFileUrl("");
  // };

  return (
    <div>
      {/* <form onSubmit={onSubmit}>
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
      </form> */}
      <TweetFactory userObj={userObj} />
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          isOwner={tweet.creatorId === userObj?.uid}
        />
      ))}
    </div>
  );
};

export default Home;
