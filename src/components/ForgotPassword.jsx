import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../App.css";
import amtelLogo from "../Asset/Amtel_logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form login-only">
      <img src={amtelLogo} alt="Amtel Logo" className="logo" />
      <h1>Reset Password</h1>

      {success ? (
        <div className="success-message">
          <p>Password reset email has been sent! Please check your inbox.</p>
          <button onClick={() => navigate("/login")} className="sign-in-btn">
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="create-account">
            <button
              onClick={() => navigate("/login")}
              className="text-button"
              type="button"
            >
              Back to Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
