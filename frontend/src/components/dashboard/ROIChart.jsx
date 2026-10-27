import React from "react";

function ROIChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="ah-roi-chart ah-roi-chart--empty">No ROI data available yet.</div>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="ah-roi-chart">
      {data.map((d, i) => (
        <div key={i} className="ah-roi-chart__col">
          <div
            className="ah-roi-chart__bar"
            style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
          />
          <span className="ah-roi-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default ROIChart;