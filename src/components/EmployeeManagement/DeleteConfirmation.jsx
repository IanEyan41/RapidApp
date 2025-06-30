import React, { useState } from "react";
import "../OvertimeManagement/OvertimeForm.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import EmployeeDeleteSuccessPopup from "./EmployeeDeleteSuccessPopup";

const DeleteConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  id,
  formData, // should contain employeeName and employeeNumber
  setShowDeleteConfirmation,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen && !showDeleteSuccessPopup) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const docRef = doc(db, "employee-management", id);

      const user = auth.currentUser;
      const userName = user.displayName || user.email.split("@")[0];
      await recordActivity(
        userName,
        `Deleted employee ${formData.employeeName} (${formData.employeeNumber})`
      );

      await deleteDoc(docRef);

      // Show success popup instead of navigating immediately
      setShowDeleteConfirmation(false);
      setShowDeleteSuccessPopup(true);

      if (onConfirm) onConfirm(); // Optional callback
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError("Failed to delete record. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessPopup(false);
    navigate("/employee-management");
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirmation">
            <div className="modal-header">
              <h2>Delete Confirmation</h2>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <p>
                Are you sure you want to delete this employee record? This
                action cannot be undone.
              </p>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <EmployeeDeleteSuccessPopup
        isOpen={showDeleteSuccessPopup}
        onClose={handleDeleteSuccessClose}
        employeeName={formData?.employeeName}
      />
    </>
  );
};

export default DeleteConfirmation;
