import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import envImage from "./Asset/Environment.jpg";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="login-container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <LoginForm />
                  <div className="login-image">
                    <img src={envImage} alt="Office Environment" />
                  </div>
                </>
              }
            />
            <Route
              path="/admin/register"
              element={
                <>
                  <SignUpForm />
                  <div className="login-image">
                    <img src={envImage} alt="Office Environment" />
                  </div>
                </>
              }
            />
            {/* Add a catch-all route that redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
