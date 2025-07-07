import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

const PowerBIDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const { theme, toggleTheme } = useTheme();

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
        setDepartment(userData.department || userData.role); // Use department if available, fallback to role

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

  const powerBIStyles = {
    mainContent: {
      width: "100%",
      padding: "0",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
    },
    header: {
      padding: "15px 25px",
      marginBottom: "0",
    },
    dashboardContainer: {
      flex: 1,
      padding: "0",
      margin: "0",
      borderRadius: "0",
      overflow: "hidden",
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    frameContainer: {
      height: "100%",
      width: "100%",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div className={`dashboard-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />

      <div className="main-content" style={powerBIStyles.mainContent}>
        <header className="dashboard-header" style={powerBIStyles.header}>
          <h1>Power BI Analytics</h1>
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

        <div style={powerBIStyles.dashboardContainer}>
          <div style={powerBIStyles.frameContainer}>
            <iframe
              title="Power BI Dashboard"
              width="100%"
              height="100%"
              src="https://app.powerbi.com/reportEmbed?reportId=0d9506cf-2a3b-4a16-b793-5c4f16e71502&autoAuth=true&ctid=ae5ed6e2-682f-4436-a3d2-d07186f2c1da"
              frameBorder="0"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
