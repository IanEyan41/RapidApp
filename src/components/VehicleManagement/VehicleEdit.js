import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VehicleManagement.css";
import { auth, db, recordActivity } from "../../services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import VehicleDeleteSuccessPopup from "./VehicleDeleteSuccessPopup";
import VehicleEditSuccessPopup from "./VehicleEditSuccessPopup";
import DeleteConfirmation from "./DeleteConfirmation";

const VehicleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    plateNumber: "",
    vehicleType: "Bus",
    manufactureYear: "",
    capacity: "",
    lastMaintenance: "",
    nextScheduled: "",
    routeCode: "1",
    routes: [],
    uploadRoute: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showEditSuccessPopup, setShowEditSuccessPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
    const fetchVehicleData = async () => {
      try {
        const docRef = doc(db, "vehicle-management", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            plateNumber: data.plateNumber || "",
            vehicleType: data.vehicleType || "Bus",
            manufactureYear: data.manufactureYear || "",
            capacity: data.capacity || "",
            lastMaintenance: data.lastMaintenance || "",
            nextScheduled: data.nextScheduled || "",
            routeCode: data.routeCode || "1",
            routes: data.routes || [],
            uploadRoute: data.uploadRoute || "",
          });
        } else {
          setError("Vehicle record not found");
        }
      } catch (err) {
        setError("Failed to fetch vehicle data");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchVehicleData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRouteChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      routes: e.target.value.split(",").map((r) => r.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const docRef = doc(db, "vehicle-management", id);
      await updateDoc(docRef, {
        ...formData,
        capacity: Number(formData.capacity),
        manufactureYear: Number(formData.manufactureYear),
      });
      const user = auth.currentUser;
      await recordActivity(user, `Updated vehicle ${formData.plateNumber}`);
      setShowEditSuccessPopup(true);
      setIsSubmitting(false);
    } catch (err) {
      setError("Failed to update form. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "vehicle-management", id);
      await deleteDoc(docRef);
      setShowDeleteSuccessPopup(true);
    } catch (err) {
      setError("Failed to delete record. Please try again.");
    }
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessPopup(false);
    navigate("/vehicle-management");
  };

  const handleEditSuccessClose = () => {
    setShowEditSuccessPopup(false);
    navigate(`/vehicle-management/detail/${id}`);
  };

  const handleBack = () => {
    navigate(`/vehicle-management/detail/${id}`);
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
          <h1>Edit Vehicle</h1>
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
            <h2>Edit Vehicle Form</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="detail-section">
              <h3>Vehicle Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Plate Number</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Manufacture Year</label>
                  <input
                    type="number"
                    name="manufactureYear"
                    value={formData.manufactureYear}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Maintenance Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Last Maintenance</label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Next Scheduled</label>
                  <input
                    type="date"
                    name="nextScheduled"
                    value={formData.nextScheduled}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Routes Assignment</h3>
              <div className="form-row">
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
                <div className="form-group full-width">
                  <label>Routes</label>
                  <input
                    type="text"
                    name="routes"
                    value={formData.routes.join(", ")}
                    onChange={handleRouteChange}
                    placeholder="Mattel Perai, Perai, Seberang Jaya, ..."
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Upload Route</label>
                  <input
                    type="text"
                    name="uploadRoute"
                    value={formData.uploadRoute}
                    onChange={handleChange}
                    placeholder="Add Route..."
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
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
        <VehicleEditSuccessPopup
          isOpen={showEditSuccessPopup}
          onClose={handleEditSuccessClose}
          vehicleName={formData.plateNumber}
        />
        <VehicleDeleteSuccessPopup
          isOpen={showDeleteSuccessPopup}
          onClose={handleDeleteSuccessClose}
          vehicleName={formData.plateNumber}
        />
        <DeleteConfirmation
          isOpen={showDeleteConfirmation}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
          id={id}
          formData={formData}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
        />
      </div>
    </div>
  );
};

export default VehicleEdit;
