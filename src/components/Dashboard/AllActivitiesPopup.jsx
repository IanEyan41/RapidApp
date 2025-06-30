import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import "./Dashboard.css";

const AllActivitiesPopup = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);

  // Helper function to determine activity type
  const getActivityType = (description) => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("deleted")) return "delete";
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
          type: getActivityType(data.description),
        };
      });
      setActivities(activitiesData);
    });

    return () => unsubscribe();
  }, [isOpen]);

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
              <small>{activity.time}</small>
              <h4>
                {activity.user}
                <span className={`activity-type-badge ${activity.type}`}>
                  {getActivityTypeLabel(activity.type)}
                </span>
              </h4>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllActivitiesPopup;
