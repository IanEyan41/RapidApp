import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import OvertimeManagement from "./components/OvertimeManagement/OvertimeManagement";
import OvertimeDetail from "./components/OvertimeManagement/OvertimeDetail";
import OvertimeEdit from "./components/OvertimeManagement/OvertimeEdit";
import EmployeeManagement from "./components/EmployeeManagement/EmployeeManagement";
import EmployeeDetail from "./components/EmployeeManagement/EmployeeDetail";
import EmployeeEdit from "./components/EmployeeManagement/EmployeeEdit";
import DriverManagement from "./components/DriverManagement/DriverManagement";
import DriverDetail from "./components/DriverManagement/DriverDetail";
import DriverEdit from "./components/DriverManagement/DriverEdit";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole } from "./services/firebase";
import { ThemeProvider } from "./services/ThemeContext";
import { PopupProvider } from "./services/PopupContext";
import PowerBIDashboard from "./components/Dashboard/PowerBIDashboard";
import Profile from "./components/Profile/Profile";
import SuccessPopup from "./components/SuccessPopup";
import VendorManagement from "./components/VendorManagement/VendorManagement";
import Sidebar from "./components/Dashboard/Sidebar";

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <PopupProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <div className="App">
                    <Sidebar userRole={userRole} />
                    <div className="main-content">
                      <h1>Welcome Home!</h1>
                      {/* You can add more home page content here */}
                    </div>
                  </div>
                ) : (
                  <div className="App">
                    <div className="login-container">
                      <LoginForm />
                      <div className="login-image">
                        <img
                          src="/images/Environment.jpg"
                          alt="Office Environment"
                        />
                      </div>
                    </div>
                  </div>
                )
              }
            />
            <Route
              path="/admin/register"
              element={
                user && userRole === "superadmin" ? (
                  <div className="App">
                    <div className="login-container">
                      <SignUpForm />
                      <div className="login-image">
                        <img
                          src="/images/Environment.jpg"
                          alt="Office Environment"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={
                <div className="App">
                  <div className="login-container">
                    <ForgotPassword />
                    <div className="login-image">
                      <img
                        src="/images/Environment.jpg"
                        alt="Office Environment"
                      />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" replace />}
            />
            <Route
              path="/powerbi-dashboard"
              element={
                user ? <PowerBIDashboard /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/" replace />}
            />
            <Route
              path="/overtime-management"
              element={
                user ? <OvertimeManagement /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/overtime-management/detail/:id"
              element={user ? <OvertimeDetail /> : <Navigate to="/" replace />}
            />
            <Route
              path="/overtime-management/edit/:id"
              element={user ? <OvertimeEdit /> : <Navigate to="/" replace />}
            />
            <Route
              path="/employee-management"
              element={
                user ? <EmployeeManagement /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/employee-management/detail/:id"
              element={user ? <EmployeeDetail /> : <Navigate to="/" replace />}
            />
            <Route
              path="/employee-management/edit/:id"
              element={user ? <EmployeeEdit /> : <Navigate to="/" replace />}
            />
            <Route
              path="/driver-management"
              element={
                user ? <DriverManagement /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/driver-management/detail/:id"
              element={user ? <DriverDetail /> : <Navigate to="/" replace />}
            />
            <Route
              path="/driver-management/edit/:id"
              element={user ? <DriverEdit /> : <Navigate to="/" replace />}
            />
            <Route
              path="/vendor-management"
              element={
                user ? <VendorManagement /> : <Navigate to="/" replace />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <SuccessPopup />
        </Router>
      </PopupProvider>
    </ThemeProvider>
  );
}

export default App;
