import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import Userlayout from "@/layout/userLayout";

export default function Home() {
  const router = useRouter();
  return (
    <Userlayout>
      <Head>
        <title>Wivly — Connect without exaggeration</title>
        <meta
          name="description"
          content="Wivly is a true social media platform to share stories, connect with friends, and grow a network built on authenticity."
        />
      </Head>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.badge}>👋 Welcome to Wivly</span>
          <h1 className={styles.heading}>
            Connect with friends,
            <br />
            without <span className={styles.highlight}>exaggeration</span>
          </h1>
          <p className={styles.subheading}>
            A true social media platform — share stories, not bluffs. Build
            real connections that actually matter.
          </p>

          <ul className={styles.features}>
            <li>Share stories &amp; moments</li>
            <li>Like, comment &amp; connect in real time</li>
            <li>Grow a network built on authenticity</li>
          </ul>

          <div className={styles.ctaRow}>
            <button
              className={styles.btnJoin}
              onClick={() => {
                router.push("/login");
              }}
            >
              Join now <span aria-hidden="true">→</span>
            </button>
            <span className={styles.ctaNote}>
              Free to join. Takes less than a minute.
            </span>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.imageWrap}>
            <img src="/images/connectionImg.jpg" alt="People connecting on Wivly" />
          </div>
        </div>
      </section>
    </Userlayout>
  );
}
