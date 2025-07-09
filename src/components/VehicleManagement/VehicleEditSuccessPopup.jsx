import React from "react";
import "../../App.css";

const VehicleEditSuccessPopup = ({ isOpen, onClose, vehicleName }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content vehicle-success-popup">
        <div className="vehicle-success-icon">✓</div>
        <h2>Success</h2>
        <p>
          {vehicleName
            ? `Vehicle ${vehicleName} has been updated successfully!`
            : "Vehicle has been updated successfully!"}
        </p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default VehicleEditSuccessPopup;
