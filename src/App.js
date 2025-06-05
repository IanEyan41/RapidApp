import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Dashboard from "./components/Dashboard/Dashboard";
import OvertimeManagement from "./components/OvertimeManagement/OvertimeManagement";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="App">
                <div className="login-container">
                  <LoginForm />
                  <div className="login-image">
                    <img
                      src="/images/Environment.jpg"
                      alt="Office Environment"
                    />
                  </div>
                </div>
              </div>
            )
          }
        />
        <Route
          path="/admin/register"
          element={
            <div className="App">
              <div className="login-container">
                <SignUpForm />
                <div className="login-image">
                  <img src="/images/Environment.jpg" alt="Office Environment" />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/overtime-management"
          element={user ? <OvertimeManagement /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
