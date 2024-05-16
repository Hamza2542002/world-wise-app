import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../context/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuth, errorMessage } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage);

  useEffect(
    function () {
      console.log(isAuth);
      if (isAuth) navigate("/app", { replace: true });
    },
    [isAuth, navigate]
  );

  async function handleLogin(e) {
    e.preventDefault();
    if (email && password) {
      await login({ email, password });
      setError(errorMessage);
    }
  }

  return (
    <main className={styles.login}>
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {error && <p className={styles.error}>{errorMessage}</p>}
        <div>
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button type="primary" onClick={() => navigate("/signup")}>
            SignUp
          </Button>
        </div>
      </form>
    </main>
  );
}
