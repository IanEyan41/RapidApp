import React from "react";
import "../App.css";

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="success-icon">✓</div>
        <h2>Success!</h2>
        <p>{message}</p>
        <button className="sign-in-btn" onClick={onClose}>
          Create Another User
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
