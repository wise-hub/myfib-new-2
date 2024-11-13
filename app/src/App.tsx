import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "@pages/login";
import AuthPage from "@pages/auth";
import Dashboard from "@pages/dashboard";
import NotFound from "@pages/notfound";
import MainLayout from "@components/MainLayout";
import Accounts from "@pages/accounts";
import Cards from "@pages/cards";
import ProtectedRoute from "@components/ProtectedRoute";
import "@styles/global.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/cards" element={<Cards />} />
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
