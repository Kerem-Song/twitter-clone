import { TUser } from "App";
import { storageService, dbService } from "fb";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TweetFactory = ({ userObj }: TUser) => {
  const [tweet, setTweet] = useState("");
  const [fileUrl, setFileUrl] = useState<string>("");
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
    let attachmentUrl = "";
    const fileRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`);
    if (fileUrl) {
      const res = await uploadString(fileRef, fileUrl, "data_url");

      attachmentUrl = await getDownloadURL(res.ref);
      console.log("res:", res);
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj?.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "tweets"), tweetObj);

    setTweet("");
    setFileUrl("");
  };

  return (
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
  );
};

export default TweetFactory;
