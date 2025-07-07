import React from "react";
import "../../App.css";

const VendorEditSuccessPopup = ({ isOpen, onClose, vendorName }) => {
  if (!isOpen) return null;
  return (
    <div className="popup-overlay">
      <div className="popup-content employee-success-popup">
        <div className="employee-success-icon">✓</div>
        <h2>Success</h2>
        <p>
          {vendorName
            ? `Vendor ${vendorName} has been updated successfully!`
            : "Vendor has been updated successfully!"}
        </p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default VendorEditSuccessPopup;
