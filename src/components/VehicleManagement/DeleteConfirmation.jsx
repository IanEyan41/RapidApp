import React, { useState } from "react";
import "../OvertimeManagement/OvertimeForm.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import VehicleDeleteSuccessPopup from "./VehicleDeleteSuccessPopup";

const DeleteConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  id,
  formData, // should contain plateNumber
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
      const docRef = doc(db, "vehicle-management", id);
      const user = auth.currentUser;
      await recordActivity(user, `Deleted vehicle ${formData.plateNumber}`);
      await deleteDoc(docRef);
      setShowDeleteConfirmation(false);
      setShowDeleteSuccessPopup(true);
      if (onConfirm) onConfirm();
    } catch (err) {
      setError("Failed to delete record. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessPopup(false);
    navigate("/vehicle-management");
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
                Are you sure you want to delete this vehicle record? This action
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
      <VehicleDeleteSuccessPopup
        isOpen={showDeleteSuccessPopup}
        onClose={handleDeleteSuccessClose}
        vehicleName={formData?.plateNumber}
      />
    </>
  );
};

export default DeleteConfirmation;
