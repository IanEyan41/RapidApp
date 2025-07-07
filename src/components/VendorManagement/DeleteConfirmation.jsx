import React, { useState } from "react";
import "../OvertimeManagement/OvertimeForm.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import VendorDeleteSuccessPopup from "./VendorDeleteSuccessPopup";

const DeleteConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  id,
  formData, // should contain contractorName
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
      const docRef = doc(db, "vendor-management", id);
      const user = auth.currentUser;
      await recordActivity(user, `Deleted vendor ${formData.contractorName}`);
      await deleteDoc(docRef);
      setShowDeleteConfirmation(false);
      setShowDeleteSuccessPopup(true);
      if (onConfirm) onConfirm();
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError("Failed to delete record. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessPopup(false);
    navigate("/vendor-management");
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
                Are you sure you want to delete this vendor record? This action
                cannot be undone.
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
      <VendorDeleteSuccessPopup
        isOpen={showDeleteSuccessPopup}
        onClose={handleDeleteSuccessClose}
        vendorName={formData?.contractorName}
      />
    </>
  );
};

export default DeleteConfirmation;
