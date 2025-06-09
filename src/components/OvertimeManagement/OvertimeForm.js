import React, { useState } from "react";
import "./OvertimeForm.css";

const OvertimeForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    employeeName: "",
    phoneNumber: "",
    email: "",
    address: "",
    postalCode: "",
    shift: "A",
    department: "Production",
    location: "",
    routeCode: "",
    dateIn: "",
    dateOut: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Overtime Form</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Employee Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Employee Number/Signs</label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  placeholder="0007"
                />
              </div>
              <div className="form-group">
                <label>Employee Name:</label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Muhammad Haziq bin Roslan"
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
                  placeholder="+60 12-345 6789"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="muhammed.haziq43@gmail.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Employee Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Lintang Hajjah Rehmah 1, Jelutong, 11600 George Town, Penang,Malaysia"
                />
              </div>
              <div className="form-group">
                <label>Postal/ZIP Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="43300"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Shift</label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Department Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Production">Production</option>
                  <option value="HR">HR</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Production Room 18"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Routes Assignment</h3>
            <div className="form-group">
              <label>Route Code</label>
              <input
                type="text"
                name="routeCode"
                value={formData.routeCode}
                onChange={handleChange}
                placeholder="1"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Date</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Date In</label>
                <input
                  type="text"
                  name="dateIn"
                  value={formData.dateIn}
                  onChange={handleChange}
                  placeholder="25/5/2025"
                />
              </div>
              <div className="form-group">
                <label>Date Out</label>
                <input
                  type="text"
                  name="dateOut"
                  value={formData.dateOut}
                  onChange={handleChange}
                  placeholder="25/5/2025"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OvertimeForm;
