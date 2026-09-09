import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/userLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import PostCard from "@/components/PostCard";
import CommentsModal from "@/components/CommentsModal";
import EditProfileModal from "@/components/EditProfileModal";
import styles from "./profile.module.css";
import { mediaUrl } from "@/config/mediaUrl";
import {
  getUserByUsername,
  getAboutUser,
  sendConnectionRequest,
  cancelConnectionRequest,
  respondConnectionRequest,
  getConnectionStatus,
  updateProfileData,
  uploadProfilePicture,
  downloadResume,
} from "@/config/redux/authSlice";
import {
  toggleLike,
  deletePost,
  getComments,
  addComment,
} from "@/config/redux/postSlice";

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const dispatch = useDispatch();

  const {
    user,
    viewedUser,
    viewedProfile,
    viewedUserFetched,
    connectionStatus,
  } = useSelector((state) => state.auth);
  const { posts, comments } = useSelector((state) => state.posts);

  const [isEditing, setIsEditing] = useState(false);
  const [openCommentsFor, setOpenCommentsFor] = useState(null);

  const currentUserId = user?.userId?._id;
  const isOwnProfile = viewedUser && viewedUser._id === currentUserId;

  useEffect(() => {
    if (username) dispatch(getUserByUsername(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (viewedUser && !isOwnProfile) {
      dispatch(getConnectionStatus(viewedUser._id));
    }
  }, [dispatch, viewedUser, isOwnProfile]);

  const refreshStatus = () => {
    if (viewedUser) dispatch(getConnectionStatus(viewedUser._id));
  };

  const handleConnect = async () => {
    await dispatch(sendConnectionRequest(viewedUser._id));
    refreshStatus();
  };

  const handleCancel = async () => {
    await dispatch(cancelConnectionRequest(viewedUser._id));
    refreshStatus();
  };

  const handleRespond = async (action_type) => {
    await dispatch(
      respondConnectionRequest({
        requestId: connectionStatus.requestId,
        action_type,
      }),
    );
    refreshStatus();
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const result = await dispatch(uploadProfilePicture(file));
    if (uploadProfilePicture.fulfilled.match(result)) {
      dispatch(getUserByUsername(username));
      dispatch(getAboutUser());
    }
  };

  const handleSaveProfile = async (form) => {
    const result = await dispatch(updateProfileData(form));
    if (updateProfileData.fulfilled.match(result)) {
      setIsEditing(false);
      dispatch(getUserByUsername(username));
      dispatch(getAboutUser());
    }
  };

  const handleDownloadResume = async () => {
    const result = await dispatch(downloadResume(viewedUser._id));
    if (downloadResume.fulfilled.match(result)) {
      window.open(mediaUrl(result.payload.message), "_blank");
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

  const userPosts = viewedUser
    ? posts.filter((post) => post.userId?._id === viewedUser._id)
    : [];

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          {viewedUserFetched && !viewedUser && (
            <div className={styles.emptyState}>User not found.</div>
          )}

          {viewedUser && (
            <>
              <div className={styles.header}>
                <div className={styles.avatarWrap}>
                  <img
                    className={styles.avatar}
                    src={mediaUrl(viewedUser.profilePicture)}
                    alt={viewedUser.name}
                  />
                  {isOwnProfile && (
                    <>
                      <label
                        htmlFor="profilePicInput"
                        className={styles.avatarEdit}
                        title="Change photo"
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
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          />
                        </svg>
                      </label>
                      <input
                        id="profilePicInput"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleProfilePicture}
                      />
                    </>
                  )}
                </div>

                <div className={styles.headerInfo}>
                  <p className={styles.name}>{viewedUser.name}</p>
                  <p className={styles.username}>@{viewedUser.username}</p>
                  {viewedProfile?.currentPost && (
                    <p className={styles.currentPost}>
                      {viewedProfile.currentPost}
                    </p>
                  )}
                </div>

                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={handleDownloadResume}
                    aria-label="Download resume"
                    title="Download resume"
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
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </button>

                  {isOwnProfile ? (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    connectionStatus && (
                      <ConnectionButton
                        status={connectionStatus.status}
                        onConnect={handleConnect}
                        onCancel={handleCancel}
                        onRespond={handleRespond}
                      />
                    )
                  )}
                </div>
              </div>

              {viewedProfile?.bio && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>About</h2>
                  <p className={styles.bioText}>{viewedProfile.bio}</p>
                </section>
              )}

              {viewedProfile?.pastWork?.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Experience</h2>
                  {viewedProfile.pastWork.map((work, i) => (
                    <div key={i} className={styles.entry}>
                      <p className={styles.entryTitle}>
                        {work.position}
                        {work.company && ` · ${work.company}`}
                      </p>
                      {work.years && (
                        <p className={styles.entrySub}>{work.years}</p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {viewedProfile?.education?.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Education</h2>
                  {viewedProfile.education.map((edu, i) => (
                    <div key={i} className={styles.entry}>
                      <p className={styles.entryTitle}>{edu.school}</p>
                      {(edu.degree || edu.fieldOfStudy) && (
                        <p className={styles.entrySub}>
                          {[edu.degree, edu.fieldOfStudy]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              <div className={styles.feed}>
                {userPosts.length === 0 ? (
                  <div className={styles.emptyState}>No posts yet.</div>
                ) : (
                  userPosts.map((post) => (
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
            </>
          )}
        </div>

        {openCommentsFor && (
          <CommentsModal
            comments={comments}
            onClose={() => setOpenCommentsFor(null)}
            onSubmit={submitComment}
          />
        )}

        {isEditing && (
          <EditProfileModal
            profile={viewedProfile}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveProfile}
          />
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

function ConnectionButton({ status, onConnect, onCancel, onRespond }) {
  if (status === "none") {
    return (
      <button
        type="button"
        className={styles.connectButton}
        onClick={onConnect}
      >
        Connect
      </button>
    );
  }

  if (status === "pending_sent") {
    return (
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onCancel}
      >
        Cancel Request
      </button>
    );
  }

  if (status === "pending_received") {
    return (
      <div className={styles.connectActions}>
        <button
          type="button"
          className={styles.connectButton}
          onClick={() => onRespond("accept")}
        >
          Accept
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => onRespond("decline")}
        >
          Decline
        </button>
      </div>
    );
  }

  return <span className={styles.connectedBadge}>Connected</span>;
}
