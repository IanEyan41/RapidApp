import React from "react";

const DriverSuccessPopup = ({ isOpen, onClose, driverName }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content employee-success-popup">
        <div className="employee-success-icon">✓</div>
        <h2>Success</h2>
        <p>
          {driverName ? `${driverName} has` : "Driver has"} been added
          successfully!
        </p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default DriverSuccessPopup;
