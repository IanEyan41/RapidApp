import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DriverManagement.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { BsArrowLeft, BsTrash } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import DriverEditSuccessPopup from "./DriverEditSuccessPopup";
import DeleteConfirmation from "./DeleteConfirmation";
import DriverDeleteSuccessPopup from "./DriverDeleteSuccessPopup";

const DriverEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    driverName: "",
    driverNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
    licenseNumber: "",
    licenseClass: "",
    licenseExpiry: "",
    experience: "",
    vehicleAssigned: "",
    shift: "A",
    routeCode: "14",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setDepartment(userData.department || userData.role);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const docRef = doc(db, "driver-management", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            driverName: data.driverName || "",
            driverNumber: data.driverNumber || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            address: data.address || "",
            licenseNumber: data.licenseNumber || "",
            licenseClass: data.licenseClass || "",
            licenseExpiry: data.licenseExpiry || "",
            experience: data.experience || "",
            vehicleAssigned: data.vehicleAssigned || "",
            shift: data.shift || "A",
            routeCode: data.routeCode || "14",
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
      const user = auth.currentUser;
      await recordActivity(
        user,
        `Updated driver ${formData.driverName} (${formData.driverNumber})`
      );
      setShowSuccessPopup(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error updating document: ", err);
      setError("Failed to update form. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const docRef = doc(db, "driver-management", id);

      // Record the activity
      const user = auth.currentUser;
      await recordActivity(
        user,
        `Deleted driver ${formData.driverName} (${formData.driverNumber})`
      );

      // Delete the document
      await deleteDoc(docRef);

      setShowDeleteConfirmation(false);
      setShowDeleteSuccessPopup(true);
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError("Failed to delete driver. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessPopup(false);
    navigate("/driver-management");
  };

  const handleBack = () => {
    navigate(`/driver-management/detail/${id}`);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
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
      <Sidebar userRole={department || userRole} />
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
            {error && <div className="dm-error-message">{error}</div>}
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Driver ID</label>
                  <input
                    type="text"
                    name="driverNumber"
                    value={formData.driverNumber}
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
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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
            </div>
            <div className="detail-section">
              <h3>License Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>License Class</label>
                  <input
                    type="text"
                    name="licenseClass"
                    value={formData.licenseClass}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Assignment</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Assigned</label>
                  <input
                    type="text"
                    name="vehicleAssigned"
                    value={formData.vehicleAssigned}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Shift</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    required
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
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
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Update"}
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                <BsTrash /> Delete Driver
              </button>
            </div>
          </form>
        </div>
      </div>

      <DriverEditSuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        driverName={formData.driverName}
      />

      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        id={id}
        formData={formData}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />

      <DriverDeleteSuccessPopup
        isOpen={showDeleteSuccessPopup}
        onClose={handleDeleteSuccessClose}
        driverName={formData.driverName}
      />
    </div>
  );
};

export default DriverEdit;
