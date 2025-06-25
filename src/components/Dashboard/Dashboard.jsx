import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "../../services/ThemeContext";
import { FaUsers, FaUserPlus, FaClock, FaExchangeAlt } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
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
        setUserRole(userDoc.data().role);
        setUserName(user.email.split("@")[0]); // Using email as name for now
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className={`dashboard-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />

      <div className="main-content">
        <header className="dashboard-header">
          <h1>{userRole}</h1>
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
            <div className="user-profile">
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

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Dashboard</h2>
            {/* Add dashboard content */}
          </div>
          <div className="dashboard-card">
            <h2>Departments</h2>
            {/* Add departments content */}
          </div>
        </div>
      </div>

      <NotificationPanel />
    </div>
  );
};

export default Dashboard;
