import React from "react";
import "../../App.css";

const VehicleDeleteSuccessPopup = ({ isOpen, onClose, vehicleName }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content vehicle-success-popup">
        <div className="vehicle-success-icon">✓</div>
        <h2>Success</h2>
        <p>
          {vehicleName
            ? `Vehicle ${vehicleName} has been deleted successfully!`
            : "Vehicle has been deleted successfully!"}
        </p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default VehicleDeleteSuccessPopup;
