import React, { ChangeEvent, FormEvent, useState } from "react";
import { TUser } from "App";
import { storageService, dbService } from "fb";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    if (tweet === "") {
      return;
    }

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
    <form className="factoryForm" onSubmit={onSubmit}>
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
          value={tweet}
          onChange={onChange}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {fileUrl && (
        <div className="factoryForm__attachment">
          <img
            src={fileUrl}
            alt=""
            style={{
              backgroundImage: fileUrl,
            }}
          />
          <div className="factoryForm__clear" onClick={handleClearBtn}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
