import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import AllActivitiesPopup from "./AllActivitiesPopup";
import NotificationPopup from "./NotificationPopup";

const NotificationPanel = ({ userDepartment }) => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

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

  // Helper function to determine if detailed message should be shown
  const shouldShowDetailedMessage = (department) => {
    return department === "Transport" || department === "Human Resource";
  };

  // Fetch recent activities (limited to 3)
  useEffect(() => {
    const activitiesRef = collection(db, "recent-activities");
    const activitiesQuery = query(
      activitiesRef,
      orderBy("timestamp", "desc"),
      limit(3)
    );

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: formatTimestamp(data.timestamp),
          type: getActivityType(data.description, data.status),
        };
      });
      setActivities(activitiesData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch notifications from Firestore (limited to 3)
  useEffect(() => {
    const notificationsRef = collection(db, "notification");
    const notificationsQuery = query(
      notificationsRef,
      orderBy("timestamp", "desc"),
      limit(3)
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
  }, []);

  return (
    <div className="notification-panel">
      <div className="notification-section">
        <h2>Notification</h2>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <small>{notification.formattedTimestamp}</small>
              {shouldShowDetailedMessage(userDepartment) ? (
                <>
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                </>
              ) : (
                <p>{notification.user} has applied a new OT Request</p>
              )}
            </div>
          ))}
        </div>
        <button
          className="see-all-btn"
          onClick={() => setShowAllNotifications(true)}
        >
          See All Notifications
        </button>
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {activities.map((activity) => (
            <div key={activity.id} className={`activity-item ${activity.type}`}>
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
          ))}
        </div>
        <button
          className="see-all-btn"
          onClick={() => setShowAllActivities(true)}
        >
          See All Activities
        </button>
      </div>

      <AllActivitiesPopup
        isOpen={showAllActivities}
        onClose={() => setShowAllActivities(false)}
      />

      <NotificationPopup
        isOpen={showAllNotifications}
        onClose={() => setShowAllNotifications(false)}
        userDepartment={userDepartment}
      />
    </div>
  );
};

export default NotificationPanel;
