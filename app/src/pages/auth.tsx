// src/pages/auth.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = () => {
      console.log(window.location);
      const hash = window.location.hash;
      console.log("Hash:", hash);

      if (!hash) {
        navigate("/login", { replace: true });
        return;
      }

      window.history.replaceState(null, "", window.location.pathname);

      const token = hash.match(/token=([0-9a-fA-F-]{36})/)?.[1];
      console.log("Extracted Token:", token);

      if (token) {
        sessionStorage.setItem("token", token);
        document.cookie = `logged=yes; path=/; ${
          process.env.NODE_ENV === "production" ? "Secure; HttpOnly;" : ""
        }`;

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 0);
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleAuth();
  }, [navigate]);

  return null;
};

export default AuthPage;
