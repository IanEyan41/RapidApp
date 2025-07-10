import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../EmployeeManagement/EmployeeDetail.css";
import { BsArrowLeft, BsPencil } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import DeleteConfirmation from "./DeleteConfirmation";

const VehicleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchVehicleDetail = async () => {
      try {
        const docRef = doc(db, "vehicle-management", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVehicleData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Vehicle record not found");
        }
      } catch (err) {
        setError("Failed to fetch vehicle details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchVehicleDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/vehicle-management");
  };

  const handleEdit = () => {
    navigate(`/vehicle-management/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  if (loading) {
    return <div className="employee-detail-loading">Loading...</div>;
  }
  if (error) {
    return <div className="employee-detail-error">{error}</div>;
  }
  if (!vehicleData) {
    return <div className="employee-detail-error">No data found</div>;
  }

  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Vehicle Details</h1>
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
            <h2>Vehicle Details</h2>
            <div className="detail-actions">
              <button className="edit-button" onClick={handleEdit}>
                <BsPencil /> Edit
              </button>
            </div>
          </div>
          <section className="detail-section">
            <h3>Vehicle Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Plate Number:</label>
                <span>{vehicleData.plateNumber}</span>
              </div>
              <div className="detail-item">
                <label>Vehicle Type:</label>
                <span>{vehicleData.vehicleType}</span>
              </div>
              <div className="detail-item">
                <label>Manufacturing Year:</label>
                <span>{vehicleData.manufactureYear}</span>
              </div>
              <div className="detail-item">
                <label>Capacity:</label>
                <span>{vehicleData.capacity}</span>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h3>Maintenance Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Last Maintenance:</label>
                <span>{vehicleData.lastMaintenance}</span>
              </div>
              <div className="detail-item">
                <label>Next Scheduled:</label>
                <span>{vehicleData.nextScheduled}</span>
              </div>
              <div className="detail-item">
                <label>Maintenance Date:</label>
                <span>{vehicleData.maintenanceDate}</span>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h3>Route Assignment</h3>
            <div className="route-display">
              <div className="route-number">{vehicleData.routeCode}</div>
              <div className="route-path">
                {Array.isArray(vehicleData.routes)
                  ? vehicleData.routes.map((stop, idx) => (
                      <React.Fragment key={idx}>
                        <span className="route-stop">{stop}</span>
                        {idx < vehicleData.routes.length - 1 && (
                          <span className="route-arrow">→</span>
                        )}
                      </React.Fragment>
                    ))
                  : null}
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete Vehicle
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onConfirm={() => {}}
        onCancel={() => setShowDeleteConfirmation(false)}
        id={id}
        formData={vehicleData}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />
    </div>
  );
};

export default VehicleDetail;
