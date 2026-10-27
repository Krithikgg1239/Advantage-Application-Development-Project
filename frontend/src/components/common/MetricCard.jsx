import React from "react";

function MetricCard({ label, value, icon }) {
  return (
    <div className="ah-metric-card">
      {icon && <div className="ah-metric-card__icon">{icon}</div>}
      <div className="ah-metric-card__body">
        <span className="ah-metric-card__label">{label}</span>
        <span className="ah-metric-card__value">{value}</span>
      </div>
    </div>
  );
}

export default MetricCard;