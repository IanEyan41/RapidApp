import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./OvertimeDetail.css";
import { BsArrowLeft } from "react-icons/bs";
import Sidebar from "../Dashboard/Sidebar";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const OvertimeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [overtimeData, setOvertimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Fetch user data and overtime details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
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
        }

        // Fetch overtime details
        const docRef = doc(db, "overtime-management", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOvertimeData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Overtime record not found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Check if user can approve (Transport or HR)
  const canApprove =
    department?.toLowerCase() === "transport" ||
    department?.toLowerCase() === "human resources";

  // Handle approval/rejection
  const handleApprovalAction = async (action) => {
    if (!canApprove || isUpdating) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, "overtime-management", id);
      const currentDate = new Date();
      const dateIn = new Date(overtimeData.dateIn);

      let newStatus;
      let approvals = overtimeData.approvals || {};
      approvals[department.toLowerCase()] = action === "approve";

      // Check approval conditions
      const transportApproved = approvals["transport"] === true;
      const hrApproved = approvals["human resources"] === true;
      const transportRejected = approvals["transport"] === false;
      const hrRejected = approvals["human resources"] === false;

      // Determine status based on conditions
      if (transportApproved && hrApproved) {
        newStatus = "approved";
      } else if (transportRejected || hrRejected || currentDate >= dateIn) {
        newStatus = "rejected";
      } else {
        newStatus = "pending";
      }

      await updateDoc(docRef, {
        status: newStatus,
        approvals,
        lastUpdated: new Date().toISOString(),
        [`${department.toLowerCase()}Action`]: {
          action,
          timestamp: new Date().toISOString(),
          by: auth.currentUser.email,
        },
      });

      // Update local state
      setOvertimeData((prev) => ({
        ...prev,
        status: newStatus,
        approvals,
      }));
    } catch (err) {
      console.error("Error updating approval status:", err);
      setError("Failed to update approval status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    navigate("/overtime-management");
  };

  const handleEdit = () => {
    navigate(`/overtime-management/edit/${id}`);
  };

  if (loading) {
    return <div className="overtime-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="overtime-detail-error">{error}</div>;
  }

  if (!overtimeData) {
    return <div className="overtime-detail-error">No data found</div>;
  }

  return (
    <div className={`ot-management-container ${theme}-theme`}>
      <Sidebar userRole={department || userRole} />
      <div className="ot-main-content">
        <header className="ot-header">
          <h1>Overtime Details</h1>
          <div className="header-controls-ot">
            <div className="theme-toggle-ot" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon-ot" />
              ) : (
                <BsMoon className="theme-icon-ot" />
              )}
            </div>
          </div>
        </header>

        <button className="ot-back-button" onClick={handleBack}>
          <BsArrowLeft /> Back
        </button>

        <div className="overtime-detail-content">
          <div className="detail-header">
            <h2>Overtime Details</h2>
            <div className="header-actions">
              <button className="edit-button" onClick={handleEdit}>
                Edit
              </button>
            </div>
          </div>

          <section className="detail-section">
            <h3>Employee Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Employee Number / ID:</label>
                <span>{overtimeData.employeeNumber}</span>
              </div>
              <div className="detail-item">
                <label>Employee Name:</label>
                <span>{overtimeData.employeeName}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number:</label>
                <span>{overtimeData.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{overtimeData.email}</span>
              </div>
              <div className="detail-item full-width">
                <label>Address:</label>
                <span>{overtimeData.address}</span>
              </div>
              <div className="detail-item">
                <label>Postal/ZIP Code:</label>
                <span>{overtimeData.postalCode}</span>
              </div>
              <div className="detail-item">
                <label>Shift:</label>
                <span>{overtimeData.shift}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Department Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Department:</label>
                <span>{overtimeData.department}</span>
              </div>
              <div className="detail-item">
                <label>Location:</label>
                <span>{overtimeData.location}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Route</h3>
            <div className="route-display">
              <div className="route-number">14</div>
              <div className="route-path">
                <span className="route-stop">Mattel Perai</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Perai</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Seberang Jaya</span>
                <span className="route-arrow">→</span>
                <span className="route-stop">Permatang Pauh</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Date and Time</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Date in/out:</label>
                <span>
                  {overtimeData.dateIn} - {overtimeData.dateOut}
                </span>
              </div>
              <div className="detail-item">
                <label>Time in/out:</label>
                <span>7:00 - 14:00 (12hour)</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Approval Status</h3>
            <div className="approval-status-container">
              <div className="status-info">
                <div className="status-label">Current Status:</div>
                <div
                  className={`status-badge-large ${
                    overtimeData.status || "pending"
                  }`}
                >
                  {overtimeData.status
                    ? overtimeData.status.charAt(0).toUpperCase() +
                      overtimeData.status.slice(1)
                    : "Pending"}
                </div>
              </div>

              <div className="approval-details">
                <div className="approval-item">
                  <span className="approval-dept">Transport:</span>
                  <span
                    className={`approval-status ${
                      overtimeData.approvals?.transport === true
                        ? "approved"
                        : overtimeData.approvals?.transport === false
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {overtimeData.approvals?.transport === true
                      ? "Approved"
                      : overtimeData.approvals?.transport === false
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </div>
                <div className="approval-item">
                  <span className="approval-dept">Human Resources:</span>
                  <span
                    className={`approval-status ${
                      overtimeData.approvals?.["human resources"] === true
                        ? "approved"
                        : overtimeData.approvals?.["human resources"] === false
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {overtimeData.approvals?.["human resources"] === true
                      ? "Approved"
                      : overtimeData.approvals?.["human resources"] === false
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {canApprove && (
              <div className="approval-actions">
                <div className="approval-message">
                  As a {department} department member, you can approve or reject
                  this request.
                </div>
                <div className="approval-buttons">
                  <button
                    className="reject-button"
                    onClick={() => handleApprovalAction("reject")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Processing..." : "Reject Request"}
                  </button>
                  <button
                    className="approve-button"
                    onClick={() => handleApprovalAction("approve")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Processing..." : "Approve Request"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default OvertimeDetail;
