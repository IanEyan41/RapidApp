import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./VendorDetail.css";
import { BsArrowLeft, BsPencil } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const VendorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchVendorDetail = async () => {
      try {
        const docRef = doc(db, "vendor-management", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVendorData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Vendor record not found");
        }
      } catch (err) {
        console.error("Error fetching vendor details:", err);
        setError("Failed to fetch vendor details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchVendorDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/vendor-management");
  };

  const handleEdit = () => {
    navigate(`/vendor-management/edit/${id}`);
  };

  if (loading) {
    return <div className="employee-detail-loading">Loading...</div>;
  }
  if (error) {
    return <div className="employee-detail-error">{error}</div>;
  }
  if (!vendorData) {
    return <div className="employee-detail-error">No data found</div>;
  }

  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Vendor Details</h1>
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
            <h2>Vendor Details</h2>
            <button className="edit-button" onClick={handleEdit}>
              <BsPencil /> Edit
            </button>
          </div>
          <section className="detail-section">
            <h3>Company Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Contractor Name:</label>
                <span>{vendorData.contractorName}</span>
              </div>
              <div className="detail-item">
                <label>Owner:</label>
                <span>{vendorData.ownerName}</span>
              </div>
              <div className="detail-item full-width">
                <label>Address:</label>
                <span>{vendorData.address}</span>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h3>Fleet Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Total Vehicles:</label>
                <span>{vendorData.totalVehicles}</span>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Primary Contact:</label>
                <span>{vendorData.primaryContact}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label>
                <span>{vendorData.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{vendorData.email}</span>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h3>Contract Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Contract Duration:</label>
                <span>{vendorData.contractDuration}</span>
              </div>
              <div className="detail-item">
                <label>Contract Number:</label>
                <span>{vendorData.contractNumber}</span>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h3>Routes Covered</h3>
            <div className="route-display">
              <div className="route-number">{vendorData.routeCode}</div>
              <div className="route-path">
                {Array.isArray(vendorData.routes) &&
                  vendorData.routes.map((route, idx) => (
                    <React.Fragment key={idx}>
                      <span className="route-stop">{route}</span>
                      {idx < vendorData.routes.length - 1 && (
                        <span className="route-arrow">→</span>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
