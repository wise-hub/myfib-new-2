import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@styles/login.module.css";

const LoginPage = () => {
  const [token, setToken] = useState("7a507174-5ccf-4d82-9fb7-75b59867e12b");
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      console.log("TOKEN_FROM_LOGIN>" + token);
      navigate(`/auth#token=${token}`);
    } else {
      setError("OAuth2 Access Token is required");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Вход в My Fibank</h2>
        <form onSubmit={handleLogin}>
          <label className={styles.label} htmlFor="token">
            OAuth2 Access Token
          </label>
          <input
            id="token"
            type="text"
            placeholder="9bf492d5-d9e6-468d-8bf8-136eddb42e7d"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={styles.inputField}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Вход..." : "ВХОД"}
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
