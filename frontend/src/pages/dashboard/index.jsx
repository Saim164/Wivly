import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  createPost,
  getAllPosts,
  deletePost,
} from "@/config/redux/action/postaction";

function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const dispatch = useDispatch();

  const currentUserId = authState.user?.userId?._id;

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

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

                  {currentUserId && post.userId?._id === currentUserId && (
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDeletePost(post._id)}
                      disabled={postState.isLoading}
                      aria-label="Delete post"
                      title="Delete post"
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
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
