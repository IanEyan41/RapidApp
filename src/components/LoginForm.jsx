import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import amtelLogo from "../Asset/Amtel_logo.png";
import { loginWithEmailAndPassword } from "../services/firebase";
import { useTheme } from "../services/ThemeContext";
import { BsSun, BsMoon, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, role, error } = await loginWithEmailAndPassword(
        username,
        password
      );

      if (error) {
        setError(error);
      } else if (isSuperAdmin && role !== "superadmin") {
        setError("Access denied. Only SuperAdmin users are allowed.");
      } else {
        // Navigate all users to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserType = (type) => {
    setIsSuperAdmin(type === "superadmin");
    setError(""); // Clear any previous errors
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`login-form login-only ${theme}-theme`}>
      <div className="login-toggle-container">
        <div className="segmented-control">
          <button
            type="button"
            className={!isSuperAdmin ? "segment active" : "segment"}
            onClick={() => toggleUserType("admin")}
          >
            Admin
          </button>
          <button
            type="button"
            className={isSuperAdmin ? "segment active" : "segment"}
            onClick={() => toggleUserType("superadmin")}
          >
            Super Admin
          </button>
        </div>
      </div>

      <div className="login-theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? (
          <BsSun className="theme-icon" />
        ) : (
          <BsMoon className="theme-icon" />
        )}
      </div>

      <img src={amtelLogo} alt="Amtel Logo" className="logo" />
      <h1>{isSuperAdmin ? "SuperAdmin Portal" : "Welcome!"}</h1>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={
              isSuperAdmin ? "Enter SuperAdmin email" : "Enter your email"
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                isSuperAdmin
                  ? "Enter SuperAdmin password"
                  : "Enter your password"
              }
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex="-1"
            >
              {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
            </button>
          </div>
        </div>

        {!isSuperAdmin && (
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
        )}

        <button type="submit" className="sign-in-btn" disabled={loading}>
          {loading
            ? "Signing in..."
            : isSuperAdmin
            ? "Access Admin Panel"
            : "Sign In"}
        </button>
      </form>

      {!isSuperAdmin && (
        <p className="create-account">
          <a href="#">Terms and Conditions</a>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
