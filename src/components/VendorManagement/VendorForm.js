import React, { useState } from "react";
import "../OvertimeManagement/OvertimeForm.css";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTheme } from "../../services/ThemeContext";
import VendorSuccessPopup from "./VendorSuccessPopup";

const VendorForm = ({ isOpen, onClose, onSubmit }) => {
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { theme } = useTheme();

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
      const vendorData = {
        ...formData,
        createdAt: serverTimestamp(),
      };
      if (onSubmit) {
        await onSubmit(vendorData);
      }
      setShowSuccessPopup(true);
      setFormData({
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
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${theme}-theme`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add Vendor</h2>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-section">
              <h3>Basic Info</h3>
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
            <div className="form-section">
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
            <div className="form-section">
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
            <div className="form-section">
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
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSuccessPopup && <VendorSuccessPopup onClose={handleSuccessClose} />}
    </>
  );
};

export default VendorForm;
