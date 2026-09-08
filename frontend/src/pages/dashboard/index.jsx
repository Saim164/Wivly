import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createPost, getAllPosts } from "@/config/redux/action/postaction";

function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const dispatch = useDispatch();

  const handlePost = async () => {
    const resultAction = await dispatch(
      createPost({ file: fileContent, body: postContent }),
    );

    if (createPost.fulfilled.match(resultAction)) {
      setPostContent("");
      setFileContent(null);
      dispatch(getAllPosts());
    }
  };

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.createPostContainer}>
            <img
              className={styles.profileImg}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                authState.user?.userId?.profilePicture || "default.png"
              }`}
              alt="Your profile"
            />
            <div className={styles.composerBody}>
              <textarea
                className={styles.textarea}
                placeholder="What's on your mind?"
                onChange={(e) => {
                  setPostContent(e.target.value);
                }}
                value={postContent}
              ></textarea>

              {fileContent && (
                <div className={styles.filePreview}>
                  <span>📎 {fileContent.name}</span>
                  <button type="button" onClick={() => setFileContent(null)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            <label htmlFor="fileUpload" className={styles.fab}>
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </label>
            <input
              type="file"
              hidden
              id="fileUpload"
              accept="image/*,video/*"
              onChange={(e) => {
                setFileContent(e.target.files[0]);
              }}
            />
          </div>

          {postContent.length > 0 && (
            <div className={styles.postButtonRow}>
              <button
                className={styles.postButton}
                onClick={handlePost}
                disabled={postState.isLoading}
              >
                {postState.isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          )}

          <div className={styles.feed}>
            {postState.post.length === 0 && (
              <div className={styles.emptyState}>
                No posts yet. Be the first to share something.
              </div>
            )}

            {postState.post.map((post) => (
              <div key={post._id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <img
                    className={styles.postAvatar}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                      post.userId?.profilePicture || "default.png"
                    }`}
                    alt={post.userId?.name}
                  />
                  <div>
                    <p className={styles.postAuthor}>{post.userId?.name}</p>
                    <p className={styles.postUsername}>
                      @{post.userId?.username}
                    </p>
                  </div>
                </div>

                <p className={styles.postBody}>{post.body}</p>

                {post.media &&
                  (["mp4", "webm", "quicktime", "mov"].includes(
                    post.fileType,
                  ) ? (
                    <video
                      className={styles.postMedia}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${post.media}`}
                      controls
                    />
                  ) : (
                    <img
                      className={styles.postMedia}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${post.media}`}
                      alt="Post attachment"
                    />
                  ))}

                <p className={styles.postFooter}>
                  {post.likes?.length || 0} likes
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}

export default Dashboard;
