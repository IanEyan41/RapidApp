import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "../../services/ThemeContext";
import {
  FaUsers,
  FaUserPlus,
  FaClock,
  FaExchangeAlt,
  FaBuilding,
  FaCar,
  FaBus,
  FaFileAlt,
  FaPlus,
  FaChartBar,
} from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    employees: { value: 1234, change: "95% from total" },
    newHires: { value: 30, change: "10% more from last month" },
    overtime: { value: 50, change: "23% more from yesterday" },
    currentShift: { value: "A", change: "Next is B" },
  });

  useEffect(() => {
    const fetchUserData = async () => {
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
        console.log("User department detected:", userData.department);

        // Use name from profile if available, otherwise fallback to email username
        if (userData.name && userData.name.trim() !== "") {
          setUserName(userData.name);
        } else {
          setUserName(user.email.split("@")[0]);
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Get available actions based on user role
  const getQuickActions = () => {
    const isSuperAdmin = userRole && userRole.toLowerCase() === "superadmin";
    const department = userRole ? userRole.toLowerCase() : "";

    if (isSuperAdmin) {
      return [
        {
          icon: <FaUserPlus />,
          label: "Add Admin",
          path: "/admin/register",
          color: "#d70000", // Red color
        },
      ];
    }

    const actions = [];

    switch (department) {
      case "human resources":
        actions.push(
          {
            icon: <FaUsers />,
            label: "Add Employee Form",
            path: "/employee-management",
            color: "#d70000",
            onClick: () => {
              navigate("/employee-management");
              // Small delay to ensure component is mounted
              setTimeout(() => {
                const addButton = document.querySelector(".em-add-form-button");
                if (addButton) addButton.click();
              }, 100);
            },
          },
          {
            icon: <FaClock />,
            label: "Add Overtime Form",
            path: "/overtime-management",
            color: "#d70000",
            onClick: () => {
              navigate("/overtime-management");
              // Small delay to ensure component is mounted
              setTimeout(() => {
                const addButton = document.querySelector(".ot-add-form-button");
                if (addButton) addButton.click();
              }, 100);
            },
          }
        );
        break;
      case "production":
        actions.push({
          icon: <FaClock />,
          label: "Add Overtime Form",
          path: "/overtime-management",
          color: "#d70000",
          onClick: () => {
            navigate("/overtime-management");
            // Small delay to ensure component is mounted
            setTimeout(() => {
              const addButton = document.querySelector(".ot-add-form-button");
              if (addButton) addButton.click();
            }, 100);
          },
        });
        break;
      case "transport":
        actions.push(
          {
            icon: <FaCar />,
            label: "Add Driver Form",
            path: "/driver-management",
            color: "#d70000",
            onClick: () => {
              navigate("/driver-management");
              // Small delay to ensure component is mounted
              setTimeout(() => {
                const addButton = document.querySelector(".dm-add-form-button");
                if (addButton) addButton.click();
              }, 100);
            },
          },
          {
            icon: <FaBuilding />,
            label: "Add Vendor Form",
            path: "/vendor-form",
            color: "#d70000",
          },
          {
            icon: <FaBus />,
            label: "Add Vehicle Form",
            path: "/bus-form",
            color: "#d70000",
          },
          {
            icon: <FaClock />,
            label: "Add Overtime Form",
            path: "/overtime-management",
            color: "#d70000",
            onClick: () => {
              navigate("/overtime-management");
              // Small delay to ensure component is mounted
              setTimeout(() => {
                const addButton = document.querySelector(".ot-add-form-button");
                if (addButton) addButton.click();
              }, 100);
            },
          }
        );
        break;
      default:
        // Check if the department includes "production" (case insensitive)
        if (department.includes("production")) {
          actions.push({
            icon: <FaClock />,
            label: "Add Overtime Form",
            path: "/overtime-management",
            color: "#d70000",
            onClick: () => {
              navigate("/overtime-management");
              // Small delay to ensure component is mounted
              setTimeout(() => {
                const addButton = document.querySelector(".ot-add-form-button");
                if (addButton) addButton.click();
              }, 100);
            },
          });
        } else {
          actions.push(
            {
              icon: <FaFileAlt />,
              label: "Create New Use Case",
              path: "/use-case/new",
              color: "#d70000",
            },
            {
              icon: <FaFileAlt />,
              label: "Create Web Form",
              path: "/web-form/new",
              color: "#d70000",
            }
          );
        }
        break;
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className={`dashboard-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />

      <div className="main-content">
        <header className="dashboard-header">
          <h1>Home</h1>
          <div className="header-controls">
            <div className="search-bar">
              <input type="text" placeholder="Search Anything..." />
            </div>
            <div className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon" />
              ) : (
                <BsMoon className="theme-icon" />
              )}
            </div>
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="user-avatar">
                <FaUserCircle className="user-icon" />
              </div>
              <span className="user-name">{userName}</span>
            </div>
          </div>
        </header>

        <div className="stats-container">
          <StatCard
            icon={<FaUsers />}
            title="Active Employees"
            value={stats.employees.value}
            change={stats.employees.change}
            color="blue"
          />
          <StatCard
            icon={<FaUserPlus />}
            title="New Hires"
            value={stats.newHires.value}
            change={stats.newHires.change}
            color="green"
          />
          <StatCard
            icon={<FaClock />}
            title="Overtime Applied"
            value={stats.overtime.value}
            change={stats.overtime.change}
            color="red"
          />
          <StatCard
            icon={<FaExchangeAlt />}
            title="Current Shift"
            value={stats.currentShift.value}
            change={stats.currentShift.change}
            color="purple"
          />
        </div>

        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="quick-action-card"
                onClick={action.onClick || (() => navigate(action.path))}
                style={{ backgroundColor: action.color }}
              >
                <div className="quick-action-icon">{action.icon}</div>
                <span className="quick-action-label">{action.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NotificationPanel />
    </div>
  );
};

export default Dashboard;
