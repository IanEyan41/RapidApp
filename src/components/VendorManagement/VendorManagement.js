import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorManagement.css";
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
import VendorForm from "./VendorForm";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaSearch, FaPlus, FaEllipsisH } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const VendorManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vendorData, setVendorData] = useState([]);
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

  // Set up real-time listener for vendor data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      const vendorRef = collection(db, "vendor-management");
      const baseQuery = query(vendorRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        baseQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVendorData(data);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error fetching vendor data:", err);
          setError(
            "Failed to fetch vendor data. Please try refreshing the page."
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

  // Filter data based on search query
  const filteredData = vendorData.filter(
    (entry) =>
      entry.contractorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.primaryContact?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleAddFormSubmit = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "vendor-management"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      const user = auth.currentUser;
      await recordActivity(user, `Added new vendor ${formData.contractorName}`);
      return true;
    } catch (error) {
      console.error("Error adding vendor:", error);
      setError("Failed to add vendor. Please try again.");
      return false;
    }
  };

  const handleAddForm = () => {
    setIsFormOpen(true);
  };

  const handleDelete = async (vendorId, contractorName) => {
    try {
      await deleteDoc(doc(db, "vendor-management", vendorId));
      const user = auth.currentUser;
      await recordActivity(user, `Deleted vendor ${contractorName}`);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      setError("Failed to delete vendor. Please try again.");
    }
  };

  return (
    <div className={`em-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="em-main-content">
        <header className="em-header">
          <h1>Vendor Management</h1>
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
                onClick={() => setSearchQuery("")}
              >
                <FiRefreshCw />
              </button>
            </div>
            <div className="em-shift-filters">
              <h4>PSV Expiry Date</h4>
              <label>
                <input type="checkbox" checked readOnly /> Expiring soon
              </label>
              <label>
                <input type="checkbox" checked readOnly /> Already Expired
              </label>
            </div>
          </div>
          <div className="em-table-section">
            <div className="em-search-bar">
              <FaSearch className="em-search-icon" />
              <input
                type="text"
                placeholder="Search Vendor Name or Contact"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="em-add-form-button" onClick={handleAddForm}>
                <FaPlus /> Add Vendor
              </button>
            </div>
            <table className="em-employee-table">
              <thead>
                <tr>
                  <th>Contractor Name</th>
                  <th>Total Vehicles</th>
                  <th>Contact</th>
                  <th>Contract Duration</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>{vendor.contractorName}</td>
                      <td>{vendor.totalVehicles}</td>
                      <td>{vendor.phoneNumber}</td>
                      <td>{vendor.contractDuration}</td>
                      <td>
                        <button
                          className="em-details-button"
                          onClick={() =>
                            navigate(`/vendor-management/detail/${vendor.id}`)
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
        <VendorForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddFormSubmit}
        />
      </div>
    </div>
  );
};

export default VendorManagement;
