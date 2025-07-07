import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./DriverDetail.css";
import { BsArrowLeft, BsPencil } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const DriverDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchDriverDetail = async () => {
      try {
        const docRef = doc(db, "driver-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDriverData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Driver record not found");
        }
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError("Failed to fetch driver details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriverDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/driver-management");
  };

  const handleEdit = () => {
    navigate(`/driver-management/edit/${id}`);
  };

  if (loading) {
    return <div className="driver-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="driver-detail-error">{error}</div>;
  }

  if (!driverData) {
    return <div className="driver-detail-error">No data found</div>;
  }

  return (
    <div className={`dm-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="dm-main-content">
        <header className="dm-header">
          <h1>Driver Details</h1>
          <div className="header-controls-dm">
            <div className="theme-toggle-dm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon-dm" />
              ) : (
                <BsMoon className="theme-icon-dm" />
              )}
            </div>
          </div>
        </header>

        <button className="dm-back-button" onClick={handleBack}>
          <BsArrowLeft /> Back
        </button>

        <div className="driver-detail-content">
          <div className="detail-header">
            <h2>Driver Details</h2>
            <button className="edit-button" onClick={handleEdit}>
              <BsPencil /> Edit
            </button>
          </div>

          <section className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name:</label>
                <span>{driverData.driverName}</span>
              </div>
              <div className="detail-item">
                <label>Age:</label>
                <span>{driverData.age}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number:</label>
                <span>{driverData.phoneNumber}</span>
              </div>
              <div className="detail-item full-width">
                <label>Address:</label>
                <span>{driverData.address}</span>
              </div>
              <div className="detail-item">
                <label>Postal/ZIP Code:</label>
                <span>{driverData.postalCode}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>License Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Driver License:</label>
                <span>{driverData.driverLicense}</span>
              </div>
              <div className="detail-item">
                <label>Valid until:</label>
                <span className="license-validity">
                  {driverData.validUntil}
                </span>
              </div>
              <div className="detail-item">
                <label>PSV License:</label>
                <span>{driverData.psvLicense}</span>
              </div>
              <div className="detail-item">
                <label>Valid until:</label>
                <span className="license-validity">
                  {driverData.psvValidUntil}
                </span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Routes Covered</h3>
            <div className="route-display">
              <div className="route-number">{driverData.routeCode || "1"}</div>
              <div className="route-path">
                <span className="route-stop">Mattel Perai</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Perai</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Seberang Jaya</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Permatang Pauh</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Tasek Gelugor</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Penanti</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;
