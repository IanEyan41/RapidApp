import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OvertimeManagement.css";
import globe from "../../Asset/globe.png";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import OvertimeForm from "./OvertimeForm";

const OvertimeManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShifts, setSelectedShifts] = useState(["A"]);
  const [userName, setUserName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      setUserName(user.email.split("@")[0]); // Using email as name for now
    };

    fetchUserData();
  }, [navigate]);

  const employeeData = [
    {
      id: "0001",
      name: "Meng Kang",
      date: "25/4/2025 - 25/4/2025",
      time: "07:00 - 1400",
    },
    {
      id: "0002",
      name: "Vishnu",
      date: "25/4/2025 - 25/4/2025",
      time: "0700/1400",
    },
    {
      id: "0005",
      name: "Lolly",
      date: "25/4/2025 - 25/4/2025",
      time: "0700/1400",
    },
    {
      id: "0009",
      name: "Jia Hui",
      date: "25/4/2025 - 25/4/2025",
      time: "0700/1400",
    },
    {
      id: "00010",
      name: "Meng Kang",
      date: "25/4/2025 - 25/4/2025",
      time: "0700/1400",
    },
  ];

  const handleShiftToggle = (shift) => {
    if (selectedShifts.includes(shift)) {
      setSelectedShifts(selectedShifts.filter((s) => s !== shift));
    } else {
      setSelectedShifts([...selectedShifts, shift]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddFormSubmit = (formData) => {
    // Here you would typically save the form data to your backend
    console.log("Form submitted:", formData);
    setIsFormOpen(false);
  };

  const handleAddForm = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="overtime-management">
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h1 style={{ color: "white" }}>Overtime Management</h1>
          <div className="header-right">
            <button className="theme-toggle">
              <img src={globe} alt="globe" />
            </button>
            <div className="user-profile">
              <span>{userName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="content">
        <div className="filter-section">
          <h2>Filter By</h2>
          <div className="shift-filters">
            <h3>Shift</h3>
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

        <div className="main-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Employee Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="add-form-button" onClick={handleAddForm}>
              + Add Form
            </button>
          </div>

          <table className="overtime-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Date (In/Out)</th>
                <th>Time (In/Out)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.date}</td>
                  <td>{employee.time}</td>
                  <td>
                    <button className="details-button">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OvertimeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddFormSubmit}
      />
    </div>
  );
};

export default OvertimeManagement;
