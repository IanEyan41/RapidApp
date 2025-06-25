import React from "react";
import "./Dashboard.css";

const PowerBIDashboard = () => {
  return (
    <div className="powerbi-container">
      <h1>Power BI Analytics</h1>
      <div className="powerbi-frame">
        <iframe
          title="Power BI Dashboard"
          width="100%"
          height="800px"
          src="https://app.powerbi.com/reportEmbed?reportId=0d9506cf-2a3b-4a16-b793-5c4f16e71502&autoAuth=true&ctid=ae5ed6e2-682f-4436-a3d2-d07186f2c1da"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
