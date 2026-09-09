import { getAllUsers } from "@/config/redux/action/authaction";
import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { mediaUrl } from "@/config/mediaUrl";

function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUserId = authState.user?.userId?._id;

  useEffect(() => {
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers());
    }
  }, [dispatch, authState.allProfileFetched]);

  const otherUsers = authState.users.filter(
    (profile) => profile.userId?._id !== currentUserId,
  );

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1 className={styles.heading}>Discover People</h1>

          {otherUsers.length === 0 && (
            <div className={styles.emptyState}>No people to show yet.</div>
          )}

          <div className={styles.grid}>
            {otherUsers.map((profile) => (
              <div
                key={profile._id}
                className={styles.card}
                onClick={() =>
                  router.push(`/profile/${profile.userId?.username}`)
                }
              >
                <img
                  className={styles.avatar}
                  src={mediaUrl(profile.userId?.profilePicture)}
                  alt={profile.userId?.name}
                />
                <p className={styles.name}>{profile.userId?.name}</p>
                <p className={styles.username}>@{profile.userId?.username}</p>
                {profile.currentPost && (
                  <p className={styles.currentPost}>{profile.currentPost}</p>
                )}
                {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}

export default Discover;
