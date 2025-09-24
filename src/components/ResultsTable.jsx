import React from 'react';

const ResultsTable = ({ jobs }) => {
  if (jobs.length === 0) return null;

  const finishedJobs = jobs.filter(job => job.state === 'finished');
  if (finishedJobs.length === 0) return null;

  return (
    <div className="results-table-container">
      <h4>Process Details</h4>
      <table className="results-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Arrival</th>
            <th>Burst</th>
            <th>Priority</th>
            <th>Completion</th>
            <th>Turnaround</th>
            <th>Waiting</th>
          </tr>
        </thead>
        <tbody>
          {finishedJobs.sort((a, b) => a.id - b.id).map(job => (
            <tr key={job.id}>
              <td>{job.name}</td>
              <td>{job.arrival}</td>
              <td>{job.burst}</td>
              <td>{job.priority}</td>
              <td>{job.completionTime}</td>
              <td>{job.turnaroundTime}</td>
              <td>{job.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;