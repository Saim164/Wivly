import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./profile.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getUserByUsername,
  sendConnectionRequest,
} from "@/config/redux/action/authaction";

function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const viewedUser = authState.viewedUser;
  const currentUserId = authState.user?.userId?._id;
  const isOwnProfile = viewedUser && viewedUser._id === currentUserId;

  useEffect(() => {
    if (username) {
      dispatch(getUserByUsername(username));
    }
  }, [dispatch, username]);

  const handleConnect = () => {
    if (viewedUser) {
      dispatch(sendConnectionRequest(viewedUser._id));
    }
  };

  const userPosts = viewedUser
    ? postState.post.filter((post) => post.userId?._id === viewedUser._id)
    : [];

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          {authState.viewedUserFetched && !viewedUser && (
            <div className={styles.emptyState}>User not found.</div>
          )}

          {viewedUser && (
            <>
              <div className={styles.header}>
                <img
                  className={styles.avatar}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                    viewedUser.profilePicture || "default.png"
                  }`}
                  alt={viewedUser.name}
                />
                <div className={styles.headerInfo}>
                  <p className={styles.name}>{viewedUser.name}</p>
                  <p className={styles.username}>@{viewedUser.username}</p>
                </div>
                {!isOwnProfile && (
                  <button
                    type="button"
                    className={styles.connectButton}
                    onClick={handleConnect}
                  >
                    Connect
                  </button>
                )}
              </div>

              {authState.connectionMessage && (
                <p className={styles.connectionMessage}>
                  {authState.connectionMessage}
                </p>
              )}

              <div className={styles.feed}>
                {userPosts.length === 0 && (
                  <div className={styles.emptyState}>No posts yet.</div>
                )}

                {userPosts.map((post) => (
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
                      {Array.isArray(post.likes) ? post.likes.length : 0} likes
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}

export default Profile;
