import React from 'react';

const GanttChart = ({ timeline, jobColorMap }) => {
  if (timeline.length === 0) {
    return <div className="gantt-placeholder">Gantt Chart will appear here.</div>;
  }

  const totalDuration = timeline.reduce((max, item) => Math.max(max, item.end), 0);

  return (
    <div className="gantt-chart">
        <h4>Execution Timeline</h4>
        <div className="timeline-container">
            {timeline.map((item) => { 
                const widthPercentage = ((item.end - item.start) / totalDuration) * 100;
                const leftPercentage = (item.start / totalDuration) * 100;
                
                const color = jobColorMap[item.jobId] || '#cccccc'; 

                return (
                    <div
                        key={`${item.jobId}-${item.start}`}
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