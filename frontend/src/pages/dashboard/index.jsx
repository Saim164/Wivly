import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  getCommentsByPost,
  commentPost,
} from "@/config/redux/action/postaction";
import { mediaUrl } from "@/config/mediaUrl";

function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentPostId, setCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUserId = authState.user?.userId?._id;
  const currentUsername = authState.user?.userId?.username;

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleToggleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  const openComments = (postId) => {
    setCommentPostId(postId);
    dispatch(getCommentsByPost(postId));
  };

  const closeComments = () => {
    setCommentPostId(null);
    setCommentText("");
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const resultAction = await dispatch(
      commentPost({ postId: commentPostId, commentBody: commentText }),
    );

    if (commentPost.fulfilled.match(resultAction)) {
      setCommentText("");
      dispatch(getCommentsByPost(commentPostId));
    }
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
              src={mediaUrl(authState.user?.userId?.profilePicture)}
              alt="Your profile"
              onClick={() =>
                currentUsername && router.push(`/profile/${currentUsername}`)
              }
              title="View your profile"
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

            {postState.post.map((post) => {
              const likes = Array.isArray(post.likes) ? post.likes : [];
              const isLiked = Boolean(
                currentUserId && likes.includes(currentUserId),
              );

              return (
              <div key={post._id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <img
                    className={styles.postAvatar}
                    src={mediaUrl(post.userId?.profilePicture)}
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
                      src={mediaUrl(post.media)}
                      controls
                    />
                  ) : (
                    <img
                      className={styles.postMedia}
                      src={mediaUrl(post.media)}
                      alt="Post attachment"
                    />
                  ))}

                <p className={styles.postFooter}>{likes.length} likes</p>

                <div className={styles.postActions}>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${
                      isLiked ? styles.actionButtonActive : ""
                    }`}
                    onClick={() => handleToggleLike(post._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isLiked ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                      />
                    </svg>
                    <span>Like</span>
                  </button>

                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => openComments(post._id)}
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
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                    <span>Comment</span>
                  </button>

                  <button type="button" className={styles.actionButton}>
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
                        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                      />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {commentPostId && (
          <div className={styles.modalOverlay} onClick={closeComments}>
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Comments</h3>
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={closeComments}
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

              <div className={styles.commentList}>
                {postState.comment.length === 0 ? (
                  <p className={styles.commentEmpty}>No comments yet.</p>
                ) : (
                  postState.comment.map((comment) => (
                    <div key={comment._id} className={styles.commentItem}>
                      <img
                        className={styles.commentAvatar}
                        src={mediaUrl(comment.userId?.profilePicture)}
                        alt={comment.userId?.name}
                      />
                      <div>
                        <p className={styles.commentAuthor}>
                          {comment.userId?.name}
                          <span>@{comment.userId?.username}</span>
                        </p>
                        <p className={styles.commentBody}>{comment.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                className={styles.commentForm}
                onSubmit={handleAddComment}
              >
                <input
                  className={styles.commentInput}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles.commentSubmit}
                  disabled={!commentText.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </Userlayout>
  );
}

export default Dashboard;
