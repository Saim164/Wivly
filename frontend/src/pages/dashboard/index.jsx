import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/userLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import PostCard from "@/components/PostCard";
import CommentsModal from "@/components/CommentsModal";
import styles from "./index.module.css";
import { mediaUrl } from "@/config/mediaUrl";
import {
  getAllPosts,
  createPost,
  deletePost,
  toggleLike,
  getComments,
  addComment,
} from "@/config/redux/postSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, comments, isLoading } = useSelector((state) => state.posts);

  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [openCommentsFor, setOpenCommentsFor] = useState(null);

  const currentUserId = user?.userId?._id;
  const currentUsername = user?.userId?.username;

  const handleCreatePost = async () => {
    const result = await dispatch(createPost({ body, file }));
    if (createPost.fulfilled.match(result)) {
      setBody("");
      setFile(null);
      dispatch(getAllPosts());
    }
  };

  const openComments = (postId) => {
    setOpenCommentsFor(postId);
    dispatch(getComments(postId));
  };

  const submitComment = async (text) => {
    const result = await dispatch(
      addComment({ postId: openCommentsFor, body: text }),
    );
    if (addComment.fulfilled.match(result)) {
      dispatch(getComments(openCommentsFor));
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.composer}>
            <img
              className={styles.composerAvatar}
              src={mediaUrl(user?.userId?.profilePicture)}
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
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              {file && (
                <div className={styles.filePreview}>
                  <span>📎 {file.name}</span>
                  <button type="button" onClick={() => setFile(null)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            <label htmlFor="postFile" className={styles.fab}>
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
              id="postFile"
              type="file"
              hidden
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {body.trim().length > 0 && (
            <div className={styles.postButtonRow}>
              <button
                className={styles.postButton}
                onClick={handleCreatePost}
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          )}

          <div className={styles.feed}>
            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                No posts yet. Be the first to share something.
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onToggleLike={(id) => dispatch(toggleLike(id))}
                  onOpenComments={openComments}
                  onDelete={(id) => dispatch(deletePost(id))}
                />
              ))
            )}
          </div>
        </div>

        {openCommentsFor && (
          <CommentsModal
            comments={comments}
            onClose={() => setOpenCommentsFor(null)}
            onSubmit={submitComment}
          />
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
