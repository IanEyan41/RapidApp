import React from "react";
import { FiLogOut } from "react-icons/fi";
import "../App.css";

const LogoutConfirmation = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="logout-icon">
          <FiLogOut size={40} />
        </div>
        <h2 style={{ color: "#000" }}>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="popup-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="sign-in-btn" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
