import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OvertimeManagement.css";
import { auth, db } from "../../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import OvertimeForm from "./OvertimeForm";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaSearch, FaPlus, FaEllipsisH, FaCheckCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

// Success Popup Component
const SuccessPopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="success-popup">
        <div className="success-icon-circle">
          <div className="checkmark">✓</div>
        </div>
        <h3>Success</h3>
        <p>{message}</p>
        <button className="success-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const OvertimeManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShifts, setSelectedShifts] = useState(["A"]);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [overtimeData, setOvertimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  // Set up real-time listener for overtime data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Create query for overtime data
      const overtimeRef = collection(db, "overtime-management");

      // Basic query with just ordering
      const baseQuery = query(overtimeRef, orderBy("createdAt", "desc"));

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        baseQuery,
        (snapshot) => {
          const data = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            // Filter by shift in JavaScript instead of in query
            .filter((doc) => selectedShifts.includes(doc.shift));

          setOvertimeData(data);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error fetching overtime data:", err);
          setError(
            "Failed to fetch overtime data. Please try refreshing the page."
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
  }, [selectedShifts]);

  // Filter data based on search query
  const filteredData = overtimeData.filter(
    (entry) =>
      entry.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.employeeNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShiftToggle = (shift) => {
    if (selectedShifts.includes(shift)) {
      // Don't allow deselecting if it's the last selected shift
      if (selectedShifts.length > 1) {
        setSelectedShifts(selectedShifts.filter((s) => s !== shift));
      }
    } else {
      setSelectedShifts([...selectedShifts, shift]);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleDelete = async (overtimeId, employeeName, employeeNumber) => {
    try {
      await deleteDoc(doc(db, "overtime-management", overtimeId));
      setSuccessMessage(
        `Overtime request for ${employeeName} has been deleted.`
      );
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error deleting overtime request:", error);
      setError("Failed to delete overtime request. Please try again.");
    }
  };

  const handleAddForm = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setSuccessMessage("Overtime request has been successfully created.");
    setShowSuccessPopup(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className={`ot-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="ot-main-content">
        <header className="ot-header">
          <h1>Overtime Management</h1>
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
          ← Back
        </button>

        <div className="ot-content-area">
          <div className="ot-filter-section">
            <div className="ot-filter-header">
              <h3>Filter By</h3>
              <button
                className="ot-refresh-button"
                onClick={() => setSelectedShifts(["A"])}
              >
                <FiRefreshCw />
              </button>
            </div>
            <div className="ot-shift-filters">
              <h4>Shift</h4>
              <label>
                <input
                  type="checkbox"
                  checked={selectedShifts.includes("A")}
                  onChange={() => handleShiftToggle("A")}
                />
                A
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedShifts.includes("B")}
                  onChange={() => handleShiftToggle("B")}
                />
                B
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedShifts.includes("C")}
                  onChange={() => handleShiftToggle("C")}
                />
                C
              </label>
            </div>
          </div>

          <div className="ot-table-section">
            <div className="ot-search-bar">
              <FaSearch className="ot-search-icon" />
              <input
                type="text"
                placeholder="Search Employee Name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="ot-add-form-button" onClick={handleAddForm}>
                <FaPlus /> Add Form
              </button>
            </div>

            {error && <div className="ot-error-message">{error}</div>}

            {isLoading ? (
              <div className="ot-loading">Loading...</div>
            ) : (
              <table className="ot-overtime-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Date (In/Out)</th>
                    <th>Shift</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No overtime requests found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.employeeNumber}</td>
                        <td>{entry.employeeName}</td>
                        <td>{`${formatDate(entry.dateIn)} - ${formatDate(
                          entry.dateOut
                        )}`}</td>
                        <td>{entry.shift}</td>
                        <td>{entry.department}</td>
                        <td>
                          <span className={`status-badge ${entry.status}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="ot-details-button"
                            onClick={() =>
                              navigate(
                                `/overtime-management/detail/${entry.id}`
                              )
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

      <OvertimeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message={successMessage}
      />
    </div>
  );
};

export default OvertimeManagement;
