import React, { ChangeEvent, FormEvent, useState } from "react";
import { SnapshotData } from "routes/Home";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "fb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

export const Tweet = ({ tweet, isOwner }: SnapshotData) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet.text);
  const tweetTextRef = doc(dbService, "tweets", `${tweet.id}`);
  const tweetRefFromUrl = ref(storageService, tweet.attachmentUrl);

  const handleDelete = async () => {
    const ok = window.confirm("Do you want to delete this tweet?");
    if (ok) {
      //del
      await deleteDoc(tweetTextRef);
      await deleteObject(tweetRefFromUrl);
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
    <div className="tweet">
      {isEdit ? (
        <>
          {isOwner && (
            <>
              <form className="container tweetEdit" onSubmit={onSubmit}>
                <input
                  className="formInput"
                  type="text"
                  placeholder="Edit your tweet"
                  value={newTweet}
                  required
                  autoFocus
                  onChange={onChange}
                />
                <input className="formBtn" type="submit" value="update Tweet" />
              </form>
              <span onClick={handleToggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{tweet.text}</h4>
          {tweet.attachmentUrl && <img src={tweet.attachmentUrl} alt="" />}
          {isOwner && (
            <div className="tweet__actions">
              <span onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={handleToggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
