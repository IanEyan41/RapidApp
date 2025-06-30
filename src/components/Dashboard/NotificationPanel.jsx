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

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

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
          time: formatDistanceToNow(data.timestamp.toDate(), {
            addSuffix: true,
          }),
          type: getActivityType(data.description),
        };
      });
      setActivities(activitiesData);
    });

    return () => unsubscribe();
  }, []);

  // Mock notifications (limited to 3)
  useEffect(() => {
    setNotifications(
      [
        {
          id: 1,
          time: "10:40 AM Fri 10 April 2025",
          title: "You received a new OT Request",
          message: "Kindly approve or disapprove this new request.",
        },
        {
          id: 2,
          time: "10:40 AM Fri 10 April 2025",
          title: "You received a new OT Request",
          message: "Kindly approve or disapprove this new request.",
        },
        {
          id: 3,
          time: "10:40 AM Fri 10 April 2025",
          title: "You received a new OT Request",
          message: "Kindly approve or disapprove this new request.",
        },
      ].slice(0, 3)
    );
  }, []);

  return (
    <div className="notification-panel">
      <div className="notification-section">
        <h2>Notification</h2>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <small>{notification.time}</small>
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
        <button className="see-all-btn">See All Notifications</button>
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
    </div>
  );
};

export default NotificationPanel;
