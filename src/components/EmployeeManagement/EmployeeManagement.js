import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeManagement.css";
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
import EmployeeForm from "./EmployeeForm";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaSearch, FaPlus, FaEllipsisH } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShifts, setSelectedShifts] = useState(["A"]);
  const [userRole, setUserRole] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
          setUserRole(userDoc.data().role);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Set up real-time listener for employee data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Create query for employee data
      const employeeRef = collection(db, "employee-management");

      // Basic query with just ordering
      const baseQuery = query(employeeRef, orderBy("createdAt", "desc"));

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

          setEmployeeData(data);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error fetching employee data:", err);
          setError(
            "Failed to fetch employee data. Please try refreshing the page."
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
  const filteredData = employeeData.filter(
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

  const handleAddFormSubmit = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "employee-management"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // Record the activity
      const user = auth.currentUser;
      const userName = user.displayName || user.email.split("@")[0];
      await recordActivity(
        userName,
        `Added new employee ${formData.employeeName} (${formData.employeeNumber})`
      );

      // Success is handled in the EmployeeForm component now
      // setIsFormOpen(false);
      // setShowSuccessPopup(true);
      return true;
    } catch (error) {
      console.error("Error adding employee:", error);
      setError("Failed to add employee. Please try again.");
      return false;
    }
  };

  const handleAddForm = () => {
    setIsFormOpen(true);
  };

  const handleDelete = async (employeeId, employeeName, employeeNumber) => {
    try {
      await deleteDoc(doc(db, "employee-management", employeeId));

      // Record the activity
      const user = auth.currentUser;
      const userName = user.displayName || user.email.split("@")[0];
      await recordActivity(
        userName,
        `Deleted employee ${employeeName} (${employeeNumber})`
      );

      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Employee Management</h1>
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
                onClick={() => setSelectedShifts(["A"])}
              >
                <FiRefreshCw />
              </button>
            </div>
            <div className="em-shift-filters">
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

          <div className="em-table-section">
            <div className="em-search-bar">
              <FaSearch className="em-search-icon" />
              <input
                type="text"
                placeholder="Search Employee Name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="em-add-form-button" onClick={handleAddForm}>
                <FaPlus /> Add Form
              </button>
            </div>

            {error && <div className="em-error-message">{error}</div>}

            {isLoading ? (
              <div className="em-loading">Loading...</div>
            ) : (
              <table className="em-employee-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Shift</th>
                    <th>Route code</th>
                    <th>Date</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.employeeNumber}</td>
                        <td>{entry.employeeName}</td>
                        <td>{entry.department}</td>
                        <td>{entry.shift}</td>
                        <td>{entry.routeCode || "89"}</td>
                        <td>{formatDate(entry.createdAt)}</td>
                        <td>
                          <button
                            className="em-details-button"
                            onClick={() =>
                              navigate(
                                `/employee-management/detail/${entry.id}`
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

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddFormSubmit}
      />
    </div>
  );
};

export default EmployeeManagement;
