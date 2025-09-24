import React from 'react';
import './../App.css'; 

const JobQueue = ({ queue, algorithm }) => {
  return (
    <div className="job-queue-container">
      <h4>Ready Queue ({algorithm})</h4>
      <div className="queue-visual">
        {queue.length === 0 ? (
          <span className="empty-queue">Queue is empty</span>
        ) : (
          queue.map(job => (
            <div key={job.id} className="queue-job-card">
              <span className="job-name">{job.name}</span>
              <span className="job-detail">
                {algorithm === 'SRTF' ? `Rem: ${job.remainingTime}ms` : `Prio: ${job.priority}`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobQueue;