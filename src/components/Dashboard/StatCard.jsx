import React from "react";

const StatCard = ({ icon, title, value, change, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
        <small className="stat-change">{change}</small>
      </div>
    </div>
  );
};

export default StatCard;
