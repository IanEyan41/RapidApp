import React from "react";
import "../../App.css";

const EmployeeSuccessPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content employee-success-popup">
        <div className="employee-success-icon">✓</div>
        <h2>Success</h2>
        <p>Employee has been added successfully!</p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default EmployeeSuccessPopup;
