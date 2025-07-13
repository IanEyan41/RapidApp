import React, { useState } from "react";
import { db } from "../../services/firebase";
import { useTheme } from "../../services/ThemeContext";
import DriverSuccessPopup from "./DriverSuccessPopup";

const DriverForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    driverName: "",
    driverNumber: "", // Driver ID
    phoneNumber: "",
    email: "", // Email
    address: "",
    postalCode: "",
    licenseNumber: "", // License Number
    licenseClass: "", // License Class
    licenseExpiry: "", // Expiry Date
    experience: "", // Years of Experience
    vehicleAssigned: "", // Vehicle Assigned
    shift: "A", // Shift
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
        const result = await onSubmit(formData);
        if (result) {
          // Only show success popup if submission was successful
          setShowSuccessPopup(true);

          // Reset form data (but don't close it yet)
          setFormData({
            driverName: "",
            driverNumber: "",
            phoneNumber: "",
            email: "",
            address: "",
            postalCode: "",
            licenseNumber: "",
            licenseClass: "",
            licenseExpiry: "",
            experience: "",
            vehicleAssigned: "",
            shift: "A",
            routeCode: "1",
          });
        }
      }
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
                  <label>Driver ID</label>
                  <input
                    type="text"
                    name="driverNumber"
                    value={formData.driverNumber}
                    onChange={handleChange}
                    placeholder="DRV12345"
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
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="driver@example.com"
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
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="MY12345678"
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
                    placeholder="D"
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
                    placeholder="5"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Assignment</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Assigned</label>
                  <input
                    type="text"
                    name="vehicleAssigned"
                    value={formData.vehicleAssigned}
                    onChange={handleChange}
                    placeholder="BUS-123"
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

      <DriverSuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        driverName={formData.driverName}
      />
    </>
  );
};

export default DriverForm;
