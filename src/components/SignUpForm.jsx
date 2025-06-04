import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import amtelLogo from "../Asset/Amtel_logo.png";
import { registerWithEmailAndPassword } from "../services/firebase";
import SuccessPopup from "./SuccessPopup";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const departments = ["Human Resources", "Production", "Transport"];

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDepartment("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!department) {
      setError("Please select a department");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const {
        user,
        error: registrationError,
        isAdmin,
      } = await registerWithEmailAndPassword(email, password, department);

      if (registrationError) {
        setError(registrationError);
        return;
      }

      if (user) {
        const role = isAdmin ? "admin" : department;
        setSuccessMessage(
          `User ${email} has been created successfully with ${role} role!${
            isAdmin ? " This is the admin account." : ""
          }`
        );
        setShowSuccessPopup(true);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    resetForm();
  };

  return (
    <>
      <div className="login-form signup-form">
        <img src={amtelLogo} alt="Amtel Logo" className="logo" />
        <h1>Create New User</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
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
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Department</label>
            <div className="radio-group">
              {departments.map((dept) => (
                <label key={dept} className="radio-label">
                  <input
                    type="radio"
                    name="department"
                    value={dept}
                    checked={department === dept}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  {dept}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Creating User..." : "Create User"}
          </button>

          <button
            type="button"
            className="back-to-login-btn"
            onClick={() => navigate("/")}
          >
            Back to Sign In
          </button>
        </form>
      </div>

      {showSuccessPopup && (
        <SuccessPopup message={successMessage} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default SignUpForm;
