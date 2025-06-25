import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/firebase";
import logo from "../../Asset/Amtel_logo.png";
import {
  FaHome,
  FaChartBar,
  FaFileAlt,
  FaUserAlt,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaClock,
  FaCar,
  FaBus,
  FaBuilding,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

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
          { icon: <FaUsers />, label: "Employee Form", path: "/employee-form" },
          {
            icon: <FaClock />,
            label: "Overtime Form",
            path: "/overtime-management",
          },
        ];
      case "Production":
        return [
          {
            icon: <FaClock />,
            label: "Overtime Form",
            path: "/overtime-management",
          },
        ];
      case "Transport":
        return [
          {
            icon: <FaClock />,
            label: "Overtime Form",
            path: "/overtime-management",
          },
          { icon: <FaCar />, label: "Driver Form", path: "/driver-form" },
          { icon: <FaBus />, label: "Bus Form", path: "/bus-form" },
          { icon: <FaBuilding />, label: "Vendor Form", path: "/vendor-form" },
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
              <span className="icon">
                <FaHome />
              </span>
              <span>Home</span>
            </li>
            <li>
              <span className="icon">
                <FaChartBar />
              </span>
              <span>Dashboard</span>
            </li>
            {availableForms.length > 0 && (
              <>
                <li
                  className={`dropdown-trigger ${isFormsOpen ? "open" : ""}`}
                  onClick={() => setIsFormsOpen(!isFormsOpen)}
                >
                  <span className="icon">
                    <FaFileAlt />
                  </span>
                  <span>Forms</span>
                  <span className="dropdown-arrow">
                    {isFormsOpen ? <FaChevronDown /> : <FaChevronRight />}
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
              <span className="icon">
                <FaUserAlt />
              </span>
              <span>Profile</span>
            </li>
            <li>
              <span className="icon">
                <FaCog />
              </span>
              <span>Settings</span>
            </li>
            <li onClick={handleLogout}>
              <span className="icon">
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
