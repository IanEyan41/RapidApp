import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import "./Dashboard.css";

const AllActivitiesPopup = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const activitiesRef = collection(db, "recent-activities");
    const activitiesQuery = query(activitiesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        time: formatDistanceToNow(doc.data().timestamp.toDate(), {
          addSuffix: true,
        }),
      }));
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
            <div key={activity.id} className="activity-item">
              <small>{activity.time}</small>
              <h4>{activity.user}</h4>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllActivitiesPopup;
