// src/pages/notfound.tsx

import React from "react";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a
        href="/dashboard"
        style={{ color: "#007bff", textDecoration: "underline" }}
      >
        Go to Dashboard Page
      </a>
    </div>
  );
};

export default NotFound;
