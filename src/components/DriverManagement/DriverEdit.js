import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DriverManagement.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import DeleteConfirmation from "./DeleteConfirmation";
import DriverDeleteSuccessPopup from "./DriverDeleteSuccessPopup";
import DriverEditSuccessPopup from "./DriverEditSuccessPopup";

const DriverEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    driverName: "",
    age: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
    driverLicense: "",
    psvLicense: "",
    validUntil: "",
    psvValidUntil: "",
    routeCode: "1",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showEditSuccessPopup, setShowEditSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const docRef = doc(db, "driver-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            driverName: data.driverName || "",
            age: data.age || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            postalCode: data.postalCode || "",
            driverLicense: data.driverLicense || "",
            psvLicense: data.psvLicense || "",
            validUntil: data.validUntil || "",
            psvValidUntil: data.psvValidUntil || "",
            routeCode: data.routeCode || "1",
          });
        } else {
          setError("Driver record not found");
        }
      } catch (err) {
        console.error("Error fetching driver data:", err);
        setError("Failed to fetch driver data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriverData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const docRef = doc(db, "driver-management", id);
      await updateDoc(docRef, formData);

      // Record the activity
      const user = auth.currentUser;
      await recordActivity(
        user,
        `Updated driver ${formData.driverName} (License: ${formData.driverLicense})`
      );

      // Show success popup instead of navigating immediately
      setShowEditSuccessPopup(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error updating document: ", err);
      setError("Failed to update form. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const docRef = doc(db, "driver-management", id);
      await deleteDoc(docRef);

      // Record the activity
      const user = auth.currentUser;
      await recordActivity(
        user,
        `Deleted driver ${formData.driverName} (License: ${formData.driverLicense})`
      );

      // Show success popup instead of navigating immediately
      setShowDeleteConfirmation(false);
      setShowDeleteSuccessPopup(true);
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError("Failed to delete record. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessPopup(false);
    navigate("/driver-management");
  };

  const handleEditSuccessClose = () => {
    setShowEditSuccessPopup(false);
    navigate(`/driver-management/detail/${id}`);
  };

  const handleBack = () => {
    navigate(`/driver-management/detail/${id}`);
  };

  if (loading) {
    return <div className="driver-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="driver-detail-error">{error}</div>;
  }

  return (
    <div className={`dm-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="dm-main-content">
        <header className="dm-header">
          <h1>Edit Driver</h1>
          <div className="header-controls-dm">
            <div className="theme-toggle-dm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon-dm" />
              ) : (
                <BsMoon className="theme-icon-dm" />
              )}
            </div>
          </div>
        </header>

        <button className="dm-back-button" onClick={handleBack}>
          <BsArrowLeft /> Back
        </button>

        <div className="driver-detail-content">
          <div className="detail-header">
            <h2>Edit Driver Form</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Postal/ZIP Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>License Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Driver License</label>
                  <input
                    type="text"
                    name="driverLicense"
                    value={formData.driverLicense}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valid Until</label>
                  <input
                    type="text"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PSV License</label>
                  <input
                    type="text"
                    name="psvLicense"
                    value={formData.psvLicense}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valid Until</label>
                  <input
                    type="text"
                    name="psvValidUntil"
                    value={formData.psvValidUntil}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Routes Covered</h3>
              <div className="form-group">
                <label>Route Code</label>
                <input
                  type="text"
                  name="routeCode"
                  value={formData.routeCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="delete-button"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete
              </button>
              <div className="right-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleBack}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
        id={id}
        formData={formData}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />

      <DriverDeleteSuccessPopup
        isOpen={showDeleteSuccessPopup}
        onClose={handleDeleteSuccessClose}
        driverName={formData.driverName}
      />

      <DriverEditSuccessPopup
        isOpen={showEditSuccessPopup}
        onClose={handleEditSuccessClose}
        driverName={formData.driverName}
      />
    </div>
  );
};

export default DriverEdit;
