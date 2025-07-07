import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import "./Dashboard.css";
import { FaTrash } from "react-icons/fa";

const NotificationPopup = ({ isOpen, onClose, userDepartment }) => {
  const [notifications, setNotifications] = useState([]);
  const [isDeleting, setIsDeleting] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  useEffect(() => {
    if (!isOpen) return;

    const notificationsRef = collection(db, "notification");
    const notificationsQuery = query(
      notificationsRef,
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          formattedTimestamp: formatTimestamp(data.timestamp),
        };
      });
      setNotifications(notificationsData);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const shouldShowDetailedMessage = (department) => {
    return department === "Transport" || department === "Human Resource";
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [notificationId]: true }));
      const notificationRef = doc(db, "notification", notificationId);
      await deleteDoc(notificationRef);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setIsDeleting((prev) => ({ ...prev, [notificationId]: false }));
      setConfirmDelete(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content activities-popup">
        <div className="popup-header">
          <h2>All Notifications</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="activities-list-full">
          {notifications.map((notification) => (
            <div key={notification.id} className="activity-item create">
              <div className="activity-content">
                <small>{notification.formattedTimestamp}</small>
                <h4>
                  {notification.user}
                  <span className="activity-type-badge create">
                    New Request
                  </span>
                </h4>
                {shouldShowDetailedMessage(userDepartment) ? (
                  <p>{notification.message}</p>
                ) : (
                  <p>has applied a new OT Request</p>
                )}
              </div>
              <button
                className="delete-activity-btn"
                onClick={() => setConfirmDelete(notification.id)}
                disabled={isDeleting[notification.id]}
              >
                {isDeleting[notification.id] ? "..." : <FaTrash />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="popup-overlay confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h3>Delete Notification</h3>
            <p>Are you sure you want to delete this notification?</p>
            <div className="confirmation-actions">
              <button
                className="cancel-button"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteNotification(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
