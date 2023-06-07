import React from "react";

import "../styles/404ErrorPageStyle.css";
import "../styles/mapStyle.css"

function FailPage() {
  return (
    <div className="flex flex-col items-center mt-0 mb-0">
      <div style={{ display: "flex", alignItems: "center" }} className="flex flex-col sm:flex-row space-y-0 sm:space-y-0 sm:space-x-6 sm:pt-8 sm:pb-8">
        <p
          style={{
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: "10em",
          }}>
          4
        </p>
        <div className="compass-container">
          <div className="compass">
            <div className="arrow"></div>
          </div>
        </div>
        <p
          style={{
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: "10em",
          }}>
          4
        </p>
      </div>
      <p style={{ fontSize: "30px" }}>Oops! Page is Not Available.</p>
    </div>
  );
}

export default FailPage;
