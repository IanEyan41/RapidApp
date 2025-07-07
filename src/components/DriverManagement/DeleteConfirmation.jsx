import React from "react";
import "../EmployeeManagement/EmployeeDetail.css";

const DeleteConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  id,
  formData,
  setShowDeleteConfirmation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-overlay">
      <div className="confirmation-dialog">
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete driver{" "}
          <strong>{formData.driverName}</strong> with license number{" "}
          <strong>{formData.driverLicense}</strong>?
        </p>
        <div className="confirmation-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
