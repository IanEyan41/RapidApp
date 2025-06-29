import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import amtelLogo from "../Asset/Amtel_logo.png";
import { createAdminUser, auth } from "../services/firebase";
import SuccessPopup from "./SuccessPopup";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
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
    setName("");
    setUsername("");
    setPhoneNumber("");
    setCountry("");
    setState("");
    setCity("");
    setAddress("");
    setPostalCode("");
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
      if (!auth.currentUser) {
        setError("You must be logged in as SuperAdmin to create admin users");
        setLoading(false);
        return;
      }

      const profileData = {
        name,
        username,
        phoneNumber,
        country,
        state,
        city,
        address,
        postalCode,
      };

      const {
        user,
        error: registrationError,
        role,
      } = await createAdminUser(
        email,
        password,
        department,
        auth.currentUser.uid,
        profileData
      );

      if (registrationError) {
        setError(registrationError);
        return;
      }

      if (user) {
        setSuccessMessage(
          `Admin user ${email} has been created successfully for ${department} department!`
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
        <h1>Create Admin User</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
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

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country"
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter state/province"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label>Postal/ZIP Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal/zip code"
            />
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Creating Admin..." : "Create Admin User"}
          </button>

          <button
            type="button"
            className="back-to-login-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Home
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
