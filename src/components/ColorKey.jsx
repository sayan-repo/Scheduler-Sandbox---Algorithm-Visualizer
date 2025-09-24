import React from 'react';

const ColorKey = ({ jobs, jobColorMap }) => {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="color-key-container">
      <h4>Job Color Key</h4>
      <div className="color-key-list">
        {jobs.map(job => (
          <div key={job.id} className="color-key-item">
            <span 
              className="color-key-box" 
              style={{ backgroundColor: jobColorMap[job.id] || '#cccccc' }}
            ></span>
            <span>{job.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorKey;