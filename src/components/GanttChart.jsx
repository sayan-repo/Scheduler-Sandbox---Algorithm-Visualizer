import React from 'react';

// Receive jobColorMap as a prop
const GanttChart = ({ timeline, jobColorMap }) => {
  if (timeline.length === 0) {
    return <div className="gantt-placeholder">Gantt Chart will appear here.</div>;
  }

  const totalDuration = timeline.reduce((max, item) => Math.max(max, item.end), 0);

  return (
    <div className="gantt-chart">
        <h4>Execution Timeline</h4>
        <div className="timeline-container">
            {timeline.map((item) => { // No longer need index for color
                const widthPercentage = ((item.end - item.start) / totalDuration) * 100;
                const leftPercentage = (item.start / totalDuration) * 100;
                
                // Use the map to get the color for the specific jobId
                const color = jobColorMap[item.jobId] || '#cccccc'; // Fallback to gray

                return (
                    <div
                        key={`${item.jobId}-${item.start}`} // A more robust key for preemptive cases
                        className="gantt-bar"
                        style={{
                            width: `${widthPercentage}%`,
                            left: `${leftPercentage}%`,
                            backgroundColor: color,
                        }}
                        title={`${item.jobName} (Start: ${item.start}, End: ${item.end})`}
                    >
                        <span>{item.jobName}</span>
                    </div>
                );
            })}
        </div>
        <div className="time-axis">
            <span>0ms</span>
            <span>{totalDuration > 0 ? `${totalDuration}ms` : ''}</span>
        </div>
    </div>
  );
};

export default GanttChart;