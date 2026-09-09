import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/userLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import styles from "./index.module.css";
import { getAllUsers } from "@/config/redux/authSlice";
import { mediaUrl } from "@/config/mediaUrl";

export default function Discover() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const currentUserId = user?.userId?._id;
  const otherUsers = users.filter(
    (profile) => profile.userId && profile.userId._id !== currentUserId,
  );

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1 className={styles.heading}>Discover People</h1>

          {otherUsers.length === 0 ? (
            <div className={styles.emptyState}>No people to show yet.</div>
          ) : (
            <div className={styles.grid}>
              {otherUsers.map((profile) => (
                <div
                  key={profile._id}
                  className={styles.card}
                  onClick={() =>
                    router.push(`/profile/${profile.userId.username}`)
                  }
                >
                  <img
                    className={styles.avatar}
                    src={mediaUrl(profile.userId.profilePicture)}
                    alt={profile.userId.name}
                  />
                  <p className={styles.name}>{profile.userId.name}</p>
                  <p className={styles.username}>@{profile.userId.username}</p>
                  {profile.currentPost && (
                    <p className={styles.currentPost}>{profile.currentPost}</p>
                  )}
                  {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
