import React, { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useJobScheduler } from './hooks/useJobScheduler';
import JobForm from './components/JobForm';
import Controls from './components/Controls';
import GanttChart from './components/GanttChart';
import MetricsDisplay from './components/MetricsDisplay';
import JobQueue from './components/JobQueue';
import ResultsTable from './components/ResultsTable';
import ColorKey from './components/ColorKey';
import './App.css';

const PRESET_COLORS = ['#88d8b0', '#ffcc5c', '#ff6f69', '#96ceb4', '#ffeead', '#d96459', '#85a29e', '#f2a25c', '#6495ed'];

function App() {
  const { state, addJob, resetSimulation, runSimulation, pauseSimulation, resumeSimulation, setSpeed } = useJobScheduler();
  const { originalJobs, timeline, metrics, readyQueue, algorithm } = state;

  const jobColorMap = useMemo(() => {
    const map = {};
    originalJobs.forEach((job, index) => {
      map[job.id] = PRESET_COLORS[index % PRESET_COLORS.length];
    });
    return map;
  }, [originalJobs]);

  return (
    <div className="app-container">
      <Toaster position="top-center" />
      <header>
        <h1>Scheduler Sandbox 🔬</h1>
        <p>Visualize & Compare CPU Scheduling Algorithms</p>
      </header>
      <main>
        <div className="config-panel">
          <div className="panel-header">
            <h3>Configuration</h3>
            <span className="job-counter">Jobs Loaded: {originalJobs.length}</span>
          </div>
          <JobForm addJob={addJob} existingJobs={originalJobs} />
          <Controls 
            state={state} 
            runSimulation={runSimulation} 
            pauseSimulation={pauseSimulation}
            resumeSimulation={resumeSimulation}
            resetSimulation={resetSimulation}
            setSpeed={setSpeed}
          />
          <JobQueue queue={readyQueue} algorithm={algorithm} />
        </div>
        <div className="results-panel">
          <h2>Simulation Results</h2>
          <MetricsDisplay metrics={metrics} />
          <GanttChart timeline={timeline} jobColorMap={jobColorMap} />
          <div className="details-grid">
            <ResultsTable jobs={state.jobs} />
            <ColorKey jobs={originalJobs} jobColorMap={jobColorMap} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;