import { useState } from "react";
import styles from "./styles.module.css";
import { mediaUrl } from "@/config/mediaUrl";

export default function CommentsModal({ comments, onClose, onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Comments</h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={styles.list}>
          {comments.length === 0 ? (
            <p className={styles.empty}>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className={styles.item}>
                <img
                  className={styles.avatar}
                  src={mediaUrl(comment.userId?.profilePicture)}
                  alt={comment.userId?.name}
                />
                <div>
                  <p className={styles.author}>
                    {comment.userId?.name}
                    <span>@{comment.userId?.username}</span>
                  </p>
                  <p className={styles.body}>{comment.body}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className={styles.submit}
            disabled={!text.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
