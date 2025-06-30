import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OvertimeForm.css";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import DeleteConfirmation from "./DeleteConfirmation";

const OvertimeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOvertimeData = async () => {
      try {
        const docRef = doc(db, "overtime-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            employeeNumber: data.employeeNumber || "",
            employeeName: data.employeeName || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            address: data.address || "",
            postalCode: data.postalCode || "",
            shift: data.shift || "A",
            department: data.department || "Production",
            location: data.location || "",
            routeCode: data.routeCode || "",
            dateIn: data.dateIn || "",
            dateOut: data.dateOut || "",
          });
        } else {
          setError("Overtime record not found");
        }
      } catch (err) {
        console.error("Error fetching overtime data:", err);
        setError("Failed to fetch overtime data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOvertimeData();
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
      const docRef = doc(db, "overtime-management", id);
      await updateDoc(docRef, formData);

      // Navigate back to detail view
      navigate(`/overtime-management/detail/${id}`);
    } catch (err) {
      console.error("Error updating document: ", err);
      setError("Failed to update form. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/overtime-management/detail/${id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const docRef = doc(db, "overtime-management", id);
      await deleteDoc(docRef);
      navigate("/overtime-management");
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError("Failed to delete record. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  if (loading) {
    return <div className="overtime-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="overtime-detail-error">{error}</div>;
  }

  return (
    <div className={`ot-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="ot-main-content">
        <header className="ot-header">
          <h1>Edit Overtime</h1>
          <div className="header-controls-ot">
            <div className="theme-toggle-ot" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon-ot" />
              ) : (
                <BsMoon className="theme-icon-ot" />
              )}
            </div>
          </div>
        </header>

        <button className="ot-back-button" onClick={handleBack}>
          <BsArrowLeft /> Back
        </button>

        <div className="overtime-detail-content">
          <div className="detail-header">
            <h2>Edit Overtime Form</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="detail-section">
              <h3>Employee Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee Number/Signs</label>
                  <input
                    type="text"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleChange}
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
                  <label>Employee Address</label>
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

            <div className="detail-section">
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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Routes Assignment</h3>
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

            <div className="detail-section">
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
      />
    </div>
  );
};

export default OvertimeEdit;
 