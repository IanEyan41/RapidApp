import React from "react";
import "../../App.css";

const EmployeeDeleteSuccessPopup = ({ isOpen, onClose, employeeName }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content employee-success-popup">
        <div className="employee-success-icon">✓</div>
        <h2>Success</h2>
        <p>
          {employeeName
            ? `Employee ${employeeName} has been deleted successfully!`
            : "Employee has been deleted successfully!"}
        </p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default EmployeeDeleteSuccessPopup;
