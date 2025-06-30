import React, { useState } from "react";
import "../OvertimeManagement/OvertimeForm.css";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTheme } from "../../services/ThemeContext";

const EmployeeForm = ({ isOpen, onClose, onSubmit }) => {
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
    routeCode: "89",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

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
      // Add timestamp to the form data
      const employeeData = {
        ...formData,
        createdAt: serverTimestamp(),
      };

      // Add document to Firestore
      const docRef = await addDoc(
        collection(db, "employee-management"),
        employeeData
      );
      console.log("Document written with ID: ", docRef.id);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(employeeData);
      }

      // Close the form
      onClose();

      // Reset form
      setFormData({
        employeeNumber: "",
        employeeName: "",
        phoneNumber: "",
        email: "",
        address: "",
        postalCode: "",
        shift: "A",
        department: "Production",
        location: "",
        routeCode: "89",
      });
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${theme}-theme`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Employee Form</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

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
                  placeholder="0008"
                  required
                />
              </div>
              <div className="form-group">
                <label>Employee Name:</label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Lim Yi Yang"
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
                  placeholder="lim.yiyang@gmail.com"
                  required
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
                  placeholder="Jalan Masjid Kapitan Keling, George Town, 10200 George Town, Penang, Malaysia"
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
                  placeholder="10200"
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
                  required
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
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Route Assignment</h3>
            <div className="form-group">
              <label>Route Code</label>
              <input
                type="text"
                name="routeCode"
                value={formData.routeCode}
                onChange={handleChange}
                placeholder="89"
                required
              />
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
  );
};

export default EmployeeForm;
