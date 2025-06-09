import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/firebase";
import logo from "../../Asset/Amtel_logo.png";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const [isFormsOpen, setIsFormsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // Get forms based on user role
  const getFormsByRole = () => {
    switch (userRole) {
      case "Human Resources":
        return [
          { icon: "👥", label: "Employee Form", path: "/employee-form" },
          { icon: "⏰", label: "Overtime Form", path: "/overtime-management" },
        ];
      case "Production":
        return [
          { icon: "⏰", label: "Overtime Form", path: "/overtime-management" },
        ];
      case "Transport":
        return [
          { icon: "⏰", label: "Overtime Form", path: "/overtime-management" },
          { icon: "🚗", label: "Driver Form", path: "/driver-form" },
          { icon: "🚌", label: "Bus Form", path: "/bus-form" },
          { icon: "🏢", label: "Vendor Form", path: "/vendor-form" },
        ];
      default:
        return [];
    }
  };

  const availableForms = getFormsByRole();

  return (
    <div className="sidebar">
      <div className="logo-section">
        <img src={logo} alt="logo" />
      </div>

      <div className="menu-sections">
        <div className="menu-section">
          <h3>General</h3>
          <ul>
            <li className="active">
              <span className="icon">🏠</span>
              <span>Home</span>
            </li>
            <li>
              <span className="icon">📊</span>
              <span>Dashboard</span>
            </li>
            {availableForms.length > 0 && (
              <>
                <li
                  className={`dropdown-trigger ${isFormsOpen ? "open" : ""}`}
                  onClick={() => setIsFormsOpen(!isFormsOpen)}
                >
                  <span className="icon">📝</span>
                  <span>Forms</span>
                  <span className="dropdown-arrow">
                    {isFormsOpen ? "▼" : "▶"}
                  </span>
                </li>
                {isFormsOpen && (
                  <ul className="dropdown-menu">
                    {availableForms.map((form, index) => (
                      <li key={index} onClick={() => navigate(form.path)}>
                        <span className="icon">{form.icon}</span>
                        <span>{form.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="menu-section">
          <h3>Support</h3>
          <ul>
            <li>
              <span className="icon">👤</span>
              <span>Profile</span>
            </li>
            <li>
              <span className="icon">⚙️</span>
              <span>Settings</span>
            </li>
            <li onClick={handleLogout}>
              <span className="icon">🚪</span>
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>

    
    </div>
  );
};

export default Sidebar;
