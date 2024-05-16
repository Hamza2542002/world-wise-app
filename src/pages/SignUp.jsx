import { useState } from "react";
import styles from "./SignUp.module.css";
import Button from "../components/Button";
import { useAuth } from "../context/FakeAuthContext";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    const user = {
      userName: name,
      email,
      password,
      // avatar: "https://i.pravatar.cc/100?u=zz",
      // cities: [],
    };
    e.preventDefault();
    await signup(user);
    navigate("/app/cities");
  }

  return (
    <main className={styles.login}>
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
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
        <div>
          <Button type="primary" onClick={handleSignup}>
            SignUp
          </Button>
        </div>
      </form>
    </main>
  );
}

export default SignUp;
