import React from "react";
import "./OvertimeForm.css";

const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirmation">
        <div className="modal-header">
          <h2>Delete Confirmation</h2>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete this overtime record? This action
            cannot be undone.
          </p>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
