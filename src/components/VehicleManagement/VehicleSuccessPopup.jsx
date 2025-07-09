import React from "react";
import "../../App.css";

const VehicleSuccessPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content vehicle-success-popup">
        <div className="vehicle-success-icon">✓</div>
        <h2>Success</h2>
        <p>Vehicle has been added successfully!</p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default VehicleSuccessPopup;
