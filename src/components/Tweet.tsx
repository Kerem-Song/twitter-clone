import React, { ChangeEvent, FormEvent, useState } from "react";
import { SnapshotData } from "routes/Home";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fb";

export const Tweet = ({ tweet, isOwner }: SnapshotData) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet.text);
  const tweetTextRef = doc(dbService, "tweets", `${tweet.id}`);

  const handleDelete = async () => {
    const ok = window.confirm("Do you want to delete this tweet?");
    if (ok) {
      //del
      await deleteDoc(tweetTextRef);
    }
  };

  const handleToggleEditing = () => setIsEdit((prev) => !prev);

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setNewTweet(value);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(tweetTextRef, {
        text: newTweet,
      });
      setIsEdit(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      {isEdit ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your tweet"
                  value={newTweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="update value" />
              </form>
              <button onClick={handleToggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{tweet.text}</h4>
          {tweet.attachmentUrl && (
            <img src={tweet.attachmentUrl} alt="" width={50} height={50} />
          )}
          {isOwner && (
            <>
              <button onClick={handleDelete}>Delete Tweet</button>
              <button onClick={handleToggleEditing}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
