import styles from "./styles.module.css";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.logo} onClick={() => router.push("/")}>
          Wivly
        </h1>
        <button
          className={styles.btnJoin}
          onClick={() => {
            router.push("/login");
          }}
        >
          Be a part
        </button>
      </nav>
    </header>
  );
}
