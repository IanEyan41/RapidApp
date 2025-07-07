import React, { useState } from "react";
import { db } from "../../services/firebase";
import { useTheme } from "../../services/ThemeContext";
import DriverSuccessPopup from "./DriverSuccessPopup";

const DriverForm = ({ isOpen, onClose, onSubmit }) => {
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { theme } = useTheme();

  // Generate array of route codes from 1 to 46
  const routeCodes = Array.from({ length: 46 }, (_, i) => (i + 1).toString());

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
      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Show success popup instead of closing immediately
      setShowSuccessPopup(true);

      // Reset form (but don't close it yet)
      setFormData({
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
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    onClose(); // Close the form after success popup is closed
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${theme}-theme`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add Driver Form</h2>
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
                  <label>Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="Mohammed Hafiz Bin Ahmed"
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
                    placeholder="45"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact & Address Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+60 12-345 6789"
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
                    placeholder="No. 25, Jalan Sungai Dua, 11700 Gelugor, Pulau Pinang"
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
                    placeholder="11700"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>License Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Driver License</label>
                  <input
                    type="text"
                    name="driverLicense"
                    value={formData.driverLicense}
                    onChange={handleChange}
                    placeholder="NY12345678"
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
                    placeholder="12/2027"
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
                    placeholder="PSV-987654321"
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
                    placeholder="9/2026"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Routes Covered</h3>
              <div className="form-group">
                <label>Route Code</label>
                <select
                  name="routeCode"
                  value={formData.routeCode}
                  onChange={handleChange}
                  required
                  className="route-select"
                >
                  {routeCodes.map((code) => (
                    <option key={code} value={code}>
                      Route {code}
                    </option>
                  ))}
                </select>
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessPopup && <DriverSuccessPopup onClose={handleSuccessClose} />}
    </>
  );
};

export default DriverForm;
