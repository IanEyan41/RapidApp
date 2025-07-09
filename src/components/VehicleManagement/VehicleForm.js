import React, { useState } from "react";
import "../OvertimeManagement/OvertimeForm.css";
import { useTheme } from "../../services/ThemeContext";
import VehicleSuccessPopup from "./VehicleSuccessPopup";

const VehicleForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    plateNumber: "",
    vehicleType: "Bus",
    manufactureYear: "",
    capacity: "",
    lastMaintenance: "",
    nextScheduled: "",
    routeCode: "1",
    routes: [],
    uploadRoute: "",
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

  const handleRouteChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      routes: e.target.value.split(",").map((r) => r.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const vehicleData = {
        ...formData,
        capacity: Number(formData.capacity),
        manufactureYear: Number(formData.manufactureYear),
      };
      if (onSubmit) {
        await onSubmit(vehicleData);
      }
      setShowSuccessPopup(true);
      setFormData({
        plateNumber: "",
        vehicleType: "Bus",
        manufactureYear: "",
        capacity: "",
        lastMaintenance: "",
        nextScheduled: "",
        routeCode: "1",
        routes: [],
        uploadRoute: "",
      });
    } catch (err) {
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
            <h2>Add Bus</h2>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-section">
              <h3>Vehicle Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Plate Number</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    placeholder="PGY 7321"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    placeholder="Transit Bus"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Manufacture Year</label>
                  <input
                    type="number"
                    name="manufactureYear"
                    value={formData.manufactureYear}
                    onChange={handleChange}
                    placeholder="2020"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="42"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Maintenance Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Last Maintenance</label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Next Scheduled</label>
                  <input
                    type="date"
                    name="nextScheduled"
                    value={formData.nextScheduled}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Routes Assignment</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Route Code</label>
                  <input
                    type="text"
                    name="routeCode"
                    value={formData.routeCode}
                    onChange={handleChange}
                    placeholder="1"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Routes</label>
                  <input
                    type="text"
                    name="routes"
                    value={formData.routes.join(", ")}
                    onChange={handleRouteChange}
                    placeholder="Mattel Perai, Perai, Seberang Jaya, ..."
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Upload Route</label>
                  <input
                    type="text"
                    name="uploadRoute"
                    value={formData.uploadRoute}
                    onChange={handleChange}
                    placeholder="Add Route..."
                  />
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
      {showSuccessPopup && <VehicleSuccessPopup onClose={handleSuccessClose} />}
    </>
  );
};

export default VehicleForm;
