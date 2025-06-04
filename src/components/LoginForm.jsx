import React, { useState } from "react";
import "../App.css";
import amtelLogo from "../Asset/Amtel_logo.png";
import { loginWithEmailAndPassword } from "../services/firebase";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, error } = await loginWithEmailAndPassword(
        username,
        password
      );
      if (error) {
        setError(error);
      } else {
        // Handle successful login
        console.log("Logged in user:", user);
        // You can redirect the user or update the app state here
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form login-only">
      <img src={amtelLogo} alt="Amtel Logo" className="logo" />
      <h1>Welcome!</h1>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-input">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="sign-in-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="create-account">
        <a href="#">Terms and Conditions</a>
      </p>
    </div>
  );
};

export default LoginForm;
