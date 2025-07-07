import React, { useState } from "react";
import "./OvertimeForm.css";
import { db, auth, recordActivity } from "../../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useTheme } from "../../services/ThemeContext";

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

  const createNotification = async (user, overtimeData, docId) => {
    try {
      console.log("Creating notification for:", {
        user: user.displayName || user.email,
        overtimeData,
        docId,
      });

      // Get user profile to get the username
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const username =
        userData?.username || userData?.name || user.displayName || user.email;

      const notificationData = {
        user: username, // Use username instead of email
        userId: user.uid, // Store user ID for future reference
        timestamp: serverTimestamp(),
        title: "New OT Request",
        message: `Kindly approve or disapprove this new request from ${overtimeData.employeeName}.`,
        status: "pending",
        overtimeId: docId, // Reference to the overtime request
        type: "overtime_request",
      };

      console.log("Notification data:", notificationData);

      const docRef = await addDoc(
        collection(db, "notification"),
        notificationData
      );
      console.log("Notification created with ID:", docRef.id);

      return docRef;
    } catch (error) {
      console.error("Error creating notification:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      // Don't throw the error - we don't want to fail the whole submission if notification fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = auth.currentUser;

      // Add timestamp to the form data
      const overtimeData = {
        ...formData,
        createdAt: serverTimestamp(),
        status: "pending", // Adding a default status
        createdBy: user.uid, // Add user ID who created the request
        createdByName: user.displayName || user.email, // Add user name who created the request
      };

      // Add document to Firestore
      const docRef = await addDoc(
        collection(db, "overtime-management"),
        overtimeData
      );
      console.log("Document written with ID: ", docRef.id);

      // Create notification
      await createNotification(user, overtimeData, docRef.id);

      // Record the activity
      await recordActivity(
        user,
        `Created overtime request for ${overtimeData.employeeName} (${overtimeData.employeeNumber})`
      );

      // Call the onSubmit prop if provided (for any additional handling in parent)
      if (onSubmit) {
        await onSubmit();
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
        routeCode: "",
        dateIn: "",
        dateOut: "",
      });
    } catch (err) {
      console.error("Error submitting form: ", err);
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
          <h2>Add Overtime Form</h2>
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
                  placeholder="0007"
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
                  placeholder="Muhammad Haziq bin Roslan"
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
                  placeholder="muhammed.haziq43@gmail.com"
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
                  placeholder="Lintang Hajjah Rehmah 1, Jelutong, 11600 George Town, Penang,Malaysia"
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
                  placeholder="43300"
                  required
                />
              </div>
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
            <h3>Routes Assignment</h3>
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
          </div>

          <div className="form-section">
            <h3>Date</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Date In</label>
                <input
                  type="date"
                  name="dateIn"
                  value={formData.dateIn}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date Out</label>
                <input
                  type="date"
                  name="dateOut"
                  value={formData.dateOut}
                  onChange={handleChange}
                  required
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
  );
};

export default OvertimeForm;
