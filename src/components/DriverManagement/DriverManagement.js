import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DriverManagement.css";
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
import DriverForm from "./DriverForm";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaSearch, FaPlus, FaEllipsisH, FaChevronDown } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const DriverManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [driverData, setDriverData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedExpiryFilters, setSelectedExpiryFilters] = useState({
    expiringSoon: true,
    alreadyExpired: true,
  });

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
          setDepartment(userData.department || userData.role); // Use department if available, fallback to role
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);

          // Only set up driver data listener after confirming auth
          const driverRef = collection(db, "driver-management");
          const baseQuery = query(driverRef, orderBy("createdAt", "desc"));

          const dataUnsubscribe = onSnapshot(
            baseQuery,
            (snapshot) => {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setDriverData(data);
              setIsLoading(false);
              setError(null);
            },
            (err) => {
              console.error("Error fetching driver data:", err);
              setError(
                "Failed to fetch driver data. Please try refreshing the page."
              );
              setIsLoading(false);
            }
          );

          return () => dataUnsubscribe();
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleExpiryFilterToggle = (filterType) => {
    setSelectedExpiryFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const resetFilters = () => {
    setSelectedExpiryFilters({
      expiringSoon: true,
      alreadyExpired: true,
    });
  };

  // Filter data based on search query and expiry filters
  const filteredData = driverData.filter((entry) => {
    // Search filter
    const matchesSearch =
      entry.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.driverLicense?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Expiry date filtering
    const today = new Date();
    const expiryDate = new Date(entry.validUntil);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const isExpiringSoon =
      expiryDate <= thirtyDaysFromNow && expiryDate > today;
    const isExpired = expiryDate < today;

    // Apply expiry filters
    if (
      selectedExpiryFilters.expiringSoon &&
      selectedExpiryFilters.alreadyExpired
    ) {
      return true;
    } else if (selectedExpiryFilters.expiringSoon && isExpiringSoon) {
      return true;
    } else if (selectedExpiryFilters.alreadyExpired && isExpired) {
      return true;
    }
    return false;
  });

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleAddFormSubmit = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "driver-management"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // Record the activity
      const user = auth.currentUser;
      await recordActivity(
        user,
        `Added new driver ${formData.driverName} (License: ${formData.driverLicense})`
      );

      return true;
    } catch (error) {
      console.error("Error adding driver:", error);
      setError("Failed to add driver. Please try again.");
      return false;
    }
  };

  const handleAddForm = () => {
    setIsFormOpen(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className={`dm-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="dm-main-content">
        <header className="dm-header">
          <h1>Driver Management</h1>
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
          ← Back
        </button>

        <div className="dm-content-area">
          <div className="dm-filter-section">
            <div className="dm-filter-header">
              <h3>Filter By</h3>
              <button className="dm-refresh-button" onClick={resetFilters}>
                <FiRefreshCw />
              </button>
            </div>
            <div className="dm-expiry-filters">
              <h4>PSV Expiry Date</h4>
              <label>
                <input
                  type="checkbox"
                  checked={selectedExpiryFilters.expiringSoon}
                  onChange={() => handleExpiryFilterToggle("expiringSoon")}
                />
                Expiring soon
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedExpiryFilters.alreadyExpired}
                  onChange={() => handleExpiryFilterToggle("alreadyExpired")}
                />
                Already Expired
              </label>
            </div>
          </div>

          <div className="dm-table-section">
            <div className="dm-search-bar">
              <FaSearch className="dm-search-icon" />
              <input
                type="text"
                placeholder="Search Driver Name or License"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="dm-add-form-button" onClick={handleAddForm}>
                <FaPlus /> Add Driver
              </button>
            </div>

            {error && <div className="dm-error-message">{error}</div>}

            {isLoading ? (
              <div className="dm-loading">Loading...</div>
            ) : (
              <table className="dm-driver-table">
                <thead>
                  <tr>
                    <th>Driver License</th>
                    <th>Driver Expiry date</th>
                    <th>Driver Name</th>
                    <th>Routes</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No drivers found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.driverLicense}</td>
                        <td>{entry.validUntil}</td>
                        <td>{entry.driverName}</td>
                        <td>{entry.routeCode || "1"}</td>
                        <td>
                          <button
                            className="dm-details-button"
                            onClick={() =>
                              navigate(`/driver-management/detail/${entry.id}`)
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
            )}
          </div>
        </div>
      </div>

      <DriverForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddFormSubmit}
      />
    </div>
  );
};

export default DriverManagement;
