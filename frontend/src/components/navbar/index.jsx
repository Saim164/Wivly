import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { reset } from "@/config/redux/reducer/authreducer";

export default function Navbar() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      dispatch(reset());
      router.push("/login");
    }, 250);
  };

  return (
    <header className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.logo} onClick={() => router.push("/")}>
          Wivly
        </h1>

        {authState.profileFetched && (
          <div
            className={`${styles.profileWrap} ${
              isLoggingOut ? styles.fadeOut : ""
            }`}
          >
            <p className={styles.welcomeText}>
              Welcome, <span>{authState.user?.userId?.name}</span>
            </p>
            <div
              className={styles.profileLink}
              onClick={() =>
                router.push(`/profile/${authState.user?.userId?.username}`)
              }
            >
              <span className={styles.avatar}>
                {authState.user?.userId?.name?.charAt(0).toUpperCase() || "U"}
              </span>
              <p>Profile</p>
            </div>
            <button className={styles.btnJoin} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        {!authState.profileFetched && (
          <button
            className={styles.btnJoin}
            onClick={() => {
              router.push("/login");
            }}
          >
            Be a part
          </button>
        )}
      </nav>
    </header>
  );
}
