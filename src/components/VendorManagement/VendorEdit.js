import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VendorManagement.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import DeleteConfirmation from "./DeleteConfirmation";
import VendorDeleteSuccessPopup from "./VendorDeleteSuccessPopup";
import VendorEditSuccessPopup from "./VendorEditSuccessPopup";

const VendorEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    contractorName: "",
    ownerName: "",
    primaryContact: "",
    phoneNumber: "",
    email: "",
    address: "",
    postalCode: "",
    country: "Malaysia",
    state: "",
    city: "",
    totalVehicles: "",
    contractDuration: "",
    contractNumber: "",
    routeCode: "1",
    routes: [],
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
    const fetchVendorData = async () => {
      try {
        const docRef = doc(db, "vendor-management", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            contractorName: data.contractorName || "",
            ownerName: data.ownerName || "",
            primaryContact: data.primaryContact || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            address: data.address || "",
            postalCode: data.postalCode || "",
            country: data.country || "Malaysia",
            state: data.state || "",
            city: data.city || "",
            totalVehicles: data.totalVehicles || "",
            contractDuration: data.contractDuration || "",
            contractNumber: data.contractNumber || "",
            routeCode: data.routeCode || "1",
            routes: data.routes || [],
          });
        } else {
          setError("Vendor record not found");
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Failed to fetch vendor data");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchVendorData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoutesChange = (idx, value) => {
    setFormData((prevState) => {
      const newRoutes = [...prevState.routes];
      newRoutes[idx] = value;
      return { ...prevState, routes: newRoutes };
    });
  };

  const handleAddRoute = () => {
    setFormData((prevState) => ({
      ...prevState,
      routes: [...prevState.routes, ""],
    }));
  };

  const handleRemoveRoute = (idx) => {
    setFormData((prevState) => {
      const newRoutes = prevState.routes.filter((_, i) => i !== idx);
      return { ...prevState, routes: newRoutes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const docRef = doc(db, "vendor-management", id);
      await updateDoc(docRef, formData);
      const user = auth.currentUser;
      await recordActivity(user, `Updated vendor ${formData.contractorName}`);
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
      const docRef = doc(db, "vendor-management", id);
      await deleteDoc(docRef);
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
    navigate("/vendor-management");
  };

  const handleEditSuccessClose = () => {
    setShowEditSuccessPopup(false);
    navigate(`/vendor-management/detail/${id}`);
  };

  const handleBack = () => {
    navigate(`/vendor-management/detail/${id}`);
  };

  if (loading) {
    return <div className="employee-detail-loading">Loading...</div>;
  }
  if (error) {
    return <div className="employee-detail-error">{error}</div>;
  }
  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Edit Vendor</h1>
          <div className="header-controls-em">
            <div className="theme-toggle-em" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon-em" />
              ) : (
                <BsMoon className="theme-icon-em" />
              )}
            </div>
          </div>
        </header>
        <button className="em-back-button" onClick={handleBack}>
          <BsArrowLeft /> Back
        </button>
        <div className="employee-detail-content">
          <div className="detail-header">
            <h2>Edit Vendor Form</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="detail-section">
              <h3>Company Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Contractor Name</label>
                  <input
                    type="text"
                    name="contractorName"
                    value={formData.contractorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Contact & Address Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Contact</label>
                  <input
                    type="text"
                    name="primaryContact"
                    value={formData.primaryContact}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
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
              <h3>Fleet & Contract</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Vehicles</label>
                  <input
                    type="number"
                    name="totalVehicles"
                    value={formData.totalVehicles}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contract Duration</label>
                  <input
                    type="text"
                    name="contractDuration"
                    value={formData.contractDuration}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contract Number</label>
                  <input
                    type="text"
                    name="contractNumber"
                    value={formData.contractNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Routes Covered</h3>
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
                <div className="form-group full-width">
                  <label>Routes</label>
                  {formData.routes.map((route, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <input
                        type="text"
                        value={route}
                        onChange={(e) =>
                          handleRoutesChange(idx, e.target.value)
                        }
                        placeholder={`Route ${idx + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRoute(idx)}
                        style={{ marginLeft: 8 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddRoute}
                    style={{ marginTop: 8 }}
                  >
                    Add Route
                  </button>
                </div>
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
      <VendorDeleteSuccessPopup
        isOpen={showDeleteSuccessPopup}
        onClose={handleDeleteSuccessClose}
        vendorName={formData.contractorName}
      />
      <VendorEditSuccessPopup
        isOpen={showEditSuccessPopup}
        onClose={handleEditSuccessClose}
        vendorName={formData.contractorName}
      />
    </div>
  );
};

export default VendorEdit;
