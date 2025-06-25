import React from "react";
import "../App.css";
import { usePopup } from "../services/PopupContext";

const SuccessPopup = () => {
  const { isOpen, message, hidePopup } = usePopup();

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="success-icon">✓</div>
        <h2>Success!</h2>
        <p>{message}</p>
        <button className="sign-in-btn" onClick={hidePopup}>
          Create Another User
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
