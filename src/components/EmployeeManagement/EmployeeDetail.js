import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./EmployeeDetail.css";
import { BsArrowLeft, BsPencil } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const docRef = doc(db, "employee-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployeeData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Employee record not found");
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployeeDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/employee-management");
  };

  const handleEdit = () => {
    navigate(`/employee-management/edit/${id}`);
  };

  if (loading) {
    return <div className="employee-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="employee-detail-error">{error}</div>;
  }

  if (!employeeData) {
    return <div className="employee-detail-error">No data found</div>;
  }

  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Employee Details</h1>
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
            <h2>Employee Details</h2>
            <button className="edit-button" onClick={handleEdit}>
              <BsPencil /> Edit
            </button>
          </div>

          <section className="detail-section">
            <h3>Employee Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Employee Number / ID:</label>
                <span>{employeeData.employeeNumber}</span>
              </div>
              <div className="detail-item">
                <label>Employee Name:</label>
                <span>{employeeData.employeeName}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number:</label>
                <span>{employeeData.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{employeeData.email}</span>
              </div>
              <div className="detail-item full-width">
                <label>Address:</label>
                <span>{employeeData.address}</span>
              </div>
              <div className="detail-item">
                <label>Postal/ZIP Code:</label>
                <span>{employeeData.postalCode}</span>
              </div>
              <div className="detail-item">
                <label>Shift:</label>
                <span>{employeeData.shift}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Department Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Department:</label>
                <span>{employeeData.department}</span>
              </div>
              <div className="detail-item">
                <label>Location:</label>
                <span>{employeeData.location}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Route</h3>
            <div className="route-display">
              <div className="route-number">
                {employeeData.routeCode || "89"}
              </div>
              <div className="route-path">
                <span className="route-stop">Mattel Perai</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Perai</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Seberang Jaya</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Permatang Pauh</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
