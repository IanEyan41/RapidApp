import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./OvertimeDetail.css";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const OvertimeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [overtimeData, setOvertimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchOvertimeDetail = async () => {
      try {
        const docRef = doc(db, "overtime-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOvertimeData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Overtime record not found");
        }
      } catch (err) {
        console.error("Error fetching overtime details:", err);
        setError("Failed to fetch overtime details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOvertimeDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/overtime-management");
  };

  const handleEdit = () => {
    navigate(`/overtime-management/edit/${id}`);
  };

  if (loading) {
    return <div className="overtime-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="overtime-detail-error">{error}</div>;
  }

  if (!overtimeData) {
    return <div className="overtime-detail-error">No data found</div>;
  }

  return (
    <div className={`ot-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="ot-main-content">
        <header className="ot-header">
          <h1>Overtime Details</h1>
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
            <h2>Overtime Details</h2>
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
          </div>

          <section className="detail-section">
            <h3>Employee Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Employee Number / ID:</label>
                <span>{overtimeData.employeeNumber}</span>
              </div>
              <div className="detail-item">
                <label>Employee Name:</label>
                <span>{overtimeData.employeeName}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number:</label>
                <span>{overtimeData.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{overtimeData.email}</span>
              </div>
              <div className="detail-item full-width">
                <label>Address:</label>
                <span>{overtimeData.address}</span>
              </div>
              <div className="detail-item">
                <label>Postal/ZIP Code:</label>
                <span>{overtimeData.postalCode}</span>
              </div>
              <div className="detail-item">
                <label>Shift:</label>
                <span>{overtimeData.shift}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Department Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Department:</label>
                <span>{overtimeData.department}</span>
              </div>
              <div className="detail-item">
                <label>Location:</label>
                <span>{overtimeData.location}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Route</h3>
            <div className="route-display">
              <div className="route-number">14</div>
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

          <section className="detail-section">
            <h3>Date and Time</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Date in/out:</label>
                <span>
                  {overtimeData.dateIn} - {overtimeData.dateOut}
                </span>
              </div>
              <div className="detail-item">
                <label>Time in/out:</label>
                <span>7:00 - 14:00 (12hour)</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OvertimeDetail;
