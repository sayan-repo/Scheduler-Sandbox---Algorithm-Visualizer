import React, { useState } from 'react';

const Controls = ({ state, runSimulation, pauseSimulation, resumeSimulation, setSpeed, resetSimulation }) => {
  const { isSimulating, isPaused, originalJobs, timeQuantum } = state;
  
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [localTimeQuantum, setLocalTimeQuantum] = useState(timeQuantum);

  const handleRun = () => {
    runSimulation(algorithm, parseInt(localTimeQuantum));
  };

  return (
    <div className="controls">
      <h3>Controls</h3>
      <div className="form-group">
        <label>Algorithm</label>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isSimulating}>
          <option value="FCFS">First-Come, First-Served</option>
          <option value="SRTF">Shortest Remaining Time First (SRTF)</option>
          <option value="LRTF">Longest Remaining Time First (LRTF)</option>
          <option value="PRIORITY">Priority (Preemptive)</option>
          <option value="RR">Round Robin</option>
        </select>
      </div>

      {algorithm === 'RR' && (
        <div className="form-group">
          <label>Time Quantum (ms)</label>
          <input 
            type="number" 
            value={localTimeQuantum} 
            onChange={(e) => setLocalTimeQuantum(e.target.value)} 
            min="1"
            disabled={isSimulating}
          />
        </div>
      )}
      
      <div className="form-group">
        <label>Simulation Speed</label>
        <input 
          type="range" 
          min="0" 
          max="490" 
          step="10"
          defaultValue="50"
          onChange={(e) => setSpeed(500 - parseInt(e.target.value))}
          className="speed-slider"
        />
      </div>

      <div className="button-group">
        {!isSimulating && (
          <button onClick={handleRun} disabled={originalJobs.length === 0}>
            Run
          </button>
        )}
        
        {isSimulating && !isPaused && <button onClick={pauseSimulation}>Pause</button>}
        {isSimulating && isPaused && <button onClick={resumeSimulation}>Resume</button>}

        <button onClick={resetSimulation}>Reset</button>
      </div>
    </div>
  );
};

export default Controls;