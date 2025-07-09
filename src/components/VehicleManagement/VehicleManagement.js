import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VehicleManagement.css";
import { auth, db, recordActivity } from "../../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import VehicleForm from "./VehicleForm";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaSearch, FaPlus, FaEllipsisH } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const VehicleManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState(["Bus", "Van"]);
  const [selectedTypes, setSelectedTypes] = useState(["Bus", "Van"]);
  const [capacityRange, setCapacityRange] = useState([0, 100]);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Set up real-time listener for vehicle data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      const vehicleRef = collection(db, "vehicle-management");
      const baseQuery = query(vehicleRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        baseQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVehicleData(data);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error fetching vehicle data:", err);
          setError(
            "Failed to fetch vehicle data. Please try refreshing the page."
          );
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up listener:", err);
      setError(
        "Failed to set up data listener. Please try refreshing the page."
      );
      setIsLoading(false);
    }
  }, []);

  // Filter data based on search query, vehicle type, and capacity
  const filteredData = vehicleData.filter(
    (entry) =>
      selectedTypes.includes(entry.vehicleType) &&
      entry.capacity >= capacityRange[0] &&
      entry.capacity <= capacityRange[1] &&
      (entry.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleCapacityChange = (e) => {
    setCapacityRange([0, Number(e.target.value)]);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleAddFormSubmit = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "vehicle-management"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      const user = auth.currentUser;
      await recordActivity(user, `Added new vehicle ${formData.plateNumber}`);
      return true;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setError("Failed to add vehicle. Please try again.");
      return false;
    }
  };

  const handleAddForm = () => {
    setIsFormOpen(true);
  };

  const handleDelete = async (vehicleId, plateNumber) => {
    try {
      await deleteDoc(doc(db, "vehicle-management", vehicleId));
      const user = auth.currentUser;
      await recordActivity(user, `Deleted vehicle ${plateNumber}`);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Failed to delete vehicle. Please try again.");
    }
  };

  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Vehicle Management</h1>
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
          ← Back
        </button>
        <div className="em-content-area">
          <div className="em-filter-section">
            <div className="em-filter-header">
              <h3>Filter By</h3>
              <button
                className="em-refresh-button"
                onClick={() => {
                  setSelectedTypes(["Bus", "Van"]);
                  setCapacityRange([0, 100]);
                }}
              >
                <FiRefreshCw />
              </button>
            </div>
            <div className="em-shift-filters">
              <h4>Vehicle Type</h4>
              {vehicleTypes.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                  {type}
                </label>
              ))}
              <h4>Capacity</h4>
              <input
                type="range"
                min="0"
                max="100"
                value={capacityRange[1]}
                onChange={handleCapacityChange}
              />
              <div>
                Min
                <span style={{ margin: "0 8px" }}>0</span>
                Max
                <span style={{ margin: "0 8px" }}>{capacityRange[1]}</span>
              </div>
            </div>
          </div>
          <div className="em-table-section">
            <div className="em-search-bar">
              <FaSearch className="em-search-icon" />
              <input
                type="text"
                placeholder="Search Bus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="em-add-form-button" onClick={handleAddForm}>
                <FaPlus /> Add Bus
              </button>
            </div>
            <table className="em-employee-table">
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Vehicle Type</th>
                  <th>Manufacture Year</th>
                  <th>Capacity</th>
                  <th>Maintenance</th>
                  <th>Routes</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No vehicles found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.plateNumber}</td>
                      <td>{vehicle.vehicleType}</td>
                      <td>{vehicle.manufactureYear}</td>
                      <td>{vehicle.capacity}</td>
                      <td>{vehicle.maintenanceDate}</td>
                      <td>{vehicle.routeCount}</td>
                      <td>
                        <button
                          className="em-details-button"
                          onClick={() =>
                            navigate(`/vehicle-management/detail/${vehicle.id}`)
                          }
                        >
                          <FaEllipsisH />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <VehicleForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddFormSubmit}
        />
      </div>
    </div>
  );
};

export default VehicleManagement;
