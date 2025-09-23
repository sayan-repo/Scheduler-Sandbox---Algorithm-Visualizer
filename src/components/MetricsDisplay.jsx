import React from 'react';

const MetricsDisplay = ({ metrics }) => {
  if (!metrics) {
    return <div className="metrics-placeholder">Run a simulation to see performance metrics.</div>;
  }
  return (
    <div className="metrics-container">
      <div className="metric-card">
        <h4>Avg. Waiting Time</h4>
        <p>{metrics.avgWaitingTime} ms</p>
      </div>
      <div className="metric-card">
        <h4>Avg. Turnaround Time</h4>
        <p>{metrics.avgTurnaroundTime} ms</p>
      </div>
      <div className="metric-card">
        <h4>Total Execution Time</h4>
        <p>{metrics.totalExecutionTime} ms</p>
      </div>
    </div>
  );
};

export default MetricsDisplay;