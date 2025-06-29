import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../services/firebase";
import logo from "../../Asset/Amtel_logo.png";
import LogoutConfirmation from "../LogoutConfirmation";
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
  FaUserPlus,
} from "react-icons/fa";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = async () => {
    await logoutUser();
    setShowLogoutConfirmation(false);
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
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
  const isHomePage = location.pathname === "/dashboard";
  const isDashboardPage = location.pathname === "/powerbi-dashboard";
  const isRegisterPage = location.pathname === "/admin/register";
  const isProfilePage = location.pathname === "/profile";
  const isSuperAdmin = userRole === "superadmin";

  return (
    <>
      <div className="sidebar">
        <div className="logo-section">
          <img src={logo} alt="logo" />
        </div>

        <div className="menu-sections">
          <div className="menu-section">
            <h3>General</h3>
            <ul>
              <li
                className={isHomePage ? "active" : ""}
                onClick={() => navigate("/dashboard")}
              >
                <span className="icon">
                  <FaHome />
                </span>
                <span>Home</span>
              </li>
              <li
                className={isDashboardPage ? "active" : ""}
                onClick={() => navigate("/powerbi-dashboard")}
              >
                <span className="icon">
                  <FaChartBar />
                </span>
                <span>Dashboard</span>
              </li>
              {isSuperAdmin && (
                <li
                  className={isRegisterPage ? "active" : ""}
                  onClick={() => navigate("/admin/register")}
                >
                  <span className="icon">
                    <FaUserPlus />
                  </span>
                  <span>Register Admin</span>
                </li>
              )}
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
              <li
                className={isProfilePage ? "active" : ""}
                onClick={() => navigate("/profile")}
              >
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
              <li onClick={handleLogoutClick}>
                <span className="icon">
                  <FaSignOutAlt />
                </span>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Sidebar;
