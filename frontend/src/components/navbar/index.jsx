import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { reset } from "@/config/redux/authSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profileFetched, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    router.push("/login");
  };

  return (
    <header className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.logo} onClick={() => router.push("/")}>
          Wivly
        </h1>

        {profileFetched ? (
          <div className={styles.profileWrap}>
            <p className={styles.welcomeText}>
              Welcome, <span>{user?.userId?.name}</span>
            </p>
            <div
              className={styles.profileLink}
              onClick={() => router.push(`/profile/${user?.userId?.username}`)}
            >
              <span className={styles.avatar}>
                {user?.userId?.name?.charAt(0).toUpperCase() || "U"}
              </span>
              <p>Profile</p>
            </div>
            <button className={styles.btnJoin} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className={styles.btnJoin}
            onClick={() => router.push("/login")}
          >
            Be a part
          </button>
        )}
      </nav>
    </header>
  );
}
