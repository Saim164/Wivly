import { useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postaction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authaction";
import {
  setTokenIsThere,
  setTokenIsNotThere,
} from "@/config/redux/reducer/authreducer";

function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      dispatch(setTokenIsNotThere());
      router.push("/login");
      return;
    }
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers());
    }

    dispatch(setTokenIsThere());
    dispatch(getAllPosts());
    dispatch(getAboutUser());
  }, [dispatch, router]);

  const navOptions = [
    {
      path: "/dashboard",
      label: "Scroll",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
          <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
        </svg>
      ),
    },
    {
      path: "/discover",
      label: "Discover",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      path: "/my-connections",
      label: "My Connections",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftBar}>
        {navOptions.map((option) => (
          <div
            key={option.path}
            onClick={() => router.push(option.path)}
            className={`${styles.sidebarOption} ${
              router.pathname === option.path ? styles.sidebarOptionActive : ""
            }`}
          >
            <span className={styles.icon}>{option.icon}</span>
            <p>{option.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.feedContainer}>{children}</div>

      <div className={styles.extraContainer}>
        <h1 className={styles.extraHeading}>Top Users</h1>
        <div className={styles.topUserList}>
          {authState.allProfileFetched &&
            authState.users.map((profile) => (
              <div key={profile._id} className={styles.topUser}>
                <img
                  className={styles.topUserAvatar}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                    profile.userId?.profilePicture || "default.png"
                  }`}
                  alt={profile.userId?.name}
                />
                <div>
                  <p className={styles.topUserName}>{profile.userId?.name}</p>
                  <p className={styles.topUserUsername}>
                    @{profile.userId?.username}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
