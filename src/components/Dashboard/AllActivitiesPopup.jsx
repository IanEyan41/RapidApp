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

const AllActivitiesPopup = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [isDeleting, setIsDeleting] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Helper function to determine activity type
  const getActivityType = (description, status) => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("deleted")) return "delete";
    if (lowerDesc.includes("approved")) return "approved";
    if (lowerDesc.includes("rejected") || lowerDesc.includes("disapproved"))
      return "rejected";
    if (lowerDesc.includes("added") || lowerDesc.includes("created"))
      return "create";
    if (lowerDesc.includes("updated") || lowerDesc.includes("modified"))
      return "update";
    if (lowerDesc.includes("admin")) return "admin";
    return "create"; // default type
  };

  // Helper function to get activity type label
  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "delete":
        return "Deleted";
      case "create":
        return "Created";
      case "update":
        return "Updated";
      case "admin":
        return "Admin";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Action";
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const activitiesRef = collection(db, "recent-activities");
    const activitiesQuery = query(activitiesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: formatDistanceToNow(data.timestamp.toDate(), {
            addSuffix: true,
          }),
          type: getActivityType(data.description, data.status),
        };
      });
      setActivities(activitiesData);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleDeleteActivity = async (activityId) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [activityId]: true }));
      const activityRef = doc(db, "recent-activities", activityId);
      await deleteDoc(activityRef);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
      setIsDeleting((prev) => ({ ...prev, [activityId]: false }));
      setConfirmDelete(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content activities-popup">
        <div className="popup-header">
          <h2>All Activities</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="activities-list-full">
          {activities.map((activity) => (
            <div key={activity.id} className={`activity-item ${activity.type}`}>
              <div className="activity-content">
                <small>{activity.time}</small>
                <h4>
                  {activity.user}
                  <span className={`activity-type-badge ${activity.type}`}>
                    {getActivityTypeLabel(activity.type)}
                  </span>
                  {activity.status && (
                    <span
                      className={`activity-type-badge ${activity.status.toLowerCase()}`}
                    >
                      {activity.status}
                    </span>
                  )}
                </h4>
                <p>{activity.description}</p>
              </div>
              <button
                className="delete-activity-btn"
                onClick={() => setConfirmDelete(activity.id)}
                disabled={isDeleting[activity.id]}
              >
                {isDeleting[activity.id] ? "..." : <FaTrash />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="popup-overlay confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h3>Delete Activity</h3>
            <p>Are you sure you want to delete this activity record?</p>
            <div className="confirmation-actions">
              <button
                className="cancel-button"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteActivity(confirmDelete)}
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

export default AllActivitiesPopup;
