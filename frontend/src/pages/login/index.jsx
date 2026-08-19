import Userlayout from "@/layout/userLayout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authaction";
import { emptyMessage } from "@/config/redux/reducer/authreducer";

export default function Login() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const handleRegister = async () => {
    const resultAction = await dispatch(
      registerUser({ name, username, email, password }),
    );

    if (registerUser.fulfilled.match(resultAction)) {
      setPassword("");
      setUserLoginMethod(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authState.isLoading) return;
    userLoginMethod ? handleLogin() : handleRegister();
  };

  const messageClassName = [
    styles.message,
    authState.isError && styles.messageError,
    authState.isSuccess && !authState.isError && styles.messageSuccess,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Userlayout>
      <div className={styles.page}>
        <div className={styles.card}>
          <form className={styles.formSide} onSubmit={handleSubmit}>
            <p className={styles.heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            {authState.message ? (
              <p className={messageClassName}>{authState.message}</p>
            ) : null}

            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.row}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                autoComplete={userLoginMethod ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={authState.isLoading}
            >
              {authState.isLoading
                ? userLoginMethod
                  ? "Signing in..."
                  : "Creating account..."
                : userLoginMethod
                  ? "Sign In"
                  : "Sign Up"}
            </button>
          </form>

          <div className={styles.infoSide}>
            <p>
              {userLoginMethod
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => setUserLoginMethod(!userLoginMethod)}
            >
              {userLoginMethod ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </Userlayout>
  );
}
