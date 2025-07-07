import React, { useState, useEffect } from "react";
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
  const [isFormsOpen, setIsFormsOpen] = useState(() => {
    // Initialize from localStorage, default to false if not set
    const saved = localStorage.getItem("isFormsOpen");
    return saved ? JSON.parse(saved) : false;
  });
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Save isFormsOpen state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isFormsOpen", JSON.stringify(isFormsOpen));
  }, [isFormsOpen]);

  // Check if current path is a form page
  const isFormPage = () => {
    const formPaths = [
      "/employee-management",
      "/overtime-management",
      "/driver-management",
      "/vendor-form",
      "/bus-form",
    ];
    // Check if current path starts with any of the form paths
    return formPaths.some((path) => location.pathname.startsWith(path));
  };

  // Auto-open forms menu when on a form page
  useEffect(() => {
    if (isFormPage()) {
      setIsFormsOpen(true);
    }
  }, [location.pathname]);

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

  // Get forms based on department
  const getFormsByDepartment = () => {
    const department = userRole ? userRole.toLowerCase() : "";

    // Special case for superadmin
    if (department === "superadmin") {
      return [
        {
          icon: <FaUserPlus />,
          label: "Register Admin",
          path: "/admin/register",
        },
      ];
    }

    switch (department) {
      case "human resources":
        return [
          {
            icon: <FaUsers />,
            label: "Employee Form",
            path: "/employee-management",
          },
          {
            icon: <FaClock />,
            label: "Overtime Form",
            path: "/overtime-management",
          },
        ];
      case "production":
        return [
          {
            icon: <FaClock />,
            label: "Overtime Form",
            path: "/overtime-management",
          },
        ];
      case "transport":
        return [
          {
            icon: <FaCar />,
            label: "Driver Form",
            path: "/driver-management",
          },
          {
            icon: <FaBuilding />,
            label: "Vendor Form",
            path: "/vendor-form",
          },
          {
            icon: <FaBus />,
            label: "Vehicle Form",
            path: "/bus-form",
          },
          {
            icon: <FaClock />,
            label: "Overtime Form",
            path: "/overtime-management",
          },
        ];
      default:
        // Check if the department contains "production" for case insensitive matching
        if (department.includes("production")) {
          return [
            {
              icon: <FaClock />,
              label: "Overtime Form",
              path: "/overtime-management",
            },
          ];
        }
        return [];
    }
  };

  const availableForms = getFormsByDepartment();
  const isHomePage = location.pathname === "/dashboard";
  const isDashboardPage = location.pathname === "/powerbi-dashboard";
  const isRegisterPage = location.pathname === "/admin/register";
  const isProfilePage = location.pathname === "/profile";
  const isSuperAdmin = userRole && userRole.toLowerCase() === "superadmin";

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
                    className={`dropdown-trigger ${isFormsOpen ? "open" : ""} ${
                      isFormPage() ? "active" : ""
                    }`}
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
                        <li
                          key={index}
                          className={
                            location.pathname.startsWith(form.path)
                              ? "active"
                              : ""
                          }
                          onClick={() => navigate(form.path)}
                        >
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
