import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/userLayout";
import styles from "./style.module.css";
import {
  loginUser,
  registerUser,
  clearMessage,
} from "@/config/redux/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [isSignIn, setIsSignIn] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (auth.loggedIn) {
      router.replace("/dashboard");
    }
  }, [auth.loggedIn, router]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const switchMode = () => {
    setIsSignIn((prev) => !prev);
    dispatch(clearMessage());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.isLoading) return;

    if (isSignIn) {
      dispatch(loginUser({ email: form.email, password: form.password }));
      return;
    }

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      setForm((prev) => ({ ...prev, password: "" }));
      setIsSignIn(true);
    }
  };

  const messageClass = [
    styles.message,
    auth.isError && styles.messageError,
    auth.isSuccess && !auth.isError && styles.messageSuccess,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <UserLayout>
      <div className={styles.page}>
        <div className={styles.card}>
          <form className={styles.formSide} onSubmit={handleSubmit}>
            <p className={styles.heading}>{isSignIn ? "Sign In" : "Sign Up"}</p>

            {auth.message ? (
              <p className={messageClass}>{auth.message}</p>
            ) : null}

            <div className={styles.inputContainer}>
              {!isSignIn && (
                <div className={styles.row}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    value={form.username}
                    onChange={setField("username")}
                    required
                  />
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                    value={form.name}
                    onChange={setField("name")}
                    required
                  />
                </div>
              )}

              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={form.email}
                onChange={setField("email")}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                value={form.password}
                onChange={setField("password")}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={auth.isLoading}
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className={styles.infoSide}>
            <p>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              className={styles.switchBtn}
              onClick={switchMode}
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
