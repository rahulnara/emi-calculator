import React from "react";

export function DonutChart({ principal, interest, fees }) {
  const total = Math.max(principal + interest + fees, 1);
  const principalAngle = (principal / total) * 360;
  const interestAngle = ((principal + interest) / total) * 360;
  const background = `conic-gradient(var(--success) 0deg ${principalAngle}deg, var(--danger) ${principalAngle}deg ${interestAngle}deg, var(--warning) ${interestAngle}deg 360deg)`;

  return (
    <div className="donut-wrap" aria-label="Payment split chart">
      <div className="donut" style={{ background }}>
        <div>
          <strong>{Math.round((interest / total) * 100)}%</strong>
          <span>interest</span>
        </div>
      </div>
      <div className="legend">
        <span><i className="success" /> Principal</span>
        <span><i className="danger" /> Interest</span>
        <span><i className="warning" /> Fees</span>
      </div>
    </div>
  );
}
