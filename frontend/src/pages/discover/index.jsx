import { getAllUsers } from "@/config/redux/action/authaction";
import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers());
    }
  }, [dispatch, authState.allProfileFetched]);

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1 className={styles.heading}>Discover People</h1>

          {authState.users.length === 0 && (
            <div className={styles.emptyState}>No people to show yet.</div>
          )}

          <div className={styles.grid}>
            {authState.users.map((profile) => (
              <div
                key={profile._id}
                className={styles.card}
                onClick={() =>
                  router.push(`/profile/${profile.userId?.username}`)
                }
              >
                <img
                  className={styles.avatar}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                    profile.userId?.profilePicture || "default.png"
                  }`}
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
