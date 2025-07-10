import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EmployeeManagement.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import EmployeeEditSuccessPopup from "./EmployeeEditSuccessPopup";

const EmployeeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
    postalCode: "",
    country: "Malaysia",
    state: "",
    city: "",
    department: "",
    shift: "A",
    location: "",
    routeCode: "1",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    const fetchEmployeeData = async () => {
      try {
        const docRef = doc(db, "employee-management", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            employeeName: data.employeeName || "",
            employeeNumber: data.employeeNumber || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            address: data.address || "",
            postalCode: data.postalCode || "",
            country: data.country || "Malaysia",
            state: data.state || "",
            city: data.city || "",
            department: data.department || "",
            shift: data.shift || "A",
            location: data.location || "",
            routeCode: data.routeCode || "1",
          });
        } else {
          setError("Employee record not found");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch employee data");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEmployeeData();
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
      const docRef = doc(db, "employee-management", id);
      await updateDoc(docRef, formData);
      const user = auth.currentUser;
      await recordActivity(
        user,
        `Updated employee ${formData.employeeName} (${formData.employeeNumber})`
      );
      setShowSuccessPopup(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error updating document: ", err);
      setError("Failed to update form. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/employee-management/detail/${id}`);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    navigate(`/employee-management/detail/${id}`);
  };

  if (loading) {
    return <div className="employee-detail-loading">Loading...</div>;
  }
  if (error) {
    return <div className="employee-detail-error">{error}</div>;
  }
  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Edit Employee</h1>
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
            <h2>Edit Employee Form</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="detail-section">
              <h3>Employee Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Employee Number / ID</label>
                  <input
                    type="text"
                    name="employeeNumber"
                    value={formData.employeeNumber}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Postal/ZIP Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
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
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Department Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
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
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Route Code</label>
                  <input
                    type="text"
                    name="routeCode"
                    value={formData.routeCode}
                    onChange={handleChange}
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
            </div>
          </form>
        </div>
      </div>
      <EmployeeEditSuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        employeeName={formData.employeeName}
      />
    </div>
  );
};

export default EmployeeEdit;
