import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "../../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  where,
  orderBy,
  Timestamp,
  limit,
} from "firebase/firestore";
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
    employees: { value: 0, change: "No data available" },
    newHires: { value: 0, change: "No data available" },
    overtime: { value: 0, change: "No data available" },
    currentShift: { value: "A", change: "Calculating..." },
  });
  const [isLoading, setIsLoading] = useState(true);

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

  // Calculate current shift rotation (A, B, C every 5 days)
  useEffect(() => {
    const calculateShift = () => {
      const startDate = new Date("2023-01-01"); // Base date for shift rotation
      const currentDate = new Date();

      // Calculate days since start date
      const timeDiff = currentDate.getTime() - startDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      // Calculate current shift cycle (0, 1, 2 => A, B, C)
      const shiftCycle = Math.floor(daysDiff / 5) % 3;

      // Convert to shift letter
      const shifts = ["A", "B", "C"];
      const currentShift = shifts[shiftCycle];

      // Calculate next shift
      const nextShift = shifts[(shiftCycle + 1) % 3];

      // Calculate days until next shift
      const daysRemaining = 5 - (daysDiff % 5);

      setStats((prevStats) => ({
        ...prevStats,
        currentShift: {
          value: currentShift,
          change: `Next is ${nextShift} in ${daysRemaining} day${
            daysRemaining !== 1 ? "s" : ""
          }`,
        },
      }));
    };

    calculateShift();
  }, []);

  // Fetch dashboard stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching dashboard stats...");
        setIsLoading(true);

        // Store the current shift info before updating
        const currentShiftInfo = { ...stats.currentShift };

        // 1. Fetch active employees (total count)
        const employeeRef = collection(db, "employee-management");
        console.log("Fetching employee count...");

        // Use simple query with limit to test connection
        const employeeTestQuery = query(employeeRef, limit(1));
        const testSnapshot = await getDocs(employeeTestQuery);
        console.log(`Connection test: Got ${testSnapshot.size} employee(s)`);

        // Now get full count
        const employeeSnapshot = await getDocs(employeeRef);
        const totalEmployees = employeeSnapshot.size;
        console.log(`Total employees: ${totalEmployees}`);

        // Default value for new hires if query fails
        let newHiresCount = 0;
        let newHiresPercentage = 0;

        try {
          // 2. Fetch new hires (employees created in the last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          // First try getting all employees and filtering in JS
          console.log("Fetching recent employees...");
          const allEmployees = employeeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter by createdAt date
          const recentEmployees = allEmployees.filter((emp) => {
            if (!emp.createdAt) return false;

            const empDate = emp.createdAt.toDate
              ? emp.createdAt.toDate()
              : new Date(emp.createdAt);

            return empDate >= thirtyDaysAgo;
          });

          newHiresCount = recentEmployees.length;
          newHiresPercentage =
            totalEmployees > 0
              ? Math.round((newHiresCount / totalEmployees) * 100)
              : 0;

          console.log(`New hires in last 30 days: ${newHiresCount}`);
        } catch (err) {
          console.error("Error fetching new hires:", err);
        }

        // Default value for overtime if query fails
        let todayOvertimeCount = 0;
        let overtimeChangeText = "No data available";

        try {
          // 3. Fetch overtime applied today
          const overtimeRef = collection(db, "overtime-management");
          console.log("Fetching overtime applications...");

          // First test if collection exists
          const overtimeTestQuery = query(overtimeRef, limit(1));
          const overtimeTestSnapshot = await getDocs(overtimeTestQuery);
          console.log(
            `Connection test: Got ${overtimeTestSnapshot.size} overtime record(s)`
          );

          // Get all overtime records and filter by date in JS
          const allOvertimeSnapshot = await getDocs(overtimeRef);
          const allOvertime = allOvertimeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          // Filter for today's records
          const todayOvertime = allOvertime.filter((ot) => {
            if (!ot.createdAt) return false;

            const otDate = ot.createdAt.toDate
              ? ot.createdAt.toDate()
              : new Date(ot.createdAt);

            return otDate >= today;
          });

          // Filter for yesterday's records
          const yesterdayOvertime = allOvertime.filter((ot) => {
            if (!ot.createdAt) return false;

            const otDate = ot.createdAt.toDate
              ? ot.createdAt.toDate()
              : new Date(ot.createdAt);

            return otDate >= yesterday && otDate < today;
          });

          todayOvertimeCount = todayOvertime.length;
          const yesterdayOvertimeCount = yesterdayOvertime.length;

          // Calculate change percentage compared to yesterday
          overtimeChangeText = "First applications today";
          if (yesterdayOvertimeCount > 0) {
            const overtimeChange = todayOvertimeCount - yesterdayOvertimeCount;
            const changeDirection = overtimeChange >= 0 ? "more" : "fewer";
            const absoluteChange = Math.abs(overtimeChange);
            overtimeChangeText = `${absoluteChange} ${changeDirection} than yesterday`;
          }

          console.log(
            `Today's overtime: ${todayOvertimeCount}, Yesterday's: ${yesterdayOvertimeCount}`
          );
        } catch (err) {
          console.error("Error fetching overtime data:", err);
        }

        // Update all stats
        setStats({
          employees: {
            value: totalEmployees,
            change:
              totalEmployees === 1 ? "Active employee" : "Active employees",
          },
          newHires: {
            value: newHiresCount,
            change: `${newHiresPercentage}% of total workforce`,
          },
          overtime: {
            value: todayOvertimeCount,
            change: overtimeChangeText,
          },
          currentShift: currentShiftInfo, // Preserve the shift value calculated earlier
        });

        console.log("Stats updated successfully");
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Keep the current shift info but show error for other stats
        setStats((prevStats) => ({
          employees: { value: 0, change: "Error loading data" },
          newHires: { value: 0, change: "Error loading data" },
          overtime: { value: 0, change: "Error loading data" },
          currentShift: prevStats.currentShift,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get available actions based on user role
  const getQuickActions = () => {
    const isSuperAdmin = userRole && userRole.toLowerCase() === "superadmin";
    const departmentValue = (department || userRole || "").toLowerCase();

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

    switch (departmentValue) {
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
        if (departmentValue.includes("production")) {
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
            value={isLoading ? "..." : stats.employees.value}
            change={isLoading ? "Loading data..." : stats.employees.change}
            color="blue"
          />
          <StatCard
            icon={<FaUserPlus />}
            title="New Hires"
            value={isLoading ? "..." : stats.newHires.value}
            change={isLoading ? "Loading data..." : stats.newHires.change}
            color="green"
          />
          <StatCard
            icon={<FaClock />}
            title="Overtime Applied"
            value={isLoading ? "..." : stats.overtime.value}
            change={isLoading ? "Loading data..." : stats.overtime.change}
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
