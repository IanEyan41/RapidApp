import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../services/firebase";
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
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Fetch user data and driver details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
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

        // Fetch driver details
        const docRef = doc(db, "driver-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDriverData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Driver record not found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
    <div className={`driver-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="driver-main-content">
        <header className="driver-header">
          <h1>Driver Details</h1>
          <div className="header-controls-driver">
            <div className="theme-toggle-driver" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon-driver" />
              ) : (
                <BsMoon className="theme-icon-driver" />
              )}
            </div>
          </div>
        </header>

        <button className="driver-back-button" onClick={handleBack}>
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
                <label>Driver ID:</label>
                <span>{driverData.driverNumber}</span>
              </div>
              <div className="detail-item">
                <label>Full Name:</label>
                <span>{driverData.driverName}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number:</label>
                <span>{driverData.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{driverData.email}</span>
              </div>
              <div className="detail-item full-width">
                <label>Address:</label>
                <span>{driverData.address}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>License Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>License Number:</label>
                <span>{driverData.licenseNumber}</span>
              </div>
              <div className="detail-item">
                <label>License Class:</label>
                <span>{driverData.licenseClass}</span>
              </div>
              <div className="detail-item">
                <label>Expiry Date:</label>
                <span className="license-validity">
                  {driverData.licenseExpiry}
                </span>
              </div>
              <div className="detail-item">
                <label>Years of Experience:</label>
                <span>{driverData.experience} years</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Assignment</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Vehicle Assigned:</label>
                <span>{driverData.vehicleAssigned}</span>
              </div>
              <div className="detail-item">
                <label>Shift:</label>
                <span>{driverData.shift}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Route</h3>
            <div className="route-display">
              <div className="route-number">{driverData.routeCode || "14"}</div>
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

export default DriverDetail;
